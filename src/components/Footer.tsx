import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-lg font-semibold mb-3">
            Changing Room <span className="text-gradient-gold">AI</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your personal AI-powered virtual fitting room. Try on any outfit instantly with realistic results.
          </p>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-3">Navigate</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/try-on" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Try On</Link>
            <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gallery</Link>
          </div>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-3">Legal</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Privacy Policy</span>
            <span className="text-sm text-muted-foreground">Terms of Service</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Changing Room AI. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
