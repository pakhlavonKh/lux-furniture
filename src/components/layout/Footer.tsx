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
    <footer className="bg-primary text-primary-foreground">
      <div className="container-luxury section-padding">

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-2xl tracking-[0.1em]">
                MANAKU
              </h2>
            </Link>

            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm mb-8">
              {t("footer.description")}
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="soical-links"
              >
                <Instagram className="social-icons" />
              </a>
              <a
                href="#"
                className="social-links"
              >
                <Facebook className="social-icons" />
              </a>
              <a
                href="#"
                className="social-links"
              >
                <Linkedin className="social-icons" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-caption mb-6">
              {t("footer.explore.title")}
            </h3>
            <div className="flex flex-col gap-4">
              {footerLinks.explore.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {t(`footer.explore.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-caption mb-6">
              {t("footer.company.title")}
            </h3>
            <div className="flex flex-col gap-4">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {t(`footer.company.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-caption mb-6">
              {t("footer.support.title")}
            </h3>
            <div className="flex flex-col gap-4">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {t(`footer.support.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <p className="text-xs text-primary-foreground/50">
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