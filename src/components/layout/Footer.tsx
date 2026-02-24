// Footer.tsx
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguageHook";
import manakuLogoReversed from "@/assets/manaku_logo_reversed.png";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <Link to="/" className="footer-logo">
          <img src={manakuLogoReversed} alt="Manaku Logo" />
        </Link>
        <div className="footer-columns">
          <div className="footer-col footer-col--desk">
            <h4>{t("footer.catalogSection.title")}</h4>
            <ul>
              <li>
                <Link to="/category/storage">{t("categories.storage")}</Link>
              </li>
              <li>
                <Link to="/category/kitchen">{t("categories.kitchen")}</Link>
              </li>
              <li>
                <Link to="/category/office">{t("categories.office")}</Link>
              </li>
              <li>
                <Link to="/category/children">{t("categories.children")}</Link>
              </li>
              <li>
                <Link to="/category/garden">{t("categories.garden")}</Link>
              </li>
              <li>
                <Link to="/category/industrial">{t("categories.industrial")}</Link>
              </li>
              <li>
                <Link to="/category/accessories">{t("categories.accessories")}</Link>
              </li>
              <li>
                <Link to="/category/components">
                  {t("footer.catalogSection.components")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-col--desk">
            <h4>{t("footer.clients.title")}</h4>
            <ul>
              <li>
                <Link to="/delivery">{t("footer.clients.delivery")}</Link>
              </li>
              <li>
                <Link to="/warranty">{t("footer.clients.warranty")}</Link>
              </li>
              <li>
                <Link to="/payment">{t("footer.clients.payment")}</Link>
              </li>
              <li>
                <Link to="/returns">{t("footer.clients.returns")}</Link>
              </li>
              <li>
                <Link to="/faq">{t("footer.clients.faq")}</Link>
              </li>
              <li>
                <Link to="/custom">{t("footer.clients.custom")}</Link>
              </li>
              <li>
                <Link to="/b2b">{t("footer.clients.b2b")}</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-col--desk">
            <h4>{t("footer.companyInfo.title")}</h4>
            <ul>
              <li>
                <Link to="/about">{t("footer.companyInfo.aboutBrand")}</Link>
              </li>
              <li>
                <Link to="/production">{t("footer.companyInfo.production")}</Link>
              </li>
              <li>
                <Link to="/guarantee">{t("footer.companyInfo.guarantee")}</Link>
              </li>
              <li>
                <Link to="/b2b">{t("footer.companyInfo.b2b")}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-col--desk">
            <h4>{t("footer.contacts.title")}</h4>
            <ul>
              <li>
                <a href="tel:+998955215050">+998 95 521 50 50</a>
              </li>
              <li>
                <a href="mailto:info@manaku.com">info@manaku.com</a>
              </li>
              <li>
                {t("footer.addressLine1")}
                <br />
                {t("footer.addressLine2")}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {t("footer.rights")}
        </p>
        <div className="footer-bottom-links">
          <Link to="/privacy">{t("footer.privacy")}</Link>
          <Link to="/terms">{t("footer.terms")}</Link>
        </div>
      </div>
    </footer>
  );
}
