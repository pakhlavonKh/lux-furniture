import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/useLanguageHook";
import manakuLogo from "@/assets/manaku_logo.png";

const navigation = [
  { name: "Showcase", key: "navigation.showcase", href: "/showcase" },
  { name: "Catalog", key: "navigation.catalog", href: "/" },
  { name: "Collections", key: "navigation.collections", href: "/collections" },
  { name: "About", key: "navigation.about", href: "/about" },
  { name: "Contact", key: "navigation.contact", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container-luxury">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="relative z-10" style={{ pointerEvents: 'auto' }}>
            <img 
              src={manakuLogo} 
              alt="Manaku" 
              className="h-10 md:h-12 w-auto object-contain !no-underline"
              style={{ 
                transition: 'none !important', 
                opacity: '1 !important',
                filter: 'none !important',
                textDecoration: 'none !important'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "link-underline text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300",
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
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
                    language === lang && "active"
                  )}
                >
                  {lang === "en" && "EN"}
                  {lang === "ru" && "РУ"}
                  {lang === "uz" && "UZ"}
                  {language === lang && (
                    <motion.div
                      layoutId="langUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground"
                      transition={{ type: "spring", stiffness: 380, damping: 40 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hamburger"
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
                className="mt-8 flex gap-6 items-center"
              >
                <div className="flex items-center gap-4">
                  {["en", "ru", "uz"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang as "en" | "ru" | "uz")}
                      className={cn(
                        "btn-lang",
                        language === lang && "active"
                      )}
                    >
                      {lang === "en" && "EN"}
                      {lang === "ru" && "РУ"}
                      {lang === "uz" && "UZ"}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
