// src/lib/api.ts

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5002";

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

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include", // future-proof (cookies / sessions)
    headers: {
      ...(isFormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Handle 204 No Content
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