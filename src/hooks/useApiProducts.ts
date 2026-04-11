import { useState, useEffect, useCallback } from "react";
import { getApiProducts, type ProductData } from "@/lib/api";

export function useApiProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    getApiProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    getApiProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error, refetch };
}

/** Get the primary image URL from an API product */
export function getApiImageUrl(product: ProductData): string {
  const primary = product.images?.find((img) => img.isPrimary);
  const img = primary || product.images?.[0];
  return img?.url || "";
}
