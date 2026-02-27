import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check admin role
      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin");

      if (roleError || !roles?.length) {
        await supabase.auth.signOut();
        toast.error("Access denied. Admin privileges required.");
        return;
      }

      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } catch (err: any) {
      toast.error(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-border bg-card p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
            <Lock size={20} />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage gallery</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground py-3 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
