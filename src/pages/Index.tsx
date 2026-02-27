import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Sparkles, Download, ShieldCheck, Zap, Eye } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Upload,
    title: "Upload Your Photo",
    desc: "Upload any photo — full body, half body, or upper body. We handle the rest.",
  },
  {
    icon: Sparkles,
    title: "AI Try-On",
    desc: "Our AI preserves your identity, face, and body while fitting clothing perfectly.",
  },
  {
    icon: Download,
    title: "Download & Share",
    desc: "Get high-resolution results instantly. Download or share with friends.",
  },
];

const trustPoints = [
  { icon: ShieldCheck, text: "100% Identity Preservation" },
  { icon: Zap, text: "Results in Seconds" },
  { icon: Eye, text: "Ultra-Realistic Quality" },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Fashion studio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              AI-Powered Virtual Fitting
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              Your Personal{" "}
              <span className="text-gradient-gold">AI</span>{" "}
              Changing Room
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Try on any outfit virtually with zero compromise on identity. 
              Your face, your body, your style — just new clothes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/try-on"
                className="bg-primary text-primary-foreground px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Try Now — It's Free
              </Link>
              <Link
                to="/gallery"
                className="border border-border px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors"
              >
                Browse Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-secondary/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {trustPoints.map((tp) => (
              <div key={tp.text} className="flex items-center gap-2 text-muted-foreground">
                <tp.icon size={18} />
                <span className="text-sm font-medium">{tp.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Simple Process
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center p-8 border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center bg-secondary rounded-full">
                  <f.icon size={22} className="text-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Ready to Try On?
            </h2>
            <p className="text-lg opacity-70 mb-8 max-w-md mx-auto">
              Upload your photo and see yourself in any outfit — in seconds.
            </p>
            <Link
              to="/try-on"
              className="inline-block bg-primary-foreground text-primary px-10 py-4 font-body text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Start Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
