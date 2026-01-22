import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { useState } from "react";

const footerLinks = {
  explore: [
    { name: "Catalog", href: "/catalog" },
    { name: "Collections", href: "/catalog?view=collections" },
    { name: "New Arrivals", href: "/catalog?sort=newest" },
    { name: "Featured", href: "/catalog?featured=true" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Craftsmanship", href: "/about#craftsmanship" },
    { name: "Sustainability", href: "/about#sustainability" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Shipping & Delivery", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Care Guide", href: "/care-guide" },
    { name: "FAQ", href: "/faq" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-luxury section-padding">
        

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-2xl tracking-[0.1em]">
                MAISON LUXE
              </h2>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm mb-8">
              Curating exceptional furniture pieces that transform spaces into
              sanctuaries of refined living. Each piece tells a story of
              craftsmanship and timeless design.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 border border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 border border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 border border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-caption mb-6">Explore</h3>
            <div className="flex flex-col gap-4">
              {footerLinks.explore.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-caption mb-6">Company</h3>
            <div className="flex flex-col gap-4">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-caption mb-6">Support</h3>
            <div className="flex flex-col gap-4">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Maison Luxe. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              to="/privacy"
              className="text-xs text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
