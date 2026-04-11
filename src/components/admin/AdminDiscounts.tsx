import { Plus, Edit2, Trash2, Percent } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import type { Discount } from "@/lib/api";

interface AdminDiscountsProps {
  discounts: Discount[];
  onAdd: () => void;
  onEdit: (discount: Discount) => void;
  onDelete: (id: string) => void;
}

export function AdminDiscounts({
  discounts,
  onAdd,
  onEdit,
  onDelete,
}: AdminDiscountsProps) {
  const { t, language } = useLanguage();

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">{t("admin.discountsManagement")}</h2>
        <p className="admin-page-desc">Manage discount campaigns and codes</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            {t("admin.discounts")} ({discounts.length})
          </h3>
          <button className="admin-btn admin-btn-primary" onClick={onAdd}>
            <Plus size={16} />
            {t("admin.addDiscount")}
          </button>
        </div>

        <div className="admin-card-body no-pad">
          {discounts.length === 0 ? (
            <div className="admin-empty">
              <Percent size={48} />
              <p>No discounts yet</p>
              <button className="admin-btn admin-btn-primary" onClick={onAdd}>
                <Plus size={16} />
                {t("admin.addDiscount")}
              </button>
            </div>
          ) : (
            discounts.map((d) => (
              <div key={d._id} className="admin-list-item">
                <div className="admin-list-item-info">
                  <p className="admin-list-item-title">
                    {d.title?.[language] || d.title?.en}
                  </p>
                  <p className="admin-list-item-desc">
                    {d.description?.[language] || d.description?.en}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="admin-badge admin-badge-blue">
                    {d.percentage}% OFF
                  </span>
                  {d.isActive ? (
                    <span className="admin-badge admin-badge-green">Active</span>
                  ) : (
                    <span className="admin-badge admin-badge-red">Inactive</span>
                  )}
                </div>

                <div className="admin-list-item-actions">
                  <button
                    className="admin-btn admin-btn-sm"
                    onClick={() => onEdit(d)}
                  >
                    <Edit2 size={14} />
                    {t("admin.edit")}
                  </button>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={() => onDelete(d._id || "")}
                  >
                    <Trash2 size={14} />
                    {t("admin.delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
