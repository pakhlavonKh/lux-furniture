import { useState, useMemo } from "react";
import { ProductVariant } from "@/data/catalogData";
import { cn } from "@/lib/utils";

interface ProductVariantSelectorProps {
  variants?: ProductVariant[];
  onVariantSelect?: (variant: ProductVariant | null) => void;
  className?: string;
}

export function ProductVariantSelector({
  variants,
  onVariantSelect,
  className,
}: ProductVariantSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const colors = useMemo(() => {
    const uniqueColors = new Set<string>();
    variants?.forEach((v) => {
      if (v.color && !v.id.endsWith("-base")) uniqueColors.add(v.color);
    });
    return Array.from(uniqueColors);
  }, [variants]);

  const sizes = useMemo(() => {
    const uniqueSizes = new Set<string>();
    variants?.forEach((v) => {
      if (v.size && !v.id.endsWith("-base")) uniqueSizes.add(v.size);
    });
    return Array.from(uniqueSizes);
  }, [variants]);

  const baseVariant = useMemo(() => {
    return variants?.find((v) => v.id.endsWith("-base"));
  }, [variants]);

  const handleVariantClick = (variantId: string) => {
    setSelectedId(variantId);
    const selected = variants?.find((v) => v.id === variantId);
    onVariantSelect?.(selected || null);
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className={cn("variant-selector", className)}>
      {colors.length > 0 && (
        <div className="variant-group">
          <label className="variant-label">Colors</label>
          <div className="variant-options">
            {baseVariant && (
              <button
                onClick={() => handleVariantClick(baseVariant.id)}
                className={cn(
                  "variant-button variant-color",
                  selectedId === baseVariant.id && "selected"
                )}
                title="Base / Default"
              >
                <span
                  className="color-swatch"
                  style={{
                    backgroundColor: "#CCCCCC",
                  }}
                />
                <span className="color-name">Base</span>
              </button>
            )}
            {colors.map((color) => {
              const variantsWithColor = variants.filter(
                (v) => v.color === color
              );
              const variantId = variantsWithColor[0]?.id;

              return (
                <button
                  key={color}
                  onClick={() => variantId && handleVariantClick(variantId)}
                  className={cn(
                    "variant-button variant-color",
                    selectedId === variantId && "selected"
                  )}
                  title={color}
                >
                  <span
                    className="color-swatch"
                    style={{
                      backgroundColor: getColorCode(color),
                    }}
                  />
                  <span className="color-name">{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="variant-group">
          <label className="variant-label">Sizes</label>
          <div className="variant-options">
            {baseVariant && !colors.length && (
              <button
                onClick={() => handleVariantClick(baseVariant.id)}
                className={cn(
                  "variant-button variant-size",
                  selectedId === baseVariant.id && "selected"
                )}
                title="Base / Default"
              >
                Base
              </button>
            )}
            {sizes.map((size) => {
              const variantsWithSize = variants.filter((v) => v.size === size);
              const variantId = variantsWithSize[0]?.id;

              return (
                <button
                  key={size}
                  onClick={() => variantId && handleVariantClick(variantId)}
                  className={cn(
                    "variant-button variant-size",
                    selectedId === variantId && "selected"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    Black: "#000000",
    White: "#FFFFFF",
    Gray: "#808080",
    "Light Gray": "#D3D3D3",
    Red: "#FF0000",
    Blue: "#0000FF",
    Green: "#00AA00",
    Brown: "#8B4513",
    Oak: "#D2B48C",
    Walnut: "#5D4037",
    Beige: "#F5F5DC",
    Cream: "#FFFDD0",
  };

  return colorMap[colorName] || "#CCCCCC";
}
