import { motion } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { mockClothing } from "@/data/mockClothing";

const Gallery = () => {
  const handleAffiliateClick = (id: string, link: string) => {
    // In production: track click via backend
    console.log("Affiliate click tracked:", id);
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Curated Collection
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold">
            Clothing Gallery
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Browse our curated selection and try any item on virtually.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {mockClothing.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{item.description}</p>
                <div className="flex gap-2">
                  <Link
                    to="/try-on"
                    className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-center hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    Try This
                  </Link>
                  <button
                    onClick={() => handleAffiliateClick(item.id, item.affiliate_link)}
                    className="border border-border px-3 py-2.5 hover:bg-secondary transition-colors flex items-center justify-center"
                    title="Buy this item"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
