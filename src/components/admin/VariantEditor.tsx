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

const inputCls =
  "w-full px-3 py-2 border border-border bg-transparent text-sm rounded focus:border-foreground focus:outline-none transition-colors";

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
    <div className="border border-border rounded-lg p-4 bg-secondary/10 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-muted-foreground">
          Variant #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 hover:bg-destructive/10 rounded transition-colors text-destructive"
          title="Remove variant"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">SKU *</label>
          <input
            type="text"
            value={variant.sku}
            onChange={(e) => onUpdate(index, { sku: e.target.value })}
            className={inputCls}
            placeholder="e.g. CHAIR-BLK-M"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Color</label>
          <input
            type="text"
            value={variant.color || ""}
            onChange={(e) => onUpdate(index, { color: e.target.value })}
            className={inputCls}
            placeholder="e.g. Black"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Size</label>
          <input
            type="text"
            value={variant.size || ""}
            onChange={(e) => onUpdate(index, { size: e.target.value })}
            className={inputCls}
            placeholder="e.g. Medium"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Material</label>
          <input
            type="text"
            value={variant.material || ""}
            onChange={(e) => onUpdate(index, { material: e.target.value })}
            className={inputCls}
            placeholder="e.g. Oak"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Price *</label>
          <input
            type="number"
            min="0"
            value={variant.price}
            onChange={(e) => onUpdate(index, { price: Number(e.target.value) || 0 })}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Stock</label>
          <input
            type="number"
            min="0"
            value={variant.stock}
            onChange={(e) => onUpdate(index, { stock: Number(e.target.value) || 0 })}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex items-end gap-4">
        <ImageUploader
          images={variant._image ? [variant._image] : []}
          onChange={handleImageChange}
          multiple={false}
          label="Variant Image"
        />
        <label className="flex items-center gap-2 cursor-pointer mb-1">
          <input
            type="checkbox"
            checked={variant.isActive !== false}
            onChange={(e) => onUpdate(index, { isActive: e.target.checked })}
            className="w-4 h-4 border border-border rounded cursor-pointer"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>
    </div>
  );
}

const MemoizedVariantRow = memo(VariantRowEditor);

function VariantEditorInner({ variants, onChange, basePrice }: VariantEditorProps) {
  const handleUpdate = useCallback(
    (index: number, patch: Partial<VariantRow>) => {
      const next = variants.map((v, i) => (i === index ? { ...v, ...patch } : v));
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
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-caption font-medium">
          Variants ({variants.length})
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-border rounded hover:bg-secondary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">No variants yet</p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-sm text-foreground underline hover:no-underline"
          >
            Add your first variant
          </button>
        </div>
      ) : (
        <div className="space-y-3">
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
