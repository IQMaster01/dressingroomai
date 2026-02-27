import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, LogOut, Loader2, Save, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  affiliate_link: string;
  click_count: number;
  tryon_count: number;
}

const emptyForm = { name: "", description: "", image_url: "", affiliate_link: "" };

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/admin-login"); return; }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin");

    if (!roles?.length) { navigate("/admin-login"); return; }
    loadProducts();
  };

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to load products");
    else setProducts(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editId) {
        const { error } = await supabase
          .from("products")
          .update({ name: form.name, description: form.description, image_url: form.image_url, affiliate_link: form.affiliate_link })
          .eq("id", editId);
        if (error) throw error;
        toast.success("Product updated!");
      } else {
        const { error } = await supabase
          .from("products")
          .insert({ name: form.name, description: form.description, image_url: form.image_url, affiliate_link: form.affiliate_link });
        if (error) throw error;
        toast.success("Product added!");
      }
      setForm(emptyForm);
      setFormOpen(false);
      setEditId(null);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description || "", image_url: p.image_url, affiliate_link: p.affiliate_link });
    setEditId(p.id);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Product deleted"); loadProducts(); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => { setForm(emptyForm); setEditId(null); setFormOpen(!formOpen); }}
              className="bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> Add Product
            </button>
            <button
              onClick={handleLogout}
              className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-secondary transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {formOpen && (
          <form onSubmit={handleSubmit} className="border border-border bg-card p-6 mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-semibold">{editId ? "Edit Product" : "New Product"}</h2>
              <button type="button" onClick={() => { setFormOpen(false); setEditId(null); }}>
                <X size={18} className="text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
            <input
              placeholder="Image URL"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              required
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
            <input
              placeholder="Affiliate Link"
              value={form.affiliate_link}
              onChange={(e) => setForm({ ...form, affiliate_link: e.target.value })}
              required
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 inline-flex items-center gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {editId ? "Update" : "Add Product"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No products yet. Add your first one!</p>
        ) : (
          <div className="border border-border divide-y divide-border">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <img src={p.image_url} alt={p.name} className="w-16 h-20 object-cover bg-secondary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Clicks: {p.click_count} · Try-ons: {p.tryon_count}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(p)} className="p-2 hover:bg-secondary rounded transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
