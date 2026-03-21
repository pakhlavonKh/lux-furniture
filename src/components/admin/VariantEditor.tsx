import { memo, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import type { ProductVariantData, ProductImage } from "@/lib/api";

interface VariantRow extends ProductVariantData {
  _tempId?: string;
  _image?: ProductImage | null;
}

interface VariantEditorProps {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
  basePrice: number;
}

function VariantRowEditor({
  variant,
  index,
  onUpdate,
  onRemove,
}: {
  variant: VariantRow;
  index: number;
  onUpdate: (index: number, patch: Partial<VariantRow>) => void;
  onRemove: (index: number) => void;
}) {
  const handleImageChange = useCallback(
    (images: ProductImage[]) => {
      onUpdate(index, { _image: images[0] || null });
    },
    [index, onUpdate]
  );

  return (
    <div className="variant-row">
      <div className="variant-row-header">
        <span className="variant-title">Variant #{index + 1}</span>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="variant-remove"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="variant-grid">
        <div className="variant-field">
          <label>SKU *</label>
          <input
            value={variant.sku}
            onChange={(e) =>
              onUpdate(index, { sku: e.target.value })
            }
            className="variant-input"
          />
        </div>

        <div className="variant-field">
          <label>Color</label>
          <input
            value={variant.color || ""}
            onChange={(e) =>
              onUpdate(index, { color: e.target.value })
            }
            className="variant-input"
          />
        </div>

        <div className="variant-field">
          <label>Size</label>
          <input
            value={variant.size || ""}
            onChange={(e) =>
              onUpdate(index, { size: e.target.value })
            }
            className="variant-input"
          />
        </div>

        <div className="variant-field">
          <label>Material</label>
          <input
            value={variant.material || ""}
            onChange={(e) =>
              onUpdate(index, { material: e.target.value })
            }
            className="variant-input"
          />
        </div>

        <div className="variant-field">
          <label>Price *</label>
          <input
            type="number"
            value={variant.price}
            onChange={(e) =>
              onUpdate(index, {
                price: Number(e.target.value) || 0,
              })
            }
            className="variant-input"
          />
        </div>

        <div className="variant-field">
          <label>Stock</label>
          <input
            type="number"
            value={variant.stock}
            onChange={(e) =>
              onUpdate(index, {
                stock: Number(e.target.value) || 0,
              })
            }
            className="variant-input"
          />
        </div>
      </div>

      <div className="variant-bottom">
        <ImageUploader
          images={variant._image ? [variant._image] : []}
          onChange={handleImageChange}
          multiple={false}
          label="Variant Image"
        />

        <label className="variant-checkbox">
          <input
            type="checkbox"
            checked={variant.isActive !== false}
            onChange={(e) =>
              onUpdate(index, {
                isActive: e.target.checked,
              })
            }
          />
          Active
        </label>
      </div>
    </div>
  );
}

const MemoizedVariantRow = memo(VariantRowEditor);

function VariantEditorInner({
  variants,
  onChange,
  basePrice,
}: VariantEditorProps) {
  const handleUpdate = useCallback(
    (index: number, patch: Partial<VariantRow>) => {
      const next = variants.map((v, i) =>
        i === index ? { ...v, ...patch } : v
      );
      onChange(next);
    },
    [variants, onChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      onChange(variants.filter((_, i) => i !== index));
    },
    [variants, onChange]
  );

  const handleAdd = useCallback(() => {
    const newVariant: VariantRow = {
      _tempId: crypto.randomUUID(),
      sku: "",
      color: "",
      size: "",
      material: "",
      price: basePrice,
      stock: 0,
      isActive: true,
      _image: null,
    };

    onChange([...variants, newVariant]);
  }, [variants, onChange, basePrice]);

  return (
    <div className="variant-editor">
      <div className="variant-header">
        <label className="variant-label">
          Variants ({variants.length})
        </label>

        <button
          onClick={handleAdd}
          className="variant-add-btn"
        >
          <Plus size={14} />
          Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="variant-empty">
          <p>No variants yet</p>
          <button className="admin-btn" onClick={handleAdd}>
            Add your first variant
          </button>
        </div>
      ) : (
        <div className="variant-list">
          {variants.map((variant, i) => (
            <MemoizedVariantRow
              key={variant._tempId || variant.sku || i}
              variant={variant}
              index={i}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const VariantEditor = memo(VariantEditorInner);
export type { VariantRow };