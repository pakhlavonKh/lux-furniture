// App.tsx
import { useEffect } from "react";
const App = () => (
  <LanguageProvider>
    <AppWithLanguage />
  </LanguageProvider>
);

export default App;
import { Helmet, HelmetProvider } from "react-helmet-async";
// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/useLanguageHook";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Collections from "./pages/Collections";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account/AccountPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppWithLanguage() {
  const { language, t } = useLanguage();

  // Dynamic, multilingual title
  const titles = {
    uz: "Manaku | Premium mebel kolleksiyasi",
    en: "Manaku | Premium Furniture Collection",
    ru: "Manaku | Премиальная коллекция мебели"
  };
  const title = titles[language] || titles.en;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* <Toaster /> */}
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/showcase" element={<Index />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
