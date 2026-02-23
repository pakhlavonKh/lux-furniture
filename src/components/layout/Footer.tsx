// Footer.tsx
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="container-luxury pt-12">
        
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-3xl tracking-[0.18em]">MANAKU</h2>
            </Link>
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">

            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs mb-8">
              {t("footer.description")}
            </p>

            {/* <div className="flex gap-4">
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
            </div> */}
          </div>

          {/* Desktop Contact Column */}
          <div className="contact-info-desktop lg:col-span-3">
            <div className="contact-info-list">
              <div className="contact-info-item">
                <p className="contact-info-label">{t("contact.phoneTitle")}</p>
                <a href="tel:+998955215050" className="contact-info-link">
                  +998 95 521 50 50
                </a>
              </div>

              <div className="contact-info-item">
                <p className="contact-info-label">{t("contact.emailTitle")}</p>
                <a href="mailto:info@manaku.com" className="contact-info-link">
                  info@manaku.com
                </a>
              </div>

              <div className="contact-info-item">
                <p className="contact-info-label">
                  {t("contact.addressTitle")}
                </p>
                <p className="contact-info-text">
                  {t("footer.addressLine1")}
                  <br />
                  {t("footer.addressLine2")}
                </p>
              </div>
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
