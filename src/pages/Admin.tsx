import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  LogIn,
  Plus,
  X,
  Edit2,
  Trash2,
  Loader2,
  Package,
  Search,
  Package2,
  Grid3x3,
  Newspaper,
  Percent,
  LogOut,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/useLanguageHook";
import { CatalogProduct, getProducts, getCategories } from "@/data/catalogData";
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
  updateVariantStock,
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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "products" | "inventory" | "news" | "discounts"
  >("products");
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
  const [inventoryCategories, setInventoryCategories] = useState<string[]>([]);
  const [savingStockId, setSavingStockId] = useState<string | null>(null);

  // Products management (database)
  const [dbProducts, setDbProducts] = useState<ProductData[]>([]);
  const [dbProductsLoading, setDbProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
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
  const [editingDiscount, setEditingDiscount] = useState<DiscountType | null>(
    null,
  );
  const [discountFormData, setDiscountFormData] = useState<
    Partial<DiscountType>
  >({
    title: emptyLocalized(),
    description: emptyLocalized(),
    percentage: 0,
    productIds: [],
    code: "",
    isActive: true,
    order: 0,
  });
  const [discountLoading, setDiscountLoading] = useState(false);

  const buildStockInputs = (
    products: CatalogProduct[],
  ): Record<string, string> => {
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
      // Extract unique categories from products
      const categories = Array.from(
        new Set(data.map((p) => p.category).filter(Boolean)),
      ).sort();
      setInventoryCategories(categories);
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

  const handleSaveDbItemStock = async (
    productId: string,
    sku: string,
    newStock: string,
  ) => {
    const parsed = parseStock(newStock);
    if (parsed === null) {
      toast({
        title: "Invalid stock",
        description: "Stock must be a non-negative integer.",
        variant: "destructive",
      });
      return;
    }

    setSavingStockId(`${productId}-${sku}`);
    try {
      await updateVariantStock(productId, sku, parsed);
      // Reload products to reflect changes
      await loadDbProducts();
      toast({
        title: "Success",
        description: "Stock updated successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update stock",
        variant: "destructive",
      });
    } finally {
      setSavingStockId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          },
        );

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
          is_admin: data.user?.is_admin || false,
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

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              name: formData.email.split("@")[0],
            }),
          },
        );

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
          is_admin: data.user?.is_admin || false,
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
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
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
      if (
        !newsFormData.title?.en ||
        !newsFormData.title?.ru ||
        !newsFormData.title?.uz ||
        !newsFormData.description?.en ||
        !newsFormData.description?.ru ||
        !newsFormData.description?.uz
      ) {
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
        description: editingNews
          ? "News updated successfully"
          : "News created successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save news",
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
        description:
          error instanceof Error ? error.message : "Failed to delete news",
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
      if (
        !discountFormData.title?.en ||
        !discountFormData.title?.ru ||
        !discountFormData.title?.uz ||
        !discountFormData.description?.en ||
        !discountFormData.description?.ru ||
        !discountFormData.description?.uz
      ) {
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
        await updateDiscount(
          editingDiscount._id || editingDiscount.id || "",
          discountFormData,
        );
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
        description: editingDiscount
          ? "Discount updated successfully"
          : "Discount created successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save discount",
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
        description:
          error instanceof Error ? error.message : "Failed to delete discount",
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
        description:
          error instanceof Error ? error.message : "Failed to delete product",
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
    const categoryCount = new Set(inventory.map((item) => item.categoryId))
      .size;

    return (
      <div className="admin-page">
        <main className="admin-container">
          {/* HEADER */}
          <div className="admin-header">
            <span className="admin-user">{user.email}</span>
            <button
              onClick={handleLogout}
              className="admin-btn admin-btn-danger"
            >
              {t("admin.logout")}
            </button>
          </div>

          {/* STATS */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <p className="admin-stat-label">{t("admin.dbProducts")}</p>
              <p className="admin-stat-value">{dbProducts.length}</p>
            </div>

            <div className="admin-stat-card">
              <p className="admin-stat-label">{t("admin.catalogProducts")}</p>
              <p className="admin-stat-value">{inventory.length}</p>
            </div>

            <div className="admin-stat-card">
              <p className="admin-stat-label">{t("admin.newsItems")}</p>
              <p className="admin-stat-value">{newsList.length}</p>
            </div>

            <div className="admin-stat-card">
              <p className="admin-stat-label">{t("admin.discountsCount")}</p>
              <p className="admin-stat-value">{discounts.length}</p>
            </div>
          </div>

          {/* TABS */}
          <div className="admin-tabs">
            {(
              [
                { id: "products" as const, label: "admin.products" },
                { id: "inventory" as const, label: "admin.inventory" },
                { id: "news" as const, label: "admin.news" },
                { id: "discounts" as const, label: "admin.discounts" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              >
                {t(tab.label)}
              </button>
            ))}
          </div>

          {/* ================= PRODUCTS ================= */}
          {activeTab === "products" && (
            <div className="admin-section">
              <div className="admin-section-header">
                <div>
                  <h3 className="admin-section-title">
                    {t("admin.productsManagement")}
                  </h3>
                  <p className="admin-section-desc">
                    {t("admin.productsDesc")}
                  </p>
                </div>

                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    setEditingProductId(null);
                    setShowProductForm(true);
                  }}
                >
                  {t("admin.addProduct")}
                </button>
              </div>

              {dbProducts.map((product) => (
                <div key={product._id} className="admin-product">
                  <div className="admin-product-left">
                    {product.images?.[0]?.url && (
                      <img
                        src={product.images[0].url}
                        className="admin-product-img"
                      />
                    )}

                    <div>
                      <h4 className="admin-product-title">
                        {product.name?.[language] || product.name?.en}
                      </h4>

                      <p className="admin-product-meta">
                        {product.basePrice} UZS · {product.variants?.length}{" "}
                        variants
                      </p>
                    </div>
                  </div>

                  <div className="admin-actions">
                    <button
                      className="admin-btn"
                      onClick={() => {
                        setEditingProductId(product._id!);
                        setShowProductForm(true);
                      }}
                    >
                      {t("admin.edit")}
                    </button>

                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleDeleteProduct(product._id!)}
                    >
                      {t("admin.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= INVENTORY ================= */}
          {activeTab === "inventory" && (
            <div className="admin-section">
              <div className="admin-section-header">
                <div>
                  <h3 className="admin-section-title">
                    {t("admin.inventoryManagement")}
                  </h3>
                  <p className="admin-section-desc">
                    {t("admin.inventoryDesc")}
                  </p>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="inventory-controls">
                <div className="inventory-search">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder={t("admin.searchProducts")}
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="inventory-search-input"
                  />
                </div>

                <select
                  value={inventoryCategory}
                  onChange={(e) => setInventoryCategory(e.target.value)}
                  className="inventory-filter-select"
                >
                  <option value="all">{t("admin.allCategories")}</option>
                  {inventoryCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inventory Items */}
              <div className="inventory-list">
                {dbProducts
                  .filter((product) => {
                    const matchesSearch = product.name.en
                      .toLowerCase()
                      .includes(inventorySearch.toLowerCase());
                    const matchesCategory =
                      inventoryCategory === "all" ||
                      product.category === inventoryCategory;
                    return matchesSearch && matchesCategory;
                  })
                  .map((product) => {
                    const primaryImage =
                      product.images?.find((img) => img.isPrimary) ||
                      product.images?.[0];

                    return (
                      <div key={product._id} className="inventory-item">
                        {/* Product Image */}
                        {primaryImage && (
                          <img
                            src={
                              primaryImage.url.startsWith("http")
                                ? primaryImage.url
                                : `${import.meta.env.VITE_API_URL}${primaryImage.url}`
                            }
                            alt={product.name.en}
                            className="inventory-item-image"
                            onError={(e) => {
                              console.error(
                                "Image failed to load:",
                                primaryImage.url,
                              );
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}

                        {/* Product Info */}
                        <div className="inventory-item-info">
                          <h4 className="inventory-item-name">
                            {product.name.en}
                          </h4>
                          <p className="inventory-item-meta">
                            {product.category} • {t("admin.sku")}:{" "}
                            {product.variants?.[0]?.sku}
                          </p>
                        </div>

                        {/* Variants Stock */}
                        <div className="inventory-item-variants">
                          {product.variants?.map((variant, idx) => (
                            <div
                              key={`${product._id}-${idx}`}
                              className="inventory-variant-row"
                            >
                              <div className="variant-info">
                                <span className="variant-label">
                                  {variant.sku}
                                </span>
                                {variant.color && (
                                  <span className="variant-detail">
                                    {variant.color}
                                  </span>
                                )}
                                {variant.size && (
                                  <span className="variant-detail">
                                    {variant.size}
                                  </span>
                                )}
                              </div>

                              <div className="stock-input-group">
                                <input
                                  type="number"
                                  min="0"
                                  value={
                                    stockInputs[
                                      `${product._id}-${variant.sku}`
                                    ] ?? variant.stock
                                  }
                                  onChange={(e) =>
                                    setStockInputs((prev) => ({
                                      ...prev,
                                      [`${product._id}-${variant.sku}`]:
                                        e.target.value,
                                    }))
                                  }
                                  className="stock-number-input"
                                  disabled={
                                    savingStockId ===
                                    `${product._id}-${variant.sku}`
                                  }
                                />

                                <button
                                  className="admin-btn admin-btn-primary"
                                  onClick={() =>
                                    handleSaveDbItemStock(
                                      product._id!,
                                      variant.sku,
                                      stockInputs[
                                        `${product._id}-${variant.sku}`
                                      ] ?? String(variant.stock),
                                    )
                                  }
                                  disabled={
                                    savingStockId ===
                                    `${product._id}-${variant.sku}`
                                  }
                                >
                                  {savingStockId ===
                                  `${product._id}-${variant.sku}` ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                {dbProducts.filter((product) => {
                  const matchesSearch = product.name.en
                    .toLowerCase()
                    .includes(inventorySearch.toLowerCase());
                  const matchesCategory =
                    inventoryCategory === "all" ||
                    product.category === inventoryCategory;
                  return matchesSearch && matchesCategory;
                }).length === 0 && (
                  <div className="inventory-empty">
                    <p>{t("admin.noProducts")}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= NEWS ================= */}
          {activeTab === "news" && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h3 className="admin-section-title">
                  {t("admin.newsManagement")}
                </h3>

                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setShowNewsForm(true)}
                >
                  {t("admin.addNews")}
                </button>
              </div>

              {newsList.map((item) => (
                <div key={item._id} className="admin-product">
                  <div>
                    <h4>{item.title?.[language]}</h4>
                    <p className="admin-product-meta">
                      {item.description?.[language]}
                    </p>
                  </div>

                  <div className="admin-actions">
                    <button
                      className="admin-btn"
                      onClick={() => handleEditNews(item)}
                    >
                      {t("admin.edit")}
                    </button>

                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleDeleteNews(item._id || "")}
                    >
                      {t("admin.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= DISCOUNTS ================= */}
          {activeTab === "discounts" && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h3 className="admin-section-title">
                  {t("admin.discountsManagement")}
                </h3>

                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setShowDiscountForm(true)}
                >
                  {t("admin.addDiscount")}
                </button>
              </div>

              {discounts.map((d) => (
                <div key={d._id} className="admin-product">
                  <div>
                    <h4>{d.title?.[language]}</h4>

                    <span className="admin-badge admin-badge-green">
                      {d.percentage}% OFF
                    </span>
                  </div>

                  <div className="admin-actions">
                    <button
                      className="admin-btn"
                      onClick={() => handleEditDiscount(d)}
                    >
                      {t("admin.edit")}
                    </button>

                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleDeleteDiscount(d._id || "")}
                    >
                      {t("admin.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* PRODUCT FORM MODAL */}
        {showProductForm && (
          <div
            className="modal-overlay"
            onClick={() => setShowProductForm(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingProductId
                    ? t("admin.edit") + " " + t("admin.products")
                    : t("admin.addProduct")}
                </h2>
                <button
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProductId(null);
                  }}
                  className="modal-close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <ProductForm
                  productId={editingProductId || undefined}
                  onSaved={() => {
                    setShowProductForm(false);
                    setEditingProductId(null);
                    loadDbProducts();
                  }}
                  onClose={() => {
                    setShowProductForm(false);
                    setEditingProductId(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* NEWS FORM MODAL */}
        {showNewsForm && (
          <div className="modal-overlay" onClick={() => setShowNewsForm(false)}>
            <div
              className="modal-content modal-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingNews ? "Edit News" : "Add News"}
                </h2>
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
                  className="modal-close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setNewsLoading(true);
                    try {
                      if (editingNews?._id) {
                        await updateNews(
                          editingNews._id,
                          newsFormData as NewsType,
                        );
                        toast({
                          title: "Success",
                          description: "News updated successfully",
                          duration: 3000,
                        });
                      } else {
                        await createNews(newsFormData as NewsType);
                        toast({
                          title: "Success",
                          description: "News created successfully",
                          duration: 3000,
                        });
                      }
                      setShowNewsForm(false);
                      setEditingNews(null);
                      setNewsFormData({
                        title: emptyLocalized(),
                        description: emptyLocalized(),
                        content: emptyLocalized(),
                        isActive: true,
                        order: 0,
                      });
                      await loadNewsAndDiscounts();
                    } catch (error) {
                      toast({
                        title: "Error",
                        description:
                          error instanceof Error
                            ? error.message
                            : "Failed to save news",
                        variant: "destructive",
                      });
                    } finally {
                      setNewsLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <MultiLangInput
                    label={t("admin.title")}
                    value={newsFormData.title || emptyLocalized()}
                    onChange={(value) =>
                      setNewsFormData({ ...newsFormData, title: value })
                    }
                    required
                  />

                  <MultiLangInput
                    label={t("admin.description")}
                    value={newsFormData.description || emptyLocalized()}
                    onChange={(value) =>
                      setNewsFormData({ ...newsFormData, description: value })
                    }
                    multiline
                    rows={3}
                  />

                  <MultiLangInput
                    label={t("admin.content")}
                    value={newsFormData.content || emptyLocalized()}
                    onChange={(value) =>
                      setNewsFormData({ ...newsFormData, content: value })
                    }
                    multiline
                    rows={5}
                  />

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newsFormData.isActive ?? true}
                        onChange={(e) =>
                          setNewsFormData({
                            ...newsFormData,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      <span className="text-sm">{t("admin.active")}</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={newsLoading}
                      className="admin-btn admin-btn-primary"
                    >
                      {newsLoading ? t("admin.loading") : t("admin.save")}
                    </button>
                    <button
                      type="button"
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
                      className="admin-btn"
                    >
                      {t("admin.cancel")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* DISCOUNT FORM MODAL */}
        {showDiscountForm && (
          <div
            className="modal-overlay"
            onClick={() => setShowDiscountForm(false)}
          >
            <div
              className="modal-content modal-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingDiscount
                    ? t("admin.edit") + " " + t("admin.discounts")
                    : t("admin.addDiscount")}
                </h2>
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
                  className="modal-close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setNewsLoading(true);
                    try {
                      if (editingDiscount?._id) {
                        await updateDiscount(
                          editingDiscount._id,
                          discountFormData as DiscountType,
                        );
                        toast({
                          title: "Success",
                          description: "Discount updated successfully",
                          duration: 3000,
                        });
                      } else {
                        await createDiscount(discountFormData as DiscountType);
                        toast({
                          title: "Success",
                          description: "Discount created successfully",
                          duration: 3000,
                        });
                      }
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
                      await loadNewsAndDiscounts();
                    } catch (error) {
                      toast({
                        title: "Error",
                        description:
                          error instanceof Error
                            ? error.message
                            : "Failed to save discount",
                        variant: "destructive",
                      });
                    } finally {
                      setNewsLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <MultiLangInput
                    label={t("admin.title")}
                    value={discountFormData.title || emptyLocalized()}
                    onChange={(value) =>
                      setDiscountFormData({ ...discountFormData, title: value })
                    }
                    required
                  />

                  <MultiLangInput
                    label={t("admin.description")}
                    value={discountFormData.description || emptyLocalized()}
                    onChange={(value) =>
                      setDiscountFormData({
                        ...discountFormData,
                        description: value,
                      })
                    }
                    multiline
                    rows={3}
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("admin.discountPercentage")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountFormData.percentage ?? 0}
                      onChange={(e) =>
                        setDiscountFormData({
                          ...discountFormData,
                          percentage: Number(e.target.value),
                        })
                      }
                      className="admin-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={discountFormData.isActive ?? true}
                        onChange={(e) =>
                          setDiscountFormData({
                            ...discountFormData,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      <span className="text-sm">{t("admin.active")}</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={newsLoading}
                      className="admin-btn admin-btn-primary"
                    >
                      {newsLoading ? t("admin.loading") : t("admin.save")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
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
                      }}
                      className="admin-btn"
                    >
                      {t("admin.cancel")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
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
          <p className="text-muted-foreground text-sm">
            {t("admin.loginForm")}
          </p>
        </div>

        <div className="bg-card border border-border p-8">
          <h2 className="heading-card text-center mb-8">
            {isLogin ? t("admin.login") : t("admin.signup")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-caption mb-2 block">
                {t("admin.email")}
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
                {t("admin.password")}
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
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-caption mb-2 block"
                  >
                    {t("admin.confirmPassword")}
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
                t("admin.loading")
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLogin ? t("admin.login") : t("admin.signup")}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin
                ? t("admin.noAccount") + " " + t("admin.signup")
                : t("admin.alreadyHaveAccount") + " " + t("admin.login")}
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
