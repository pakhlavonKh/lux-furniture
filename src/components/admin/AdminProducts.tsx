import { Plus, Edit2, Trash2, Loader2, Package } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import type { ProductData } from "@/lib/api";

interface AdminProductsProps {
  products: ProductData[];
  loading: boolean;
  deletingId: string | null;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AdminProducts({
  products,
  loading,
  deletingId,
  onAdd,
  onEdit,
  onDelete,
}: AdminProductsProps) {
  const { t, language } = useLanguage();

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">{t("admin.productsManagement")}</h2>
        <p className="admin-page-desc">{t("admin.productsDesc")}</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              {t("admin.products")} ({products.length})
            </h3>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={onAdd}>
            <Plus size={16} />
            {t("admin.addProduct")}
          </button>
        </div>

        <div className="admin-card-body no-pad">
          {loading ? (
            <div className="admin-empty">
              <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto" }} />
              <p style={{ marginTop: 12 }}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="admin-empty">
              <Package size={48} />
              <p>No products yet. Add your first product.</p>
              <button className="admin-btn admin-btn-primary" onClick={onAdd}>
                <Plus size={16} />
                {t("admin.addProduct")}
              </button>
            </div>
          ) : (
            <div className="admin-product-table">
              {products.map((product) => (
                <div key={product._id} className="admin-product-row">
                  {product.images?.[0]?.url ? (
                    <img
                      src={
                        product.images[0].url.startsWith("http")
                          ? product.images[0].url
                          : `${import.meta.env.VITE_API_URL}${product.images[0].url}`
                      }
                      alt={product.name?.[language] || ""}
                      className="admin-product-thumb"
                    />
                  ) : (
                    <div className="admin-product-thumb-placeholder">
                      <Package size={20} />
                    </div>
                  )}

                  <div className="admin-product-info">
                    <p className="admin-product-name">
                      {product.name?.[language] || product.name?.en}
                    </p>
                    <p className="admin-product-meta">
                      {product.category} · {product.variants?.length || 0} variants
                      {product.isActive === false && (
                        <span className="admin-badge admin-badge-red" style={{ marginLeft: 8 }}>
                          Inactive
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="admin-badge admin-badge-yellow" style={{ marginLeft: 8 }}>
                          Featured
                        </span>
                      )}
                    </p>
                  </div>

                  <span className="admin-product-price">
                    {product.basePrice?.toLocaleString()} UZS
                  </span>

                  <div className="admin-product-actions">
                    <button
                      className="admin-btn admin-btn-sm"
                      onClick={() => onEdit(product._id!)}
                    >
                      <Edit2 size={14} />
                      {t("admin.edit")}
                    </button>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => onDelete(product._id!)}
                      disabled={deletingId === product._id}
                    >
                      {deletingId === product._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      {t("admin.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
