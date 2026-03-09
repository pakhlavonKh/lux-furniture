// src/pages/Account/AccountPage.tsx

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Layout } from "@/components/layout/Layout"
import { apiFetch } from "@/lib/api"
import AccountHero from "./components/AccountHero"
import ProfileCard from "./components/ProfileCard"
import OrdersList from "./components/OrdersList"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
}

interface Order {
  _id: string
  orderNumber: string
  orderStatus: string
  grandTotal: number
  createdAt: string
}

export default function AccountPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("authToken")

  useEffect(() => {
    if (!token) navigate("/login", { replace: true })
  }, [token, navigate])

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
        <div className="pt-32 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  const user = userData?.user
  const orders = ordersData?.orders ?? []

  if (!user) return null

  return (
    <Layout>
      <section className="pt-32 pb-32">
        {/* HERO */}
        <AccountHero user={user} />

        {/* CONTENT */}
        <div className="mt-20 max-w-[720px] mx-auto px-6">
          <Tabs defaultValue="profile" className="w-full">

            <TabsList className="grid grid-cols-2 mb-12">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileCard user={user} />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersList orders={orders} />
            </TabsContent>

          </Tabs>
        </div>
      </section>
    </Layout>
  )
}