import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Plus, X, Edit2, Trash2, Loader2, Package, Search, Package2, Grid3x3, Newspaper, Percent, LogOut, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/useLanguageHook";
import {
  CatalogProduct,
  getProducts,
  getCategories,
} from "@/data/catalogData";
import {
  News as NewsType,
  Discount as DiscountType,
  ProductData,
  LocalizedString,
  ProductImage,
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getApiProducts,
  deleteApiProduct,
} from "@/lib/api";
import { ProductForm } from "@/components/admin/ProductForm";
import { MultiLangInput } from "@/components/admin/MultiLangInput";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface User {
  email: string;
  id?: string;
  is_admin?: boolean;
}

const emptyLocalized = (): LocalizedString => ({ en: "", ru: "", uz: "" });

// Mock data for development
const MOCK_NEWS: NewsType[] = [
  {
    _id: "1",
    title: { en: "New Spring Collection", ru: "Новая весенняя коллекция", uz: "Yangi bahor kolleksiyasi" },
    description: { en: "Spring collection description", ru: "Описание весенней коллекции", uz: "Bahor kolleksiyasining tavsifi" },
    content: { en: "Full spring collection content", ru: "Полное содержание весенней коллекции", uz: "Bahor kolleksiyasining to'liq mundarijasi" },
    isActive: true,
    order: 1,
    image: { url: "https://res.cloudinary.com/demo/image/upload/v1/spring.jpg", public_id: "spring", alt: "Spring" },
  },
  {
    _id: "2",
    title: { en: "Design Workshop", ru: "Семинар по дизайну", uz: "Dizayn seminari" },
    description: { en: "Workshop description", ru: "Описание семинара", uz: "Seminar tavsifi" },
    content: { en: "Join our design workshop", ru: "Присоединитесь к нашему семинару", uz: "Bizning seminariga qo'shiling" },
    isActive: true,
    order: 2,
  },
];

const MOCK_DISCOUNTS: DiscountType[] = [
  {
    _id: "1",
    title: { en: "Office Desk Sale", ru: "Распродажа офисного стола", uz: "Ofis stoli sotuvlari" },
    description: { en: "15% off office desks", ru: "15% скидка на офисные столы", uz: "Ofis stolov bo'yicha 15% chegirma" },
    percentage: 15,
    productIds: ["1", "2"],
    isActive: true,
    order: 1,
  },
  {
    _id: "2",
    title: { en: "Cabinet Collection", ru: "Коллекция шкафов", uz: "Kabinet kolleksiyasi" },
    description: { en: "20% off cabinets", ru: "20% скидка на шкафы", uz: "Shkaflari bo'yicha 20% chegirma" },
    percentage: 20,
    productIds: ["3", "4"],
    isActive: true,
    order: 2,
  },
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "inventory" | "news" | "discounts">("products");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventory, setInventory] = useState<CatalogProduct[]>([]);
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryCategory, setInventoryCategory] = useState<string>("all");

  // Products management (database)
  const [dbProducts, setDbProducts] = useState<ProductData[]>([]);
  const [dbProductsLoading, setDbProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  // News management
  const [news, setNews] = useState<NewsType[]>([]);
  const [newsList, setNewsList] = useState<NewsType[]>([]);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsType | null>(null);
  const [newsFormData, setNewsFormData] = useState<Partial<NewsType>>({
    title: emptyLocalized(),
    description: emptyLocalized(),
    content: emptyLocalized(),
    isActive: true,
    order: 0,
  });
  const [newsLoading, setNewsLoading] = useState(false);

  // Discounts management
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountType | null>(null);
  const [discountFormData, setDiscountFormData] = useState<Partial<DiscountType>>({
    title: emptyLocalized(),
    description: emptyLocalized(),
    percentage: 0,
    productIds: [],
    code: "",
    isActive: true,
    order: 0,
  });
  const [discountLoading, setDiscountLoading] = useState(false);

  const buildStockInputs = (products: CatalogProduct[]): Record<string, string> => {
    const next: Record<string, string> = {};

    for (const product of products) {
      // Only track variant stock in the new model
      if (product.variants) {
        for (const variant of product.variants) {
          // Note: Stock property not yet implemented in model, defaulting to 0
          next[variant.id] = "0";
        }
      }
    }

    return next;
  };

  const loadInventory = useCallback(() => {
    const products = getProducts();
    setInventory(products);
    setStockInputs(buildStockInputs(products));
  }, []);

  const loadDbProducts = useCallback(async () => {
    setDbProductsLoading(true);
    try {
      const data = await getApiProducts();
      setDbProducts(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load products from database",
        variant: "destructive",
      });
    } finally {
      setDbProductsLoading(false);
    }
  }, [toast]);

  const loadNewsAndDiscounts = useCallback(async () => {
    try {
      const [newsData, discountsData] = await Promise.all([
        getAllNews(false),
        getAllDiscounts(false),
      ]);
      setNewsList(newsData);
      setDiscounts(discountsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load news and discounts",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    // Check for admin user in localStorage
    // First check for saved adminUser (from old Admin login system)
    const savedUser = localStorage.getItem("adminUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem("adminUser");
      }
    }

    // Then check for regular user logged in via Login.tsx/Signup.tsx
    const regularUser = localStorage.getItem("user");
    if (regularUser) {
      try {
        const parsedUser = JSON.parse(regularUser);
        // Check if this user is an admin
        if (parsedUser.is_admin) {
          setUser(parsedUser);
          setLoading(false);
          return;
        } else {
          // Non-admin user trying to access admin page
          navigate("/account", { replace: true });
          setLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem("user");
      }
    }

    // No user found, show login form
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadInventory();
      loadNewsAndDiscounts();
      loadDbProducts();
    }
  }, [user, loadInventory, loadNewsAndDiscounts, loadDbProducts]);

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
        
        // Check if user is admin
        if (!data.user?.is_admin) {
          throw new Error("You do not have admin access.");
        }

        const userData: User = { 
          email: formData.email, 
          id: data.user?.id || data.userId,
          is_admin: data.user?.is_admin || false 
        };

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
            name: formData.email.split("@")[0],
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Registration failed");
        }

        const data = await response.json();
        
        // Check if user is admin
        if (!data.user?.is_admin) {
          throw new Error("You do not have admin access.");
        }

        const userData: User = { 
          email: formData.email, 
          id: data.user?.id || data.userId,
          is_admin: data.user?.is_admin || false 
        };

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
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    setFormData({ email: "", password: "", confirmPassword: "" });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  // News handlers
  const handleSaveNews = async () => {
    try {
      if (!newsFormData.title?.en || !newsFormData.title?.ru || !newsFormData.title?.uz ||
          !newsFormData.description?.en || !newsFormData.description?.ru || !newsFormData.description?.uz) {
        toast({
          title: "Error",
          description: "Title and description are required in all 3 languages",
          variant: "destructive",
        });
        return;
      }

      setNewsLoading(true);
      if (editingNews) {
        await updateNews(editingNews._id || editingNews.id || "", newsFormData);
      } else {
        await createNews(newsFormData as NewsType);
      }

      await loadNewsAndDiscounts();
      setShowNewsForm(false);
      setEditingNews(null);
      setNewsFormData({
        title: emptyLocalized(),
        description: emptyLocalized(),
        content: emptyLocalized(),
        isActive: true,
        order: 0,
      });

      toast({
        title: "Success",
        description: editingNews ? "News updated successfully" : "News created successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save news",
        variant: "destructive",
      });
    } finally {
      setNewsLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteNews(id);
      await loadNewsAndDiscounts();
      toast({
        title: "Success",
        description: "News deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete news",
        variant: "destructive",
      });
    }
  };

  const handleEditNews = (newsItem: NewsType) => {
    setEditingNews(newsItem);
    setNewsFormData(newsItem);
    setShowNewsForm(true);
  };

  // Discount handlers
  const handleSaveDiscount = async () => {
    try {
      if (!discountFormData.title?.en || !discountFormData.title?.ru || !discountFormData.title?.uz ||
          !discountFormData.description?.en || !discountFormData.description?.ru || !discountFormData.description?.uz) {
        toast({
          title: "Error",
          description: "Title and description are required in all 3 languages",
          variant: "destructive",
        });
        return;
      }

      if (discountFormData.percentage === undefined) {
        toast({
          title: "Error",
          description: "Discount percentage is required",
          variant: "destructive",
        });
        return;
      }

      setDiscountLoading(true);
      if (editingDiscount) {
        await updateDiscount(editingDiscount._id || editingDiscount.id || "", discountFormData);
      } else {
        await createDiscount(discountFormData as DiscountType);
      }

      await loadNewsAndDiscounts();
      setShowDiscountForm(false);
      setEditingDiscount(null);
      setDiscountFormData({
        title: emptyLocalized(),
        description: emptyLocalized(),
        percentage: 0,
        productIds: [],
        code: "",
        isActive: true,
        order: 0,
      });

      toast({
        title: "Success",
        description: editingDiscount ? "Discount updated successfully" : "Discount created successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save discount",
        variant: "destructive",
      });
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    try {
      await deleteDiscount(id);
      await loadNewsAndDiscounts();
      toast({
        title: "Success",
        description: "Discount deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete discount",
        variant: "destructive",
      });
    }
  };

  const handleEditDiscount = (discount: DiscountType) => {
    setEditingDiscount(discount);
    setDiscountFormData(discount);
    setShowDiscountForm(true);
  };

  // Product handlers
  const handleDeleteProduct = async (id: string) => {
    setDeletingProductId(id);
    try {
      await deleteApiProduct(id);
      await loadDbProducts();
      toast({ title: "Success", description: "Product deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setDeletingProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    const categoryCount = new Set(inventory.map((item) => item.categoryId)).size;

    return (
      <div className="min-h-screen bg-background">
        {/* Floating Logout Button */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-card border border-border p-4 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs md:text-sm text-muted-foreground truncate max-w-[180px]">{user.email}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            {t("admin.logout")}
          </motion.button>
        </div>

        <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <h1 className="font-serif text-3xl md:text-4xl tracking-[0.1em] mb-2">{t("admin.title")}</h1>
              <p className="text-muted-foreground">{t("admin.description")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              {[
                { label: "admin.dbProducts", value: String(dbProducts.length), Icon: Package2 },
                { label: "admin.catalogProducts", value: String(inventory.length), Icon: Package },
                { label: "admin.categories", value: String(categoryCount), Icon: Grid3x3 },
                { label: "admin.newsItems", value: String(newsList.length), Icon: Newspaper },
                { label: "admin.discountsCount", value: String(discounts.length), Icon: Percent },
              ].map((stat) => (
                <motion.div 
                  key={stat.label}
                  whileHover={{ translateY: -4 }}
                  className="bg-card border border-border p-4 md:p-6 rounded-lg hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-caption text-muted-foreground mb-2">{t(stat.label)}</p>
                      <p className="font-serif text-3xl md:text-4xl font-light">{stat.value}</p>
                    </div>
                    <stat.Icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground opacity-50" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Tab Navigation */}
            <div className="mb-8 border-b border-border">
              <div className="flex gap-2 md:gap-8 overflow-x-auto -mx-4 md:-mx-8 px-4 md:px-8">
                {[
                  { id: "products", label: "admin.products" },
                  { id: "inventory", label: "admin.inventory" },
                  { id: "news", label: "admin.news" },
                  { id: "discounts", label: "admin.discounts" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "products" | "inventory" | "news" | "discounts")}
                    className={`px-4 md:px-6 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-foreground border-foreground"
                        : "text-muted-foreground hover:text-foreground border-transparent hover:border-foreground/30"
                    }`}
                  >
                    {t(tab.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Tab */}
            {activeTab === "products" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border p-6 md:p-8 rounded-lg"
            >
              {showProductForm ? (
                <ProductForm
                  productId={editingProductId}
                  onClose={() => {
                    setShowProductForm(false);
                    setEditingProductId(null);
                  }}
                  onSaved={loadDbProducts}
                />
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                    <div>
                      <h3 className="heading-card mb-1">{t("admin.productsManagement")}</h3>
                      <p className="text-sm text-muted-foreground">{t("admin.productsDesc")}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingProductId(null);
                        setShowProductForm(true);
                      }}
                      className="btn-luxury flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      {t("admin.addProduct")}
                    </motion.button>
                  </div>

                  {dbProductsLoading ? (
                    <div className="py-16 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : dbProducts.length === 0 ? (
                    <div className="py-12 text-center">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">{t("admin.noProducts")}</p>
                      <p className="text-xs text-muted-foreground">{t("admin.noProductsDesc")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dbProducts.map((product) => (
                        <motion.div
                          key={product._id}
                          whileHover={{ backgroundColor: "var(--color-secondary)" }}
                          className="border border-border p-5 rounded-lg flex items-start justify-between gap-4 group transition-colors"
                        >
                          <div className="flex gap-4 flex-1 min-w-0">
                            {product.images?.[0]?.url && (
                              <img
                                src={product.images[0].url}
                                alt={product.name?.[language] || product.name?.en}
                                className="w-16 h-16 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-medium">{product.name?.[language] || product.name?.en}</h4>
                                <span className="text-xs bg-secondary px-2 py-0.5 rounded">{product.category}</span>
                                {product.isFeatured && <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded">Featured</span>}
                                {product.isActive ? (
                                  <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded">Active</span>
                                ) : (
                                  <span className="text-xs bg-red-500/20 text-red-600 px-2 py-0.5 rounded">Inactive</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {product.basePrice.toLocaleString()} UZS · {product.variants?.length || 0} variants · Stock: {product.totalStock || 0}
                              </p>
                              {product.slug && (
                                <p className="text-xs text-muted-foreground mt-0.5">/{product.slug}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => {
                                setEditingProductId(product._id!);
                                setShowProductForm(true);
                              }}
                              className="p-2 hover:bg-secondary rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => {
                                if (window.confirm(`Delete "${product.name?.[language] || product.name?.en}"? This cannot be undone.`)) {
                                  handleDeleteProduct(product._id!);
                                }
                              }}
                              disabled={deletingProductId === product._id}
                              className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingProductId === product._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
            )}

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border p-6 md:p-8 rounded-lg"
            >
              <div className="mb-8 pb-6 border-b border-border">
                <h3 className="heading-card mb-1">{t("admin.inventoryManagement")}</h3>
                <p className="text-sm text-muted-foreground">{t("admin.inventoryDesc")}</p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder={t("admin.searchProducts")}
                    className="w-full pl-10 pr-4 py-2 border border-border bg-transparent text-sm rounded focus:border-foreground focus:outline-none transition-colors"
                  />
                </div>
                <select
                  value={inventoryCategory}
                  onChange={(e) => setInventoryCategory(e.target.value)}
                  className="px-4 py-2 border border-border bg-transparent text-sm rounded focus:border-foreground focus:outline-none transition-colors"
                >
                  <option value="all">{t("admin.allCategories")}</option>
                  {getCategories().map((cat) => (
                    <option key={cat.id} value={cat.id}>{t(cat.nameKey)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-6">
                {inventory
                  .filter((product) => {
                    const matchesCategory = inventoryCategory === "all" || product.categoryId === inventoryCategory;
                    const matchesSearch = !inventorySearch || t(product.nameKey).toLowerCase().includes(inventorySearch.toLowerCase());
                    return matchesCategory && matchesSearch;
                  })
                  .map((product) => (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-border p-5 rounded-lg hover:border-foreground/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-lg">{t(product.nameKey)}</p>
                        <p className="text-xs text-muted-foreground">{product.variants?.length || 0} variants</p>
                      </div>
                      <Edit2 className="w-5 h-5 text-muted-foreground opacity-50" />
                    </div>

                    {product.variants && product.variants.length > 0 && (
                      <div className="space-y-3">
                        {product.variants.map((variant) => {
                          const variantLabel = `${variant.color ? `Color: ${variant.color}` : ''} ${variant.size ? `Size: ${variant.size}` : ''} ${variant.material ? `Material: ${variant.material}` : ''}`.trim() || variant.id;

                          return (
                            <div key={variant.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-secondary/30 p-4 rounded border border-border/50">
  
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="flex flex-col items-center">
                                  <label htmlFor={`variant-stock-${variant.id}`} className="text-caption mb-2 block text-center font-medium">Stock</label>
                                  <input
                                    id={`variant-stock-${variant.id}`}
                                    type="number"
                                    min={0}
                                    value={stockInputs[variant.id] ?? "0"}
                                    onChange={(e) => handleStockInputChange(variant.id, e.target.value)}
                                    className="w-20 px-3 py-2 border border-border bg-transparent rounded text-center font-bold text-lg"
                                  />
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSaveVariantStock(variant.id)}
                                  className="btn-luxury text-sm h-[42px] whitespace-nowrap px-4"
                                >
                                  Save
                                </motion.button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {(!product.variants || product.variants.length === 0) && (
                      <p className="text-sm text-muted-foreground bg-secondary/20 p-3 rounded">No variants available</p>
                    )}
                  </motion.div>
                ))}
              </div>
              <p className="text-muted-foreground text-xs mt-6 p-3 bg-secondary/20 rounded">
                ℹ️ Stock is persisted locally and shared between catalog and admin views
              </p>
            </motion.div>
            )}

            {/* News Tab */}
            {activeTab === "news" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border p-6 md:p-8 rounded-lg"
            >
              {/* Add News Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                <div>
                  <h3 className="heading-card mb-1">{t("admin.newsManagement")}</h3>
                  <p className="text-sm text-muted-foreground">{t("admin.newsDesc")}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowNewsForm(true);
                    setEditingNews(null);
                    setNewsFormData({
                      title: emptyLocalized(),
                      description: emptyLocalized(),
                      content: emptyLocalized(),
                      isActive: true,
                      order: 0,
                    });
                  }}
                  className="btn-luxury flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  {t("admin.addNews")}
                </motion.button>
              </div>

              {/* News Form */}
              {showNewsForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-primary/20 p-6 mb-8 rounded-lg bg-primary/5 mb-8"
                >
                  <h4 className="font-medium mb-6">{editingNews ? "Edit News" : "Create New News"}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <MultiLangInput
                        value={newsFormData.title || emptyLocalized()}
                        onChange={(v) => setNewsFormData({ ...newsFormData, title: v })}
                        label="Title"
                        required
                        placeholder="Enter news title"
                      />
                    </div>
                    <div>
                      <label className="text-caption mb-2 block font-medium">Display Order</label>
                      <input
                        type="number"
                        value={newsFormData.order || 0}
                        onChange={(e) => setNewsFormData({ ...newsFormData, order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-border bg-transparent text-sm rounded focus:border-foreground focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <ImageUploader
                      images={newsFormData.image && newsFormData.image.url && newsFormData.image.public_id ? [{
                        url: newsFormData.image.url,
                        public_id: newsFormData.image.public_id,
                        alt: newsFormData.image.alt,
                      }] : []}
                      onChange={(images) => setNewsFormData({ 
                        ...newsFormData, 
                        image: images[0] ? {
                          url: images[0].url,
                          public_id: images[0].public_id,
                          alt: images[0].alt,
                        } : undefined 
                      })}
                      multiple={false}
                      label="News Image"
                    />
                  </div>

                  <div className="mb-4">
                    <MultiLangInput
                      value={newsFormData.description || emptyLocalized()}
                      onChange={(v) => setNewsFormData({ ...newsFormData, description: v })}
                      label="Description"
                      required
                      multiline
                      rows={3}
                      placeholder="Enter news description (appears in news cards)"
                    />
                  </div>

                  <div className="mb-4">
                    <MultiLangInput
                      value={newsFormData.content || emptyLocalized()}
                      onChange={(v) => setNewsFormData({ ...newsFormData, content: v })}
                      label="Content"
                      multiline
                      rows={4}
                      placeholder="Enter full content (optional)"
                    />
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newsFormData.isActive || false}
                        onChange={(e) => setNewsFormData({ ...newsFormData, isActive: e.target.checked })}
                        className="w-4 h-4 border border-border rounded cursor-pointer"
                      />
                      <span className="text-sm font-medium">Publish Now</span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveNews}
                      disabled={newsLoading}
                      className="btn-luxury flex-1 text-sm disabled:opacity-50"
                    >
                      {newsLoading ? "Saving..." : editingNews ? "Update News" : "Create News"}
                    </motion.button>
                    <button
                      onClick={() => {
                        setShowNewsForm(false);
                        setEditingNews(null);
                        setNewsFormData({
                          title: emptyLocalized(),
                          description: emptyLocalized(),
                          content: emptyLocalized(),
                          isActive: true,
                          order: 0,
                        });
                      }}
                      className="btn-outline-luxury flex-1 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {/* News List */}
              <div className="space-y-4">
                {newsList.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground mb-2">No news items yet</p>
                    <p className="text-xs text-muted-foreground">Click "Add News" button to create your first news item</p>
                  </div>
                ) : (
                  newsList.map((newsItem) => (
                    <motion.div 
                      key={newsItem._id || newsItem.id}
                      whileHover={{ backgroundColor: "var(--color-secondary)" }}
                      className="border border-border p-5 rounded-lg flex items-start justify-between gap-4 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{newsItem.title?.[language] || newsItem.title?.en}</h4>
                          {newsItem.isActive && <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Active</span>}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{newsItem.description?.[language] || newsItem.description?.en}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {newsItem.publishedAt ? new Date(newsItem.publishedAt).toLocaleDateString() : "Not published"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={async () => {
                            try {
                              await updateNews(newsItem._id || newsItem.id || "", { isActive: !newsItem.isActive });
                              await loadNewsAndDiscounts();
                              toast({ title: "Success", description: "News status updated", duration: 2000 });
                            } catch (error) {
                              toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
                            }
                          }}
                          className="p-2 hover:bg-secondary rounded transition-colors"
                          title={newsItem.isActive ? "Deactivate" : "Activate"}
                        >
                          {newsItem.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEditNews(newsItem)}
                          className="p-2 hover:bg-secondary rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteNews(newsItem._id || newsItem.id || "")}
                          className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
            )}

            {/* Discounts Tab */}
            {activeTab === "discounts" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border p-6 md:p-8 rounded-lg"
            >
              {/* Add Discount Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                <div>
                  <h3 className="heading-card mb-1">{t("admin.discountsManagement")}</h3>
                  <p className="text-sm text-muted-foreground">{t("admin.discountsDesc")}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowDiscountForm(true);
                    setEditingDiscount(null);
                    setDiscountFormData({
                      title: emptyLocalized(),
                      description: emptyLocalized(),
                      percentage: 0,
                      productIds: [],
                      isActive: true,
                      order: 0,
                    });
                  }}
                  className="btn-luxury flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  {t("admin.addDiscount")}
                </motion.button>
              </div>

              {/* Discount Form */}
              {showDiscountForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-primary/20 p-6 mb-8 rounded-lg bg-primary/5"
                >
                  <h4 className="font-medium mb-6">{editingDiscount ? "Edit Discount" : "Create New Discount"}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <MultiLangInput
                        value={discountFormData.title || emptyLocalized()}
                        onChange={(v) => setDiscountFormData({ ...discountFormData, title: v })}
                        label="Title"
                        required
                        placeholder="e.g., Spring Sale"
                      />
                    </div>
                    <div>
                      <label className="text-caption mb-2 block font-medium">Discount % *</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountFormData.percentage || 0}
                        onChange={(e) => setDiscountFormData({ ...discountFormData, percentage: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-border bg-transparent text-sm rounded focus:border-foreground focus:outline-none transition-colors"
                        placeholder="0-100"
                      />
                    </div>
                    <div>
                      <label className="text-caption mb-2 block font-medium">Display Order</label>
                      <input
                        type="number"
                        value={discountFormData.order || 0}
                        onChange={(e) => setDiscountFormData({ ...discountFormData, order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-border bg-transparent text-sm rounded focus:border-foreground focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <MultiLangInput
                      value={discountFormData.description || emptyLocalized()}
                      onChange={(v) => setDiscountFormData({ ...discountFormData, description: v })}
                      label="Description"
                      required
                      multiline
                      rows={3}
                      placeholder="Enter discount description"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-caption mb-2 block font-medium">Products *</label>
                    <div className="border border-border rounded p-3 max-h-48 overflow-y-auto space-y-2">
                      {inventory.map((p) => (
                        <label key={p.id} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-secondary/50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={(discountFormData.productIds || []).includes(p.id)}
                            onChange={(e) => {
                              const ids = discountFormData.productIds || [];
                              setDiscountFormData({
                                ...discountFormData,
                                productIds: e.target.checked
                                  ? [...ids, p.id]
                                  : ids.filter((id) => id !== p.id),
                              });
                            }}
                            className="w-4 h-4 border border-border rounded cursor-pointer"
                          />
                          <span>{p.nameKey.split(".").pop()} — {p.basePrice.toLocaleString()} UZS</span>
                        </label>
                      ))}
                    </div>
                    {(discountFormData.productIds || []).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">{(discountFormData.productIds || []).length} product(s) selected</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={discountFormData.isActive || false}
                        onChange={(e) => setDiscountFormData({ ...discountFormData, isActive: e.target.checked })}
                        className="w-4 h-4 border border-border rounded cursor-pointer"
                      />
                      <span className="text-sm font-medium">Active Now</span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveDiscount}
                      disabled={discountLoading}
                      className="btn-luxury flex-1 text-sm disabled:opacity-50"
                    >
                      {discountLoading ? "Saving..." : editingDiscount ? "Update Discount" : "Create Discount"}
                    </motion.button>
                    <button
                      onClick={() => {
                        setShowDiscountForm(false);
                        setEditingDiscount(null);
                        setDiscountFormData({
                          title: emptyLocalized(),
                          description: emptyLocalized(),
                          percentage: 0,
                          productIds: [],
                          isActive: true,
                          order: 0,
                        });
                      }}
                      className="btn-outline-luxury flex-1 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Discounts List */}
              <div className="space-y-4">
                {discounts.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground mb-2">No discounts yet</p>
                    <p className="text-xs text-muted-foreground">Click "Add Discount" button to create your first promotional offer</p>
                  </div>
                ) : (
                  discounts.map((discount) => (
                    <motion.div 
                      key={discount._id || discount.id}
                      whileHover={{ backgroundColor: "var(--color-secondary)" }}
                      className="border border-border p-5 rounded-lg flex items-start justify-between gap-4 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{discount.title?.[language] || discount.title?.en}</h4>
                          <span className="text-sm font-bold text-green-600 bg-green-500/20 px-2 py-1 rounded">
                            {discount.percentage}% OFF
                          </span>
                          {discount.isActive && <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-1 rounded">Active</span>}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{discount.description?.[language] || discount.description?.en}</p>
                        {discount.productIds && discount.productIds.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Products: {discount.productIds.map((pid) => {
                              const p = inventory.find((i) => i.id === pid);
                              return p ? p.nameKey.split(".").pop() : pid;
                            }).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={async () => {
                            try {
                              await updateDiscount(discount._id || discount.id || "", { isActive: !discount.isActive });
                              await loadNewsAndDiscounts();
                              toast({ title: "Success", description: "Discount status updated", duration: 2000 });
                            } catch (error) {
                              toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
                            }
                          }}
                          className="p-2 hover:bg-secondary rounded transition-colors"
                          title={discount.isActive ? "Deactivate" : "Activate"}
                        >
                          {discount.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEditDiscount(discount)}
                          className="p-2 hover:bg-secondary rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteDiscount(discount._id || discount.id || "")}
                          className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
            )}
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
              <>
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


              </>
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
