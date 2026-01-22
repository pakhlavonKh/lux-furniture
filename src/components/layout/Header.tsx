import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/useLanguageHook";
import type { Language } from "@/locales";

const navigation = [
  { name: "Home", key: "home", href: "/" },
  { name: "Catalog", key: "catalog", href: "/catalog" },
  { name: "Collections", key: "collections", href: "/catalog?view=collections" },
  { name: "About", key: "about", href: "/about" },
  { name: "Contact", key: "contact", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
          <Link to="/" className="relative z-10">
            <h1 className="font-serif text-xl md:text-2xl tracking-[0.1em] text-foreground">
              MAISON LUXE
            </h1>
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
            <div className="relative">
              <motion.button
                whileHover={{ opacity: 0.7 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="btn-search"
                title={t("search")}
              >
                <Search className="w-5 h-5" />
              </motion.button>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute top-full right-0 mt-4 w-96 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-border/50">
                    <input
                      type="text"
                      placeholder={t("search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
                          setIsSearchOpen(false);
                        }
                        if (e.key === "Escape") {
                          setIsSearchOpen(false);
                        }
                      }}
                      className="w-full bg-transparent outline-none text-foreground placeholder-muted-foreground text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="px-4 py-2 text-xs text-muted-foreground/80 bg-background/50">
                    {t("pressEnter")}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-6 pl-8">
              {["en", "ru", "uz"].map((lang) => (
                <motion.button
                  key={lang}
                  whileHover={{ opacity: 0.7 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLanguage(lang as Language)}
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
                      onClick={() => setLanguage(lang as Language)}
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
