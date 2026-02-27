// src/pages/Account/AccountPage.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { apiFetch } from "@/lib/api";
import AccountHero from "./components/AccountHero";
import ActiveOrderCard from "./components/ActiveOrderCard";
import OrdersList from "./components/OrdersList";
import ProfileCard from "./components/ProfileCard";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  grandTotal: number;
  createdAt: string;
  items: any[];
}

export default function AccountPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      apiFetch<{ success: boolean; user: User }>("/api/users/me"),
    enabled: !!token,
    retry: false,
  });

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      apiFetch<{ success: boolean; orders: Order[] }>("/api/orders/my"),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (userError || ordersError) {
      localStorage.removeItem("authToken");
      navigate("/login", { replace: true });
    }
  }, [userError, ordersError, navigate]);

  if (!token || userLoading || ordersLoading) {
    return (
      <Layout>
        <div className="pt-32 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const user = userData?.user;
  const orders = ordersData?.orders ?? [];

  if (!user) return null;

  const activeOrder = orders.find((o) =>
    ["created", "confirmed", "in_production", "shipped"].includes(
      o.orderStatus
    )
  );

  return (
    <Layout>
      <section className="pt-32 pb-24 min-h-screen">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">

          {/* HERO */}
          <div className="mb-16">
            <AccountHero user={user} />
          </div>

          {/* GRID LAYOUT */}
          <div className="grid lg:grid-cols-[350px_1fr] gap-12">

            {/* SIDEBAR */}
            <div className="space-y-8">
              <ProfileCard user={user} />
            </div>

            {/* MAIN CONTENT */}
            <div className="space-y-10">

              {activeOrder && (
                <ActiveOrderCard order={activeOrder} />
              )}

              <OrdersList orders={orders} />

            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
}