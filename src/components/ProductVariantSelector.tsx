import { useState, useMemo, useEffect } from "react";
import { ProductVariant } from "@/data/catalogData";
import { cn } from "@/lib/utils";

interface ProductVariantSelectorProps {
  variants?: ProductVariant[];
  onVariantSelect?: (variant: ProductVariant | null) => void;
  selectedVariantId?: string | null;
  className?: string;
}

export function ProductVariantSelector({
  variants,
  onVariantSelect,
  selectedVariantId,
  className,
}: ProductVariantSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    // Initialize with selectedVariantId if provided, otherwise first variant id
    return selectedVariantId || variants?.[0]?.id || null;
  });

  // Sync selectedId with the prop from parent
  useEffect(() => {
    if (selectedVariantId) {
      setSelectedId(selectedVariantId);
    }
  }, [selectedVariantId]);

  // Call onVariantSelect when selectedId or variants change
  useEffect(() => {
    if (selectedId && variants) {
      const selectedVariant = variants.find((v) => v.id === selectedId);
      if (selectedVariant) {
        onVariantSelect?.(selectedVariant);
      }
    }
  }, [selectedId, variants]);

  const colors = useMemo(() => {
    const uniqueColors = new Set<string>();
    variants?.forEach((v) => {
      if (v.color) uniqueColors.add(v.color);
    });
    return Array.from(uniqueColors);
  }, [variants]);

  const sizes = useMemo(() => {
    const uniqueSizes = new Set<string>();
    variants?.forEach((v) => {
      if (v.size) uniqueSizes.add(v.size);
    });
    return Array.from(uniqueSizes);
  }, [variants]);

  const handleVariantClick = (variantId: string) => {
    setSelectedId(variantId);
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
                  <span className="color-name">{color.charAt(0).toUpperCase() + color.slice(1)}</span>
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
                  {size.charAt(0).toUpperCase() + size.slice(1)}
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
