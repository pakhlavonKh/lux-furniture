import { Package, Newspaper, Percent, Warehouse } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import type { ProductData, News, Discount } from "@/lib/api";

interface AdminDashboardProps {
  dbProducts: ProductData[];
  catalogCount: number;
  newsList: News[];
  discounts: Discount[];
}

export function AdminDashboard({
  dbProducts,
  catalogCount,
  newsList,
  discounts,
}: AdminDashboardProps) {
  const { t } = useLanguage();

  const totalVariants = dbProducts.reduce(
    (acc, p) => acc + (p.variants?.length || 0),
    0,
  );

  const totalStock = dbProducts.reduce(
    (acc, p) =>
      acc + (p.variants?.reduce((s, v) => s + (v.stock || 0), 0) || 0),
    0,
  );

  const stats = [
    {
      label: t("admin.dbProducts"),
      value: dbProducts.length,
      icon: <Package />,
      color: "blue",
    },
    {
      label: t("admin.catalogProducts"),
      value: catalogCount,
      icon: <Warehouse />,
      color: "green",
    },
    {
      label: t("admin.newsItems"),
      value: newsList.length,
      icon: <Newspaper />,
      color: "purple",
    },
    {
      label: t("admin.discountsCount"),
      value: discounts.length,
      icon: <Percent />,
      color: "orange",
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">{t("admin.dashboard")}</h2>
        <p className="admin-page-desc">Overview of your store</p>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className={`admin-stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="admin-stat-label">{stat.label}</p>
            <p className="admin-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent products */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Recent Products</h3>
            <p className="admin-card-desc">Latest items added to the store</p>
          </div>
        </div>
        <div className="admin-card-body no-pad">
          {dbProducts.slice(0, 5).map((product) => (
            <div key={product._id} className="admin-product-row">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt=""
                  className="admin-product-thumb"
                />
              ) : (
                <div className="admin-product-thumb-placeholder">
                  <Package size={20} />
                </div>
              )}
              <div className="admin-product-info">
                <p className="admin-product-name">
                  {product.name?.en || "Untitled"}
                </p>
                <p className="admin-product-meta">
                  {product.category} · {product.variants?.length || 0} variants
                </p>
              </div>
              <span className="admin-product-price">
                {product.basePrice?.toLocaleString()} UZS
              </span>
            </div>
          ))}
          {dbProducts.length === 0 && (
            <div className="admin-empty">
              <p>No products yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Total Variants</p>
          <p className="admin-stat-value">{totalVariants}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Total Stock</p>
          <p className="admin-stat-value">{totalStock}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Active News</p>
          <p className="admin-stat-value">
            {newsList.filter((n) => n.isActive).length}
          </p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Active Discounts</p>
          <p className="admin-stat-value">
            {discounts.filter((d) => d.isActive).length}
          </p>
        </div>
      </div>
    </div>
  );
}
