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