// src/pages/Account/AccountPage.tsx

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ShoppingCart } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Layout } from "@/components/layout/Layout"
import { useLanguage } from "@/contexts/useLanguageHook"
import { apiFetch } from "@/lib/api"
import AccountHero from "./components/AccountHero"
import ProfileCard from "./components/ProfileCard"
import OrdersList from "./components/OrdersList"
import "./account.css"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
}

interface Order {
  _id: string
  orderNumber: string
  orderStatus: string
  grandTotal: number
  createdAt: string
}

export default function AccountPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile")
  const token = localStorage.getItem("authToken")

  useEffect(() => {
    if (!token) navigate("/login", { replace: true })
  }, [token, navigate])

  useEffect(() => {
    const state = location.state as { tab?: string } | undefined
    if (state?.tab === "profile") {
      setActiveTab("profile")
    }
  }, [location])

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      apiFetch<{ success: boolean; user: User }>("/api/users/me"),
    enabled: !!token,
    retry: false,
  })

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      apiFetch<{ success: boolean; orders: Order[] }>("/api/orders/my"),
    enabled: !!token,
    retry: false,
  })

  if (!token || userLoading || ordersLoading) {
    return (
      <Layout>
        <div className="account-loading">
          <div className="account-loading-spinner" />
        </div>
      </Layout>
    )
  }

  const user = userData?.user
  const orders = ordersData?.orders ?? []

  if (!user) return null

  return (
    <Layout>

      {/* MAIN CONTENT */}
      <section className="account-main pt-28">
        <div className="account-container">
          {/* Action Buttons */}
          <div className="account-view-basket">
            <button
              onClick={() => navigate("/cart")}
              className="account-view-basket-btn"
            >
              <ShoppingCart className="account-view-basket-icon" />
              {t("account.viewBasket")}
            </button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "profile" | "orders")} className="account-tabs">
            {/* TAB NAVIGATION */}
            <TabsList className="account-tab-list" data-state={activeTab}>
              <TabsTrigger value="profile" className="account-tab-trigger">
                {t("account.profile")}
              </TabsTrigger>
              <TabsTrigger value="orders" className="account-tab-trigger">
                {t("account.orders")}
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENT */}
            <TabsContent value="profile" className="account-tab-content">
              <ProfileCard user={user} />
            </TabsContent>

            <TabsContent value="orders" className="account-tab-content">
              <OrdersList orders={orders} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  )
}