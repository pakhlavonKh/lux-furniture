import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/useLanguageHook";
import {
  News as NewsType,
  Discount as DiscountType,
  ProductData,
  LocalizedString,
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
import { AdminLayout, type AdminTab } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminInventory } from "@/components/admin/AdminInventory";
import { AdminNews } from "@/components/admin/AdminNews";
import { AdminDiscounts } from "@/components/admin/AdminDiscounts";
import "./admin/admin.css";

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
  const API_BASE = import.meta.env.DEV
    ? ""
    : import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [adminKey, setAdminKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Layout state
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Inventory
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryCategory, setInventoryCategory] = useState("all");
  const [inventoryCategories, setInventoryCategories] = useState<string[]>([]);
  const [savingStockId, setSavingStockId] = useState<string | null>(null);

  // Products
  const [dbProducts, setDbProducts] = useState<ProductData[]>([]);
  const [dbProductsLoading, setDbProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // News
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

  // Discounts
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountType | null>(null);
  const [discountFormData, setDiscountFormData] = useState<Partial<DiscountType>>({
    percentage: 0,
    isActive: true,
  });
  const [selectedProductsForDiscount, setSelectedProductsForDiscount] = useState<string[]>([]);

  // === Data loading ===

  const loadDbProducts = useCallback(async () => {
    setDbProductsLoading(true);
    try {
      const data = await getApiProducts();
      console.log("📦 PRODUCTS LOADED IN ADMIN:");
      console.log("  - Total:", data.length);
      if (data.length > 0) {
        console.log("  - First product:", data[0]);
        console.log("    - _id:", data[0]._id);
        console.log("    - Type of _id:", typeof data[0]._id);
      }
      setDbProducts(data);
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
    } catch {
      toast({
        title: "Error",
        description: "Failed to load news and discounts",
        variant: "destructive",
      });
    }
  }, [toast]);

  // === Auth ===

  const verifyAdminToken = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Token invalid or expired
        localStorage.removeItem("authToken");
        localStorage.removeItem("adminUser");
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    } catch {
      // Network error or endpoint doesn't respond
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    const savedUser = localStorage.getItem("adminUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Verify token with backend before setting user
        verifyAdminToken();
        // Don't return - let verification complete
      } catch {
        localStorage.removeItem("adminUser");
        setLoading(false);
      }
    } else {
      const regularUser = localStorage.getItem("user");
      if (regularUser) {
        try {
          const parsedUser = JSON.parse(regularUser);
          if (parsedUser.is_admin) {
            // Verify token with backend
            verifyAdminToken();
            // Don't return - let verification complete
          } else {
            navigate("/account", { replace: true });
            setLoading(false);
          }
        } catch {
          localStorage.removeItem("user");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, [navigate, verifyAdminToken]);

  useEffect(() => {
    if (user) {
      loadNewsAndDiscounts();
      loadDbProducts();
    }
  }, [user, loadNewsAndDiscounts, loadDbProducts]);

  // Listen for unauthorized errors from API
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      toast({ title: "Session expired", description: "Please log in again.", variant: "destructive" });
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
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
        toast({ title: "Welcome back!", description: "You have successfully logged in.", duration: 4000 });
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({ title: "Error", description: "Passwords do not match.", variant: "destructive", duration: 5000 });
          setIsSubmitting(false);
          return;
        }
        const response = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.email.split("@")[0],
            ...(adminKey && { admin_key: adminKey }),
          }),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Registration failed");
        }
        const data = await response.json();
        if (!data.user?.is_admin) {
          throw new Error("Admin registration key is invalid or not provided. Contact an existing admin for the correct key.");
        }
        const userData: User = {
          email: formData.email,
          id: data.user?.id || data.userId,
          is_admin: data.user?.is_admin || false,
        };
        localStorage.setItem("adminUser", JSON.stringify(userData));
        localStorage.setItem("authToken", data.token);
        setUser(userData);
        toast({ title: "Account created!", description: "You have successfully registered as an admin.", duration: 4000 });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({ title: "Error", description: errorMessage, variant: "destructive", duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    setFormData({ email: "", password: "", confirmPassword: "" });
    setAdminKey("");
    toast({ title: "Logged out", description: "You have been logged out successfully." });
    navigate("/");
  };

  // === Handlers ===

  const handleSaveDbItemStock = async (productId: string, sku: string, newStock: string) => {
    const parsed = Number.parseInt(newStock, 10);
    if (!Number.isFinite(parsed) || parsed < 0) {
      toast({ title: "Invalid stock", description: "Stock must be a non-negative integer.", variant: "destructive" });
      return;
    }
    setSavingStockId(`${productId}-${sku}`);
    try {
      await updateVariantStock(productId, sku, parsed);
      await loadDbProducts();
      toast({ title: "Success", description: "Stock updated successfully", duration: 3000 });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update stock",
        variant: "destructive",
      });
    } finally {
      setSavingStockId(null);
    }
  };

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

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newsFormData.title?.en || !newsFormData.title?.ru || !newsFormData.title?.uz ||
      !newsFormData.description?.en || !newsFormData.description?.ru || !newsFormData.description?.uz
    ) {
      toast({ title: "Error", description: "Title and description are required in all 3 languages", variant: "destructive" });
      return;
    }
    setNewsLoading(true);
    try {
      if (editingNews?._id) {
        await updateNews(editingNews._id, newsFormData as NewsType);
        toast({ title: "Success", description: "News updated successfully", duration: 3000 });
      } else {
        await createNews(newsFormData as NewsType);
        toast({ title: "Success", description: "News created successfully", duration: 3000 });
      }
      setShowNewsForm(false);
      setEditingNews(null);
      setNewsFormData({ title: emptyLocalized(), description: emptyLocalized(), content: emptyLocalized(), image: { url: "", public_id: "", alt: "" }, isActive: true, order: 0 });
      await loadNewsAndDiscounts();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save news", variant: "destructive" });
    } finally {
      setNewsLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteNews(id);
      await loadNewsAndDiscounts();
      toast({ title: "Success", description: "News deleted successfully", duration: 3000 });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to delete news", variant: "destructive" });
    }
  };

  const handleEditNews = (item: NewsType) => {
    setEditingNews(item);
    setNewsFormData(item);
    setShowNewsForm(true);
  };

  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((discountFormData.percentage || 0) <= 0 || (discountFormData.percentage || 0) > 100) {
      toast({ title: "Error", description: "Please enter a valid percentage (1-100)", variant: "destructive" });
      return;
    }
    if (selectedProductsForDiscount.length === 0) {
      toast({ title: "Error", description: "Please select at least one product", variant: "destructive" });
      return;
    }
    setNewsLoading(true);
    try {
      const discountData = {
        title: { en: "", ru: "", uz: "" },
        description: { en: "", ru: "", uz: "" },
        percentage: discountFormData.percentage || 0,
        productIds: selectedProductsForDiscount,
        isActive: discountFormData.isActive ?? true,
      };
      console.log("💾 SAVING DISCOUNT:");
      console.log("  - Discount data object:", discountData);
      console.log("  - JSON stringified:", JSON.stringify(discountData));
      if (editingDiscount?._id) {
        await updateDiscount(editingDiscount._id, discountData as DiscountType);
        toast({ title: "Success", description: "Discount updated successfully", duration: 3000 });
      } else {
        await createDiscount(discountData as DiscountType);
        toast({ title: "Success", description: "Discount created successfully", duration: 3000 });
      }
      setShowDiscountForm(false);
      setEditingDiscount(null);
      setSelectedProductsForDiscount([]);
      setDiscountFormData({ percentage: 0, productIds: [], isActive: true });
      await loadNewsAndDiscounts();
    } catch (error) {      console.error("❌ Error saving discount:", error);      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save discount", variant: "destructive" });
    } finally {
      setNewsLoading(false);
    }
  };

  const handleEditDiscount = (discount: DiscountType) => {
    setEditingDiscount(discount);
    setDiscountFormData({ percentage: discount.percentage, isActive: discount.isActive });
    setSelectedProductsForDiscount(discount.productIds || []);
    setShowDiscountForm(true);
  };

  const handleDeleteDiscount = async (id: string) => {
    try {
      await deleteDiscount(id);
      await loadNewsAndDiscounts();
      toast({ title: "Success", description: "Discount deleted successfully", duration: 3000 });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to delete discount", variant: "destructive" });
    }
  };

  // === Loading ===

  if (loading) {
    return (
      <div className="admin-auth-page">
        <Loader2 size={32} className="animate-spin" style={{ color: "#13789a" }} />
      </div>
    );
  }

  // === Authenticated admin ===

  if (user) {
    return (
      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userEmail={user.email}
        onLogout={handleLogout}
      >
        {activeTab === "dashboard" && (
          <AdminDashboard
            dbProducts={dbProducts}
            catalogCount={dbProducts.length}
            newsList={newsList}
            discounts={discounts}
          />
        )}

        {activeTab === "products" && (
          <AdminProducts
            products={dbProducts}
            loading={dbProductsLoading}
            deletingId={deletingProductId}
            onAdd={() => {
              setEditingProductId(null);
              setShowProductForm(true);
            }}
            onEdit={(id) => {
              setEditingProductId(id);
              setShowProductForm(true);
            }}
            onDelete={handleDeleteProduct}
          />
        )}

        {activeTab === "inventory" && (
          <AdminInventory
            products={dbProducts}
            search={inventorySearch}
            onSearchChange={setInventorySearch}
            category={inventoryCategory}
            onCategoryChange={setInventoryCategory}
            categories={inventoryCategories}
            stockInputs={stockInputs}
            onStockInputChange={(key, val) =>
              setStockInputs((prev) => ({ ...prev, [key]: val }))
            }
            savingStockId={savingStockId}
            onSaveStock={handleSaveDbItemStock}
          />
        )}

        {activeTab === "news" && (
          <AdminNews
            newsList={newsList}
            onAdd={() => setShowNewsForm(true)}
            onEdit={handleEditNews}
            onDelete={handleDeleteNews}
          />
        )}

        {activeTab === "discounts" && (
          <>
            <AdminDiscounts
              discounts={discounts}
              onAdd={() => setShowDiscountForm(true)}
              onEdit={handleEditDiscount}
              onDelete={handleDeleteDiscount}
            />
            {/* Debug Info */}
            <div style={{
              marginTop: 20,
              padding: 12,
              backgroundColor: "#f0f0f0",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "monospace",
              color: "#666"
            }}>
              <details>
                <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: 8 }}>🔍 Debug Info & Product IDs</summary>
                <div>
                  <p><strong>Products loaded:</strong> {dbProducts.length}</p>
                  <p><strong>Discounts loaded:</strong> {discounts.length}</p>
                  
                  {dbProducts.length > 0 && (
                    <div style={{ marginTop: 12, marginBottom: 12, padding: 10, backgroundColor: "white", borderRadius: 3 }}>
                      <p style={{ fontWeight: 600, marginBottom: 8, color: "#e53e3e" }}>⚠️ ACTUAL PRODUCT IDs (use these for discounts):</p>
                      {dbProducts.map((p, i) => (
                        <div key={p._id} style={{ marginBottom: 6 }}>
                          <p>
                            <strong>{i + 1}.</strong> {typeof p.name === "string" ? p.name : p.name?.en}
                          </p>
                          <p style={{ marginLeft: 12, fontSize: 11, color: "#999", wordBreak: "break-all" }}>
                            _id: {p._id}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {discounts.length > 0 && (
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 8 }}>Discount details:</p>
                      {discounts.map((d, i) => (
                        <div key={d._id} style={{ marginLeft: 12, marginBottom: 8, padding: 8, backgroundColor: "white", borderRadius: 3 }}>
                          <p><strong>{i + 1}. {d.title?.en}</strong></p>
                          <p>  Percentage: {d.percentage}%</p>
                          <p>  Active: {d.isActive ? "Yes" : "No"}</p>
                          <p>  Product IDs in discount: {d.productIds?.length || 0} items</p>
                          {d.productIds && d.productIds.length > 0 && (
                            <div style={{ fontSize: 11, color: "#999", marginLeft: 12 }}>
                              {d.productIds.map((pid, j) => (
                                <p key={j} style={{ wordBreak: "break-all", margin: "2px 0" }}>
                                  [{j + 1}] {pid}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            </div>
          </>
        )}

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingProductId
                    ? t("admin.edit") + " " + t("admin.products")
                    : t("admin.addProduct")}
                </h2>
                <button
                  onClick={() => { setShowProductForm(false); setEditingProductId(null); }}
                  className="modal-close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <ProductForm
                  productId={editingProductId || undefined}
                  onSaved={() => { setShowProductForm(false); setEditingProductId(null); loadDbProducts(); }}
                  onClose={() => { setShowProductForm(false); setEditingProductId(null); }}
                />
              </div>
            </div>
          </div>
        )}

        {/* News Form Modal */}
        {showNewsForm && (
          <div className="modal-overlay" onClick={() => setShowNewsForm(false)}>
            <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingNews ? "Edit News" : "Add News"}
                </h2>
                <button
                  onClick={() => {
                    setShowNewsForm(false);
                    setEditingNews(null);
                    setNewsFormData({ title: emptyLocalized(), description: emptyLocalized(), content: emptyLocalized(), image: { url: "", public_id: "", alt: "" }, isActive: true, order: 0 });
                  }}
                  className="modal-close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveNews}>
                  <MultiLangInput
                    label={t("admin.title")}
                    value={newsFormData.title || emptyLocalized()}
                    onChange={(value) => setNewsFormData({ ...newsFormData, title: value })}
                    required
                  />
                  <MultiLangInput
                    label={t("admin.description")}
                    value={newsFormData.description || emptyLocalized()}
                    onChange={(value) => setNewsFormData({ ...newsFormData, description: value })}
                    multiline
                    rows={3}
                  />
                  <MultiLangInput
                    label={t("admin.content")}
                    value={newsFormData.content || emptyLocalized()}
                    onChange={(value) => setNewsFormData({ ...newsFormData, content: value })}
                    multiline
                    rows={5}
                  />
                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={newsFormData.isActive ?? true}
                        onChange={(e) => setNewsFormData({ ...newsFormData, isActive: e.target.checked })}
                        style={{ width: 16, height: 16, accentColor: "#13789a" }}
                      />
                      <span style={{ fontSize: 14 }}>{t("admin.active")}</span>
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button type="submit" disabled={newsLoading} className="admin-btn admin-btn-primary">
                      {newsLoading ? t("admin.loading") : t("admin.save")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewsForm(false);
                        setEditingNews(null);
                        setNewsFormData({ title: emptyLocalized(), description: emptyLocalized(), content: emptyLocalized(), isActive: true, order: 0 });
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

        {/* Discount Form Modal */}
        {showDiscountForm && (
          <div className="modal-overlay" onClick={() => setShowDiscountForm(false)}>
            <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
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
                    setSelectedProductsForDiscount([]);
                    setDiscountFormData({ percentage: 0, isActive: true });
                  }}
                  className="modal-close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveDiscount}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#5a6a7a", marginBottom: 8 }}>
                      {t("admin.discountPercentage")}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={discountFormData.percentage ?? 0}
                      onChange={(e) => setDiscountFormData({ ...discountFormData, percentage: Number(e.target.value) })}
                      className="admin-input"
                      placeholder="e.g., 15"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#5a6a7a", marginBottom: 8 }}>
                      Select Products
                    </label>
                    <div style={{ 
                      border: "1px solid #ddd", 
                      borderRadius: 4, 
                      maxHeight: "250px", 
                      overflowY: "auto",
                      padding: "8px"
                    }}>
                      {dbProducts.length === 0 ? (
                        <p style={{ fontSize: 13, color: "#999", margin: 0 }}>No products available</p>
                      ) : (
                        dbProducts.map((product) => (
                          <label
                            key={product._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "6px 4px",
                              cursor: "pointer",
                              fontSize: 13,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedProductsForDiscount.includes(product._id || "")}
                              onChange={(e) => {
                                const id = product._id || "";
                                if (e.target.checked) {
                                  setSelectedProductsForDiscount([...selectedProductsForDiscount, id]);
                                } else {
                                  setSelectedProductsForDiscount(selectedProductsForDiscount.filter(pid => pid !== id));
                                }
                              }}
                              style={{ width: 14, height: 14, accentColor: "#13789a" }}
                            />
                            <span>
                              {typeof product.name === "string"
                                ? product.name
                                : product.name?.[language as keyof LocalizedString] || "Unnamed Product"}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    {selectedProductsForDiscount.length > 0 && (
                      <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                        {selectedProductsForDiscount.length} product(s) selected
                      </p>
                    )}
                  </div>
                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={discountFormData.isActive ?? true}
                        onChange={(e) => setDiscountFormData({ ...discountFormData, isActive: e.target.checked })}
                        style={{ width: 16, height: 16, accentColor: "#13789a" }}
                      />
                      <span style={{ fontSize: 14 }}>{t("admin.active")}</span>
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button type="submit" disabled={newsLoading} className="admin-btn admin-btn-primary">
                      {newsLoading ? t("admin.loading") : t("admin.save")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDiscountForm(false);
                        setEditingDiscount(null);
                        setSelectedProductsForDiscount([]);
                        setDiscountFormData({ percentage: 0, isActive: true });
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
      </AdminLayout>
    );
  }

  // === Login/Signup form ===

  return (
    <div className="admin-auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="admin-auth-wrapper"
      >
        <div className="admin-auth-logo">
          <h1>Manaku</h1>
          <p>{t("admin.loginForm")}</p>
        </div>

        <div className="admin-auth-card">
          <h2 className="admin-auth-title">
            {isLogin ? t("admin.login") : t("admin.signup")}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-auth-field">
              <label htmlFor="email">{t("admin.email")}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="admin-auth-field">
              <label htmlFor="password">{t("admin.password")}</label>
              <div className="admin-auth-password">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-auth-eye"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="admin-auth-field">
                  <label htmlFor="confirmPassword">{t("admin.confirmPassword")}</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-auth-field">
                  <label htmlFor="adminKey">Admin Registration Key</label>
                  <input
                    type="password"
                    id="adminKey"
                    name="adminKey"
                    placeholder="Enter admin key to create admin account"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                  />
                  <small style={{ color: "#999", marginTop: 4, display: "block" }}>
                    Required to create an admin account. Ask existing admin for the key.
                  </small>
                </div>
              </>
            )}

            <button type="submit" disabled={isSubmitting} className="admin-auth-submit">
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  {isLogin ? t("admin.login") : t("admin.signup")}
                </>
              )}
            </button>
          </form>

          <div className="admin-auth-switch">
            <button onClick={() => {
              setIsLogin(!isLogin);
              setAdminKey("");
            }}>
              {isLogin
                ? t("admin.noAccount") + " " + t("admin.signup")
                : t("admin.alreadyHaveAccount") + " " + t("admin.login")}
            </button>
          </div>
        </div>

        <div className="admin-auth-back">
          <a href="/">← Back to website</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Admin;
