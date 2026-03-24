// src/lib/api.ts

// In dev, route through Vite to avoid cross-origin/CORS issues.
// In production, keep absolute URL so it works behind different hosts/ports.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

/* ===========================
   GENERATE IDEMPOTENCY KEY
=========================== */

function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

/* ===========================
   API FETCH (PRODUCTION SAFE)
=========================== */

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const token = localStorage.getItem("authToken");

  const isFormData =
    options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  /* ===========================
     ADD IDEMPOTENCY FOR CHECKOUT
  ============================ */

  if (endpoint.includes("/checkout") || endpoint.includes("/payments/create")) {
    headers["Idempotency-Key"] = generateIdempotencyKey();
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const contentType =
    response.headers.get("content-type");

  const data =
    contentType?.includes("application/json")
      ? await response.json()
      : null;

  if (!response.ok) {
    throw new Error(
      data?.message || "API request failed"
    );
  }

  return data as T;
}

/* ===========================
   LOCALIZED STRING TYPE
=========================== */
export interface LocalizedString {
  en: string;
  ru: string;
  uz: string;
}

/* ===========================
   NEWS API
=========================== */
export interface News {
  _id?: string;
  id?: string;
  title: LocalizedString;
  description: LocalizedString;
  content?: LocalizedString;
  image?: {
    url?: string;
    public_id?: string;
    alt?: string;
  };
  isActive: boolean;
  publishedAt?: string;
  updatedAt?: string;
  order?: number;
}

export async function getAllNews(activeOnly = true): Promise<News[]> {
  const response = await apiFetch<{ success: boolean; data: News[] }>(
    `/api/news?active=${activeOnly}`
  );
  return response.data || [];
}

export async function getNewsById(id: string): Promise<News> {
  const response = await apiFetch<{ success: boolean; data: News }>(
    `/api/news/${id}`
  );
  return response.data;
}

export async function createNews(news: News): Promise<News> {
  const response = await apiFetch<{ success: boolean; data: News }>(
    "/api/news",
    {
      method: "POST",
      body: JSON.stringify(news),
    }
  );
  return response.data;
}

export async function updateNews(id: string, news: Partial<News>): Promise<News> {
  const response = await apiFetch<{ success: boolean; data: News }>(
    `/api/news/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(news),
    }
  );
  return response.data;
}

export async function deleteNews(id: string): Promise<void> {
  await apiFetch(`/api/news/${id}`, {
    method: "DELETE",
  });
}

/* ===========================
   DISCOUNTS API
=========================== */
export interface Discount {
  _id?: string;
  id?: string;
  code?: string;
  title: LocalizedString;
  description: LocalizedString;
  percentage: number;
  productIds: string[];
  image?: {
    url?: string;
    public_id?: string;
    alt?: string;
  };
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  order?: number;
}

export async function getAllDiscounts(activeOnly = true): Promise<Discount[]> {
  const response = await apiFetch<{ success: boolean; data: Discount[] }>(
    `/api/discounts?active=${activeOnly}`
  );
  return response.data || [];
}

export async function getDiscountById(id: string): Promise<Discount> {
  const response = await apiFetch<{ success: boolean; data: Discount }>(
    `/api/discounts/${id}`
  );
  return response.data;
}

export async function getDiscountForProduct(productId: string): Promise<Discount | null> {
  const response = await apiFetch<{ success: boolean; data: Discount | null }>(
    `/api/discounts/product/${encodeURIComponent(productId)}`
  );
  return response.data;
}

export async function createDiscount(discount: Discount): Promise<Discount> {
  const response = await apiFetch<{ success: boolean; data: Discount }>(
    "/api/discounts",
    {
      method: "POST",
      body: JSON.stringify(discount),
    }
  );
  return response.data;
}

export async function updateDiscount(
  id: string,
  discount: Partial<Discount>
): Promise<Discount> {
  const response = await apiFetch<{ success: boolean; data: Discount }>(
    `/api/discounts/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(discount),
    }
  );
  return response.data;
}

export async function deleteDiscount(id: string): Promise<void> {
  await apiFetch(`/api/discounts/${id}`, {
    method: "DELETE",
  });
}

/* ===========================
   PRODUCTS API
=========================== */

export interface ProductImage {
  url: string;
  public_id: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductVariantData {
  sku: string;
  color?: string;
  size?: string;
  material?: string;
  price: number;
  stock: number;
  isActive?: boolean;
}

export interface ProductData {
  _id?: string;
  name: LocalizedString;
  slug: string;
  description?: LocalizedString;
  shortDescription?: LocalizedString;
  category: string;
  subcategory?: string;
  collections?: string[];
  basePrice: number;
  vatPercent?: number;
  availability?: "in_stock" | "preorder" | "made_to_order";
  images: ProductImage[];
  variants: ProductVariantData[];
  materials?: { frame?: string; upholstery?: string; legs?: string };
  dimensions?: { width?: number; height?: number; depth?: number };
  weight?: number;
  shippingClass?: string;
  productionTimeDays?: number;
  warrantyMonths?: number;
  assemblyAvailable?: boolean;
  assemblyPrice?: number;
  assemblyTimeDays?: number;
  customizable?: boolean;
  seo?: { title?: LocalizedString; description?: LocalizedString };
  isFeatured?: boolean;
  isActive?: boolean;
  totalStock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function getApiProducts(params?: {
  category?: string;
  collection?: string;
  active?: boolean;
  featured?: boolean;
  search?: string;
}): Promise<ProductData[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.collection) query.set("collection", params.collection);
  if (params?.active !== undefined) query.set("active", String(params.active));
  if (params?.featured !== undefined) query.set("featured", String(params.featured));
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  const response = await apiFetch<{ success: boolean; data: ProductData[] }>(
    `/api/products${qs ? `?${qs}` : ""}`
  );
  return response.data || [];
}

export async function getApiProductById(id: string): Promise<ProductData> {
  const response = await apiFetch<{ success: boolean; data: ProductData }>(
    `/api/products/${id}`
  );
  return response.data;
}

export async function createApiProduct(product: Omit<ProductData, "_id">): Promise<ProductData> {
  const response = await apiFetch<{ success: boolean; data: ProductData }>(
    "/api/products",
    { method: "POST", body: JSON.stringify(product) }
  );
  return response.data;
}

export async function updateApiProduct(id: string, product: Partial<ProductData>): Promise<ProductData> {
  const response = await apiFetch<{ success: boolean; data: ProductData }>(
    `/api/products/${id}`,
    { method: "PUT", body: JSON.stringify(product) }
  );
  return response.data;
}

export async function deleteApiProduct(id: string): Promise<void> {
  await apiFetch(`/api/products/${id}`, { method: "DELETE" });
}

export async function updateVariantStock(
  productId: string,
  sku: string,
  stock: number
): Promise<ProductData> {
  const response = await apiFetch<{ success: boolean; data: ProductData }>(
    `/api/products/${productId}/variants/${encodeURIComponent(sku)}/stock`,
    { method: "PATCH", body: JSON.stringify({ stock }) }
  );
  return response.data;
}

export async function uploadImages(files: File[]): Promise<ProductImage[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }
  
  try {
    const response = await apiFetch<{ success: boolean; data: ProductImage[] }>("/api/upload", {
      method: "POST",
      body: formData,
    });
    return response.data || [];
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

/* ===========================
   COLLECTIONS API
=========================== */
export interface Collection {
  _id?: string;
  name: string;
  displayName: string;
  description?: string;
  image?: {
    url?: string;
    public_id?: string;
  };
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAllCollections(activeOnly = false): Promise<Collection[]> {
  const qs = activeOnly ? "?active=true" : "";
  const response = await apiFetch<{ success: boolean; data: Collection[] }>(
    `/api/collections${qs}`
  );
  return response.data || [];
}

export async function createCollection(collection: Omit<Collection, "_id" | "createdAt" | "updatedAt">): Promise<Collection> {
  const response = await apiFetch<{ success: boolean; data: Collection }>(
    "/api/collections",
    {
      method: "POST",
      body: JSON.stringify(collection),
    }
  );
  return response.data;
}