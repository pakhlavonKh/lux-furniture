import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useOrders, useUpdateProfile, useUser, type Order } from "@/hooks/profileHooks";
import "./profile.css";

function formatShortDate(date?: string) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getOrderDisplayName(order: Order | undefined) {
  const firstItem = order?.items?.[0];
  if (firstItem?.nameSnapshot) return firstItem.nameSnapshot;
  const productName = firstItem?.product?.name;
  if (typeof productName === "string") return productName;
  if (productName && typeof productName === "object") {
    const names = productName as { en?: string; ru?: string; uz?: string };
    return names.uz || names.en || names.ru || "";
  }
  return "Your order";
}

function getOrderStatusLabel(orderStatus?: string) {
  const s = (orderStatus || "").toLowerCase();
  if (!s) return "Processing";
  if (s === "created") return "Order received";
  if (s === "confirmed") return "Confirmed";
  if (s === "in_production" || s === "ready" || s === "shipped") return "On the way";
  if (s === "delivered") return "Delivered";
  if (s === "cancelled") return "Cancelled";
  return orderStatus;
}

function parseAddress(address?: string) {
  const text = (address || "").trim();
  if (!text) return { city: "", district: "", streetHouseApartment: "", comment: "" };

  const parts = text
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    return {
      city: parts[0] ?? "",
      district: parts[1] ?? "",
      streetHouseApartment: parts.slice(2).join(", "),
      comment: "",
    };
  }

  if (parts.length === 2) {
    return {
      city: parts[0] ?? "",
      district: "",
      streetHouseApartment: parts[1] ?? "",
      comment: "",
    };
  }

  return { city: "", district: "", streetHouseApartment: text, comment: "" };
}

function buildFullAddress(city: string, district: string, streetHouseApartment: string, comment?: string) {
  const parts = [city.trim(), district.trim(), streetHouseApartment.trim()].filter(Boolean);
  const base = parts.join(", ");
  const c = comment?.trim();
  return c ? `${base}${base ? ", " : ""}${c}` : base;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function GreetingSection({
  name,
  onViewOrders,
  onEditAddress,
}: {
  name: string;
  onViewOrders: () => void;
  onEditAddress: () => void;
}) {
  return (
    <section className="space-y-4">
      <Card className="profile-premium-card p-5 space-y-4">
        <h1 className="text-3xl font-semibold">Hello, {name} 👋</h1>
        <div className="space-y-3">
          <Button size="lg" className="w-full justify-center" onClick={onViewOrders}>
            View my orders
          </Button>
          <Button size="lg" variant="outline" className="w-full justify-center" onClick={onEditAddress}>
            Edit my address
          </Button>
        </div>
      </Card>
    </section>
  );
}

function LastOrderCard({
  order,
  hasOrders,
  repeatingId,
  onViewOrder,
  onOrderAgain,
  onGoCatalog,
}: {
  order?: Order;
  hasOrders: boolean;
  repeatingId: string | null;
  onViewOrder: (id: string) => void;
  onOrderAgain: (id: string) => void;
  onGoCatalog: () => void;
}) {
  return (
    <section id="lastOrder" aria-label="Last order">
      {!hasOrders ? (
        <Card className="profile-premium-card p-5 space-y-3">
          <p className="text-base font-medium">You don’t have any orders yet</p>
          <Button size="lg" className="w-full justify-center" onClick={onGoCatalog}>
            Go to catalog
          </Button>
        </Card>
      ) : (
        <Card className="profile-premium-card p-5 space-y-4">
          <div className="space-y-1">
            <p className="text-lg font-semibold">{getOrderDisplayName(order)}</p>
            <p className="text-sm text-muted-foreground">{getOrderStatusLabel(order?.orderStatus)}</p>
            <p className="text-sm text-muted-foreground">{formatShortDate(order?.createdAt)}</p>
          </div>
          <div className="space-y-2">
            <Button
              size="lg"
              className="w-full justify-center profile-primary-action"
              onClick={() => onOrderAgain(order?._id || "")}
              disabled={!order?._id || repeatingId === order?._id}
            >
              {repeatingId === order?._id ? "Ordering again..." : "Order again"}
            </Button>
            <Button size="lg" variant="outline" className="w-full justify-center" onClick={() => onViewOrder(order?._id || "")}>
              View order
            </Button>
          </div>
        </Card>
      )}
    </section>
  );
}

function OrderCard({
  order,
  repeatingId,
  onViewOrder,
  onOrderAgain,
}: {
  order: Order;
  repeatingId: string | null;
  onViewOrder: (id: string) => void;
  onOrderAgain: (id: string) => void;
}) {
  return (
    <Card className="profile-premium-card p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-base font-semibold">{getOrderDisplayName(order)}</p>
        <p className="text-sm text-muted-foreground">{formatShortDate(order.createdAt)}</p>
        <p className="text-sm text-muted-foreground">{getOrderStatusLabel(order.orderStatus)}</p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Button
          size="lg"
          className="w-full justify-center profile-primary-action"
          onClick={() => onOrderAgain(order._id)}
          disabled={repeatingId === order._id}
        >
          {repeatingId === order._id ? "Ordering again..." : "Order again"}
        </Button>
        <Button size="lg" variant="outline" className="w-full justify-center" onClick={() => onViewOrder(order._id)}>
          View order
        </Button>
      </div>
    </Card>
  );
}

function OrdersList({
  orders,
  repeatingId,
  onViewOrder,
  onOrderAgain,
}: {
  orders: Order[];
  repeatingId: string | null;
  onViewOrder: (id: string) => void;
  onOrderAgain: (id: string) => void;
}) {
  if (orders.length === 0) return null;

  return (
    <section id="orders" className="space-y-4" aria-label="All orders">
      <h2 className="text-xl font-semibold">My orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} repeatingId={repeatingId} onViewOrder={onViewOrder} onOrderAgain={onOrderAgain} />
        ))}
      </div>
    </section>
  );
}

function AddressBlock({
  initialAddress,
  onSave,
  saving,
}: {
  initialAddress?: string;
  saving: boolean;
  onSave: (payload: {
    city: string;
    district: string;
    streetHouseApartment: string;
    comment?: string;
    fullAddress: string;
  }) => Promise<void> | void;
}) {
  const parsed = useMemo(() => parseAddress(initialAddress), [initialAddress]);
  const [city, setCity] = useState(parsed.city);
  const [district, setDistrict] = useState(parsed.district);
  const [streetHouseApartment, setStreetHouseApartment] = useState(parsed.streetHouseApartment);
  const [comment, setComment] = useState(parsed.comment);

  useEffect(() => {
    setCity(parsed.city);
    setDistrict(parsed.district);
    setStreetHouseApartment(parsed.streetHouseApartment);
    setComment(parsed.comment);
  }, [parsed.city, parsed.district, parsed.streetHouseApartment, parsed.comment]);

  return (
    <section id="address" className="space-y-4" aria-label="My address">
      <h2 className="text-xl font-semibold profile-section-title">My address</h2>
      <Card className="profile-premium-card p-5 space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} className="h-12 text-base" placeholder="City name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">District</label>
            <Input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="h-12 text-base"
              placeholder="District name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Street / house / apartment</label>
            <Input
              value={streetHouseApartment}
              onChange={(e) => setStreetHouseApartment(e.target.value)}
              className="h-12 text-base"
              placeholder="Street, house number, apartment"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Comment (optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Any extra note for delivery (optional)"
              className="min-h-[90px]"
            />
          </div>
        </div>

        <Button
          size="lg"
          className="w-full justify-center profile-primary-action"
          onClick={() =>
            onSave({
              city,
              district,
              streetHouseApartment,
              comment,
              fullAddress: buildFullAddress(city, district, streetHouseApartment, comment),
            })
          }
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Card>
    </section>
  );
}

function SupportBlock() {
  const navigate = useNavigate();
  return (
    <section className="space-y-4" aria-label="Support">
      <h2 className="text-xl font-semibold">Need help?</h2>
      <div className="grid grid-cols-1 gap-2">
        <Button size="lg" className="w-full justify-center" onClick={() => navigate("/contact")}>
          Contact via Telegram
        </Button>
        <Button size="lg" variant="outline" className="w-full justify-center" asChild>
          <a href="tel:+998955215050">Call support</a>
        </Button>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUser();
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrders();

  const updateProfile = useUpdateProfile();

  const [repeatingId, setRepeatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  const ordersList = orders ?? [];
  const lastOrder = ordersList[0];
  const ordersAnchorId = ordersList.length > 0 ? "orders" : "lastOrder";
  const focus = (location.state as { focus?: "orders" | "address" } | null)?.focus;

  useEffect(() => {
    if (!focus) return;
    if (userLoading || ordersLoading) return;

    requestAnimationFrame(() => {
      if (focus === "address") scrollToSection("address");
      if (focus === "orders") scrollToSection(ordersAnchorId);
    });
  }, [focus, ordersAnchorId, ordersLoading, userLoading]);

  const handleOrderAgain = async (orderId: string) => {
    if (!orderId) return;
    try {
      setRepeatingId(orderId);

      const res = await apiFetch<unknown>("/api/orders/repeat", {
        method: "POST",
        body: JSON.stringify({ orderId }),
      });

      const resObj = res as Record<string, unknown>;
      const data = resObj?.data as unknown;
      const dataObj =
        typeof data === "object" && data ? (data as Record<string, unknown>) : undefined;

      const newOrderId =
        (dataObj?.order && typeof dataObj.order === "object"
          ? (dataObj.order as Record<string, unknown>)._id
          : undefined) ??
        (dataObj?._id as string | undefined) ??
        (dataObj?.id as string | undefined) ??
        (resObj?.order && typeof resObj.order === "object"
          ? (resObj.order as Record<string, unknown>)._id
          : undefined) ??
        null;

      await queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast({
        title: "Order again started",
        description: newOrderId ? "Opening your new order..." : "We are preparing your new order.",
      });

      if (newOrderId) navigate(`/profile/orders/${newOrderId}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Please try again.";
      toast({
        title: "Could not start order again",
        description: message,
        variant: "destructive",
      });
    } finally {
      setRepeatingId(null);
    }
  };

  if (!token) return null;

  if (userLoading || ordersLoading) {
    return (
      <Layout>
        <div className="px-4 py-12 max-w-md mx-auto">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (userError || ordersError || !user) {
    return (
      <Layout>
        <div className="px-4 py-12 max-w-md mx-auto">
          <Card className="p-5 space-y-3">
            <p className="font-medium">Something went wrong</p>
            <Button size="lg" className="w-full justify-center" onClick={() => navigate("/")}>
              Go to catalog
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-premium-page px-4 py-8 max-w-md mx-auto space-y-6">
        <GreetingSection
          name={user.name}
          onViewOrders={() => scrollToSection(ordersAnchorId)}
          onEditAddress={() => scrollToSection("address")}
        />

        <LastOrderCard
          order={lastOrder}
          hasOrders={ordersList.length > 0}
          repeatingId={repeatingId}
          onViewOrder={(id) => navigate(`/profile/orders/${id}`)}
          onOrderAgain={handleOrderAgain}
          onGoCatalog={() => navigate("/")}
        />

        <OrdersList
          orders={ordersList}
          repeatingId={repeatingId}
          onViewOrder={(id) => navigate(`/profile/orders/${id}`)}
          onOrderAgain={handleOrderAgain}
        />

        <AddressBlock
          initialAddress={user.address}
          saving={updateProfile.isPending}
          onSave={async (payload) => {
            try {
              await updateProfile.mutateAsync(payload);
              toast({ title: "Saved", description: "Your address has been updated." });
            } catch (e: unknown) {
              const message = e instanceof Error ? e.message : "Please try again.";
              toast({ title: "Save failed", description: message, variant: "destructive" });
            }
          }}
        />

        <SupportBlock />
      </div>
    </Layout>
  );
}

