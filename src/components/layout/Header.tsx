import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/useLanguageHook";
import manakuLogo from "@/assets/manaku_logo.png";

interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const navigation = [
  { name: "Showcase", key: "navigation.showcase", href: "/showcase" },
  { name: "Catalog", key: "navigation.catalog", href: "/" },
  { name: "Collections", key: "navigation.collections", href: "/collections" },
  { name: "About", key: "navigation.about", href: "/about" },
  { name: "Contact", key: "navigation.contact", href: "/contact" },
];

// Cart hook with fallback
const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const cartJson = localStorage.getItem("cart") || "[]";
        const cart = JSON.parse(cartJson);
        setCartItems(Array.isArray(cart) ? cart : []);
      } catch {
        setCartItems([]);
      }
    };

    loadCart();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        loadCart();
      }
    };

    // Listen for custom events from same tab
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return { items: cartItems };
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { items: cartItems } = useCart();

  // Calculate unique item count
  const cartCount = cartItems?.length || 0;
  const isWhiteHeaderAtTop =
    !isScrolled &&
    (location.pathname === "/showcase" || location.pathname === "/about");

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 header",
        isWhiteHeaderAtTop && "header-white-top",
        isOpen
          ? "bg-background"
          : isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-transparent",
      )}
    >
      <nav className="container-luxury">
        <div className="flex items-center justify-between h-20 md:h-24 sm:py-2">
          {/* Logo */}
          <Link
            to="/"
            className="relative z-10 my-auto h-10"
            style={{ pointerEvents: "auto" }}
          >
            <img
              src={manakuLogo}
              alt="Manaku"
              className="logo-wrapper relative z-10"
              style={{ pointerEvents: "auto" }}
            />
            <span className="logo-tm">™</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "link-underline header-link text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300",
                  isWhiteHeaderAtTop
                    ? "header-link-inverse"
                    : location.pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  location.pathname === item.href && "is-active",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Language Switcher */}
            <div className="flex items-center gap-6">
              {["en", "ru", "uz"].map((lang) => (
                <motion.button
                  key={lang}
                  whileHover={{ opacity: 0.7 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLanguage(lang as "en" | "ru" | "uz")}
                  className={cn(
                    "btn-lang",
                    isWhiteHeaderAtTop && "btn-lang-inverse",
                    language === lang && "active",
                  )}
                >
                  {lang === "en" && "EN"}
                  {lang === "ru" && "РУ"}
                  {lang === "uz" && "UZ"}
                  {language === lang && (
                    <motion.div
                      layoutId="langUnderline"
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-0.5",
                        isWhiteHeaderAtTop ? "bg-white" : "bg-foreground",
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 40,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* User & Cart Icons */}
            <div className="flex items-center gap-5">
              {/* Account Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={isLoggedIn ? "/account" : "/login"}
                  className={cn(
                    "header-icon-link bg-transparent border-none transition-all duration-300 cursor-pointer p-0 inline-flex",
                    isWhiteHeaderAtTop
                      ? "header-icon-link-inverse"
                      : "text-foreground hover:text-muted-foreground",
                  )}
                  title={t("header.account") || "Account"}
                >
                  <User className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
              </motion.div>

              {/* Shopping Bag Icon with Badge */}
              <div className="relative inline-flex">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/cart"
                    className={cn(
                      "header-icon-link bg-transparent border-none transition-all duration-300 cursor-pointer p-0 inline-flex",
                      isWhiteHeaderAtTop
                        ? "header-icon-link-inverse"
                        : "text-foreground hover:text-muted-foreground",
                    )}
                    title={t("header.cart") || "Cart"}
                  >
                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                  </Link>
                </motion.div>

                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="cart-badge"
                >
                  {cartCount}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "hamburger",
              isWhiteHeaderAtTop && "hamburger-inverse",
            )}
          >
            {isOpen ? (
              <X className="hamburger-x" />
            ) : (
              <>
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-49 lg:hidden"
          >
            <div className="flex flex-col items-center justify-center min-h-screen gap-8">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className="font-serif text-2xl text-foreground hover:text-muted-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col gap-6 items-center"
              >
                <div className="flex items-center gap-4">
                  {["en", "ru", "uz"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang as "en" | "ru" | "uz")}
                      className={cn("btn-lang", language === lang && "active")}
                    >
                      {lang === "en" && "EN"}
                      {lang === "ru" && "РУ"}
                      {lang === "uz" && "UZ"}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <Link
                    to={isLoggedIn ? "/account" : "/login"}
                    className="text-foreground hover:text-muted-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                    title={t("header.account") || "Account"}
                  >
                    <User className="w-6 h-6" />
                  </Link>

                  <div className="relative inline-flex">
                    <Link
                      to="/cart"
                      className="text-foreground hover:text-muted-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                      title={t("header.cart") || "Cart"}
                    >
                      <ShoppingBag className="w-6 h-6" />
                    </Link>
                    <span className="cart-badge">{cartCount}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
