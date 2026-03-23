import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type PaymentMethod = "payme" | "click" | "uzum";

export interface MeUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface OrderItem {
  nameSnapshot: string;
  quantity: number;
  totalItemPrice: number;
  // Populated in some responses
  product?: {
    name?: { en?: string; ru?: string; uz?: string } | string;
  };
}

export interface DeliveryAddress {
  fullName?: string;
  phone?: string;
  city?: string;
  address?: string;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  orderStatus?: string;
  grandTotal?: number;
  createdAt?: string;
  items?: OrderItem[];
  deliveryAddress?: DeliveryAddress;
  paymentMethod?: PaymentMethod | string;
  paymentStatus?: string;
}

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
}

export function useUser() {
  const token = getAuthToken();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await apiFetch<{ success: boolean; user: MeUser }>("/api/users/me");
      return res.user;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useOrders() {
  const token = getAuthToken();

  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiFetch<{ success: boolean; orders: Order[] }>("/api/orders/my");
      return res.orders;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useOrder(id?: string) {
  const token = getAuthToken();

  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      try {
        const res = await apiFetch<unknown>(`/api/orders/${id}`);

        // Support multiple possible response shapes without relying on `any`.
        const resObj = res as Record<string, unknown>;
        const data = resObj?.data as unknown;
        const dataObj =
          typeof data === "object" && data ? (data as Record<string, unknown>) : undefined;

        const orderFromData = dataObj?.order as Order | undefined;
        const orderFromRes = resObj?.order as Order | undefined;
        const orderFromOrderData = resObj?.orderData as Order | undefined;

        return (orderFromData ??
          (data as Order) ??
          orderFromRes ??
          orderFromOrderData ??
          (res as Order)) as Order;
      } catch (error) {
        // Fallback: derive order details from "my orders".
        const resOrders = await apiFetch<{ success: boolean; orders: Order[] }>("/api/orders/my");
        const found = resOrders.orders?.find((o) => String(o._id) === String(id));
        if (found) return found;
        throw error;
      }
    },
    enabled: !!token && !!id,
    retry: false,
  });
}

export type UpdateProfilePayload = {
  city: string;
  district: string;
  streetHouseApartment: string;
  comment?: string;
  fullAddress: string;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      // Spec endpoint
      try {
        return await apiFetch("/api/users/profile", {
          method: "PATCH",
          body: JSON.stringify({
            city: payload.city,
            district: payload.district,
            streetHouseApartment: payload.streetHouseApartment,
            comment: payload.comment || "",
            address: payload.fullAddress,
          }),
        });
      } catch {
        // Compatibility fallback for current backend shape in this repo.
        return await apiFetch("/api/users/me", {
          method: "PUT",
          body: JSON.stringify({ address: payload.fullAddress }),
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

