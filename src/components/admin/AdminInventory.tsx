import { Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import type { ProductData } from "@/lib/api";

interface AdminInventoryProps {
  products: ProductData[];
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  categories: string[];
  stockInputs: Record<string, string>;
  onStockInputChange: (key: string, val: string) => void;
  savingStockId: string | null;
  onSaveStock: (productId: string, sku: string, stock: string) => void;
}

export function AdminInventory({
  products,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  stockInputs,
  onStockInputChange,
  savingStockId,
  onSaveStock,
}: AdminInventoryProps) {
  const { t } = useLanguage();

  const filtered = products.filter((product) => {
    const matchesSearch = product.name.en
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">{t("admin.inventoryManagement")}</h2>
        <p className="admin-page-desc">{t("admin.inventoryDesc")}</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          <div className="inventory-controls">
            <div className="inventory-search">
              <Search size={18} />
              <input
                type="text"
                placeholder={t("admin.searchProducts")}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="inventory-search-input"
              />
            </div>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="inventory-filter-select"
            >
              <option value="all">{t("admin.allCategories")}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="inventory-list">
            {filtered.map((product) => {
              const primaryImage =
                product.images?.find((img) => img.isPrimary) ||
                product.images?.[0];

              return (
                <div key={product._id} className="inventory-item">
                  {primaryImage ? (
                    <img
                      src={
                        primaryImage.url.startsWith("http")
                          ? primaryImage.url
                          : `${import.meta.env.VITE_API_URL}${primaryImage.url}`
                      }
                      alt={product.name.en}
                      className="inventory-item-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="inventory-item-image"
                      style={{ background: "#f0f4f8" }}
                    />
                  )}

                  <div className="inventory-item-info">
                    <h4 className="inventory-item-name">{product.name.en}</h4>
                    <p className="inventory-item-meta">
                      {product.category} · {t("admin.sku")}:{" "}
                      {product.variants?.[0]?.sku}
                    </p>
                  </div>

                  <div className="inventory-item-variants">
                    {product.variants?.map((variant, idx) => (
                      <div
                        key={`${product._id}-${idx}`}
                        className="inventory-variant-row"
                      >
                        <div className="variant-info">
                          <span className="variant-label">{variant.sku}</span>
                          {variant.color && (
                            <span className="variant-detail">{variant.color}</span>
                          )}
                          {variant.size && (
                            <span className="variant-detail">{variant.size}</span>
                          )}
                        </div>

                        <div className="stock-input-group">
                          <input
                            type="number"
                            min="0"
                            value={
                              stockInputs[`${product._id}-${variant.sku}`] ??
                              variant.stock
                            }
                            onChange={(e) =>
                              onStockInputChange(
                                `${product._id}-${variant.sku}`,
                                e.target.value,
                              )
                            }
                            className="stock-number-input"
                            disabled={
                              savingStockId === `${product._id}-${variant.sku}`
                            }
                          />
                          <button
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() =>
                              onSaveStock(
                                product._id!,
                                variant.sku,
                                stockInputs[`${product._id}-${variant.sku}`] ??
                                  String(variant.stock),
                              )
                            }
                            disabled={
                              savingStockId === `${product._id}-${variant.sku}`
                            }
                          >
                            {savingStockId ===
                            `${product._id}-${variant.sku}` ? (
                              <Loader2 size={14} className="animate-spin" />
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

            {filtered.length === 0 && (
              <div className="inventory-empty">
                <p>{t("admin.noProducts")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
