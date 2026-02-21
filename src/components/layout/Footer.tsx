// Footer.tsx
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";

const footerLinks = {
  explore: [
    { key: "catalog", href: "/catalog" },
    { key: "collections", href: "/catalog?view=collections" },
    { key: "newArrivals", href: "/catalog?sort=newest" },
    { key: "featured", href: "/catalog?featured=true" },
  ],
  company: [
    { key: "about", href: "/about" },
    { key: "craftsmanship", href: "/about#craftsmanship" },
    { key: "sustainability", href: "/about#sustainability" },
    { key: "contact", href: "/contact" },
  ],
  support: [
    { key: "shipping", href: "/shipping" },
    { key: "returns", href: "/returns" },
    { key: "careGuide", href: "/care-guide" },
    { key: "faq", href: "/faq" },
  ],
};

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="container-luxury pt-12">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-3xl tracking-[0.18em]">
                MANAKU
              </h2>
            </Link>

            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs mb-8">
              {t("footer.description")}
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="opacity-70 hover:opacity-100 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="opacity-70 hover:opacity-100 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="opacity-70 hover:opacity-100 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-primary-foreground/90 mb-6">
              {t("footer.explore.title")}
            </h3>
            <div className="flex flex-col gap-4">
              {footerLinks.explore.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200 hover:translate-x-1"
                >
                  {t(`footer.explore.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-primary-foreground/90 mb-6">
              {t("footer.company.title")}
            </h3>
            <div className="flex flex-col gap-4">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200 hover:translate-x-1"
                >
                  {t(`footer.company.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-primary-foreground/90 mb-6">
              {t("footer.support.title")}
            </h3>
            <div className="flex flex-col gap-4">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200 hover:translate-x-1"
                >
                  {t(`footer.support.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-8 pt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} {t("footer.rights")}
          </p>

          <div className="flex gap-8">
            <Link
              to="/privacy"
              className="text-xs text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors"
            >
              {t("footer.privacy")}
            </Link>

            <Link
              to="/terms"
              className="text-xs text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}