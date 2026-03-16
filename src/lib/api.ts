// src/lib/api.ts

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5002";

/* ===========================
   GENERATE IDEMPOTENCY KEY
=========================== */

function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

/* ===========================
   API FETCH (PRODUCTION SAFE)
=========================== */

export async function apiFetch<T = any>(
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

  if (endpoint.includes("/checkout")) {
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
   NEWS API
=========================== */
export interface News {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  content?: string;
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
  title: string;
  description: string;
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
  code?: string;
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