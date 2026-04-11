import { Plus, Edit2, Trash2, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import type { News } from "@/lib/api";

interface AdminNewsProps {
  newsList: News[];
  onAdd: () => void;
  onEdit: (item: News) => void;
  onDelete: (id: string) => void;
}

export function AdminNews({ newsList, onAdd, onEdit, onDelete }: AdminNewsProps) {
  const { t, language } = useLanguage();

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">{t("admin.newsManagement")}</h2>
        <p className="admin-page-desc">Manage news and blog posts</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            {t("admin.news")} ({newsList.length})
          </h3>
          <button className="admin-btn admin-btn-primary" onClick={onAdd}>
            <Plus size={16} />
            {t("admin.addNews")}
          </button>
        </div>

        <div className="admin-card-body no-pad">
          {newsList.length === 0 ? (
            <div className="admin-empty">
              <Newspaper size={48} />
              <p>No news items yet</p>
              <button className="admin-btn admin-btn-primary" onClick={onAdd}>
                <Plus size={16} />
                {t("admin.addNews")}
              </button>
            </div>
          ) : (
            newsList.map((item) => (
              <div key={item._id} className="admin-list-item">
                <div className="admin-list-item-info">
                  <p className="admin-list-item-title">
                    {item.title?.[language] || item.title?.en}
                  </p>
                  <p className="admin-list-item-desc">
                    {item.description?.[language] || item.description?.en}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {item.isActive ? (
                    <span className="admin-badge admin-badge-green">Active</span>
                  ) : (
                    <span className="admin-badge admin-badge-red">Inactive</span>
                  )}
                </div>

                <div className="admin-list-item-actions">
                  <button
                    className="admin-btn admin-btn-sm"
                    onClick={() => onEdit(item)}
                  >
                    <Edit2 size={14} />
                    {t("admin.edit")}
                  </button>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={() => onDelete(item._id || "")}
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
