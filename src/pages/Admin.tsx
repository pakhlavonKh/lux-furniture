import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/useLanguageHook";
import {
  CatalogProduct,
  getCatalogProducts,
  setProductStock,
  setVariantStock,
} from "@/data/catalogData";

interface User {
  email: string;
  id?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventory, setInventory] = useState<CatalogProduct[]>([]);
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});

  const buildStockInputs = (products: CatalogProduct[]): Record<string, string> => {
    const next: Record<string, string> = {};

    for (const product of products) {
      next[product.id] = product.stock.toString();
      for (const variant of product.variants) {
        next[variant.id] = variant.stock.toString();
      }
    }

    return next;
  };

  const loadInventory = () => {
    const products = getCatalogProducts();
    setInventory(products);
    setStockInputs(buildStockInputs(products));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("adminUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("adminUser");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      loadInventory();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStockInputChange = (key: string, value: string) => {
    setStockInputs((prev) => ({ ...prev, [key]: value }));
  };

  const parseStock = (value: string): number | null => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return null;
    }
    return parsed;
  };

  const handleSaveProductStock = (productId: string) => {
    const parsed = parseStock(stockInputs[productId] ?? "");
    if (parsed === null) {
      toast({
        title: "Invalid stock",
        description: "Stock must be a non-negative integer.",
        variant: "destructive",
      });
      return;
    }

    if (!setProductStock(productId, parsed)) {
      toast({
        title: "Error",
        description: "Failed to update product stock.",
        variant: "destructive",
      });
      return;
    }

    loadInventory();
    toast({
      title: "Stock updated",
      description: "Product stock was saved.",
      duration: 3000,
    });
  };

  const handleSaveVariantStock = (variantId: string) => {
    const parsed = parseStock(stockInputs[variantId] ?? "");
    if (parsed === null) {
      toast({
        title: "Invalid stock",
        description: "Stock must be a non-negative integer.",
        variant: "destructive",
      });
      return;
    }

    if (!setVariantStock(variantId, parsed)) {
      toast({
        title: "Error",
        description: "Failed to update variant stock.",
        variant: "destructive",
      });
      return;
    }

    loadInventory();
    toast({
      title: "Stock updated",
      description: "Variant stock was saved.",
      duration: 3000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Login failed");
        }

        const data = await response.json();
        const userData: User = { email: formData.email, id: data.userId };

        localStorage.setItem("adminUser", JSON.stringify(userData));
        localStorage.setItem("authToken", data.token);
        setUser(userData);

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
          duration: 4000,
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match.",
            variant: "destructive",
            duration: 5000,
          });
          setIsSubmitting(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Registration failed");
        }

        const data = await response.json();
        const userData: User = { email: formData.email, id: data.userId };

        localStorage.setItem("adminUser", JSON.stringify(userData));
        localStorage.setItem("authToken", data.token);
        setUser(userData);

        toast({
          title: "Account created!",
          description: "You have successfully registered.",
          duration: 4000,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("authToken");
    setUser(null);
    setFormData({ email: "", password: "", confirmPassword: "" });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    const categoryCount = new Set(inventory.map((item) => item.translationKeys.category)).size;

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container-luxury py-4 flex items-center justify-between">
            <h1 className="font-serif text-xl tracking-[0.1em]">Manaku</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="container-luxury py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-section mb-8">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Total Products", value: String(inventory.length) },
                { label: "Categories", value: String(categoryCount) },
                { label: "Collections", value: "4" },
                { label: "Inquiries", value: "12" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border p-6">
                  <p className="text-caption mb-2">{stat.label}</p>
                  <p className="font-serif text-3xl">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border p-8 mb-8">
              <h3 className="heading-card mb-6">Inventory Management</h3>
              <div className="space-y-6">
                {inventory.map((product) => (
                  <div key={product.id} className="border border-border p-5 rounded-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="font-medium">{t(product.translationKeys.title)}</p>
                        <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                      </div>

                      <div className="flex items-end gap-3">
                        <div>
                          <label htmlFor={`product-stock-${product.id}`} className="text-caption mb-2 block">
                            Product stock
                          </label>
                          <input
                            id={`product-stock-${product.id}`}
                            type="number"
                            min={0}
                            value={stockInputs[product.id] ?? "0"}
                            onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                            className="w-28 px-3 py-2 border border-border bg-transparent"
                          />
                        </div>
                        <button
                          onClick={() => handleSaveProductStock(product.id)}
                          className="btn-outline-luxury h-[42px]"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {product.variants.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        {product.variants.map((variant) => {
                          const variantLabel = variant.color || variant.material || variant.size || variant.id;

                          return (
                            <div key={variant.id} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                              <p className="text-sm">Variant: {variantLabel}</p>
                              <div className="flex items-end gap-3">
                                <div>
                                  <label htmlFor={`variant-stock-${variant.id}`} className="text-caption mb-2 block">
                                    Variant stock
                                  </label>
                                  <input
                                    id={`variant-stock-${variant.id}`}
                                    type="number"
                                    min={0}
                                    value={stockInputs[variant.id] ?? "0"}
                                    onChange={(e) => handleStockInputChange(variant.id, e.target.value)}
                                    className="w-28 px-3 py-2 border border-border bg-transparent"
                                  />
                                </div>
                                <button
                                  onClick={() => handleSaveVariantStock(variant.id)}
                                  className="btn-outline-luxury h-[42px]"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground text-sm">
              Stock is now persisted in localStorage and shared by catalog/admin views.
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1 className="font-serif text-2xl tracking-[0.1em] mb-2">Manaku</h1>
          <p className="text-muted-foreground text-sm">Admin Portal</p>
        </div>

        <div className="bg-card border border-border p-8">
          <h2 className="heading-card text-center mb-8">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-caption mb-2 block">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-caption mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="text-caption mb-2 block">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-luxury w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Loading..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLogin ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          <a href="/" className="hover:text-foreground transition-colors">
            {"< Back to website"}
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Admin;
