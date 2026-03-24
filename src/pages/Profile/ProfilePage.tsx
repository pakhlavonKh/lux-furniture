// src/pages/Profile/ProfilePage.tsx
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
import { useOrders, useUpdateProfile, useUser, type Order, type MeUser } from "@/hooks/profileHooks";
import { User, Phone, MapPin, ChevronRight, MoreHorizontal, UserCircle } from "lucide-react";
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

function getStatusBadgeClass(orderStatus?: string) {
  const s = (orderStatus || "").toLowerCase();
  if (s === "in_production" || s === "ready" || s === "shipped") return "profile-order-status-badge profile-order-status-badge--on-way";
  if (s === "delivered") return "profile-order-status-badge profile-order-status-badge--delivered";
  if (s === "cancelled") return "profile-order-status-badge profile-order-status-badge--cancelled";
  return "profile-order-status-badge profile-order-status-badge--processing";
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

/** Returns a stable picsum URL seeded by a string so each order gets a unique but consistent image */
function getOrderImageUrl(seed: string) {
  // Create a numeric seed from the last 6 chars of order id
  const numericSeed = seed.slice(-6).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `https://picsum.photos/seed/${numericSeed}/200/200`;
}

// ─────────────────────────────────────────
// Hero / Greeting
// ─────────────────────────────────────────

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
    <section className="profile-hero" aria-label="Welcome banner">
      <div className="profile-hero-inner">
        <h1 className="profile-hero-title">Welcome, {name}</h1>
        <p className="profile-hero-subtitle">Manage your orders and profile</p>
        <div className="profile-hero-actions">
          <Button
            className="profile-hero-btn-primary"
            onClick={onViewOrders}
            aria-label="Scroll to my orders"
          >
            My Orders
          </Button>
          <Button
            className="profile-hero-btn-outline"
            onClick={onEditAddress}
            aria-label="Edit profile / address"
          >
            Edit Profile
          </Button>
          <Button
            className="profile-hero-btn-icon"
            aria-label="More options"
            title="More options"
          >
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// Profile Info Card (read-only)
// ─────────────────────────────────────────

function ProfileInfoCard({
  user,
  onEdit,
}: {
  user: MeUser;
  onEdit: () => void;
}) {
  const parsed = parseAddress(user.address);
  const hasAddress = !!user.address?.trim();

  return (
    <div className="profile-info-card">
      {/* Name */}
      <div className="profile-info-row">
        <User className="profile-info-icon" aria-hidden="true" />
        <div className="profile-info-text">
          <span className="profile-info-name">{user.name}</span>
        </div>
      </div>

      {/* Phone */}
      {user.phone && (
        <div className="profile-info-row">
          <Phone className="profile-info-icon" aria-hidden="true" />
          <div className="profile-info-text">
            <span className="profile-info-name">{user.phone}</span>
          </div>
        </div>
      )}

      {/* Address */}
      <div className="profile-info-row">
        <MapPin className="profile-info-icon" aria-hidden="true" />
        <div className="profile-info-text">
          {hasAddress ? (
            <>
              <span className="profile-info-name">{parsed.city || "—"}</span>
              {user.address && (
                <p className="profile-info-sub">{user.address}</p>
              )}
            </>
          ) : (
            <span className="profile-info-sub">No address set</span>
          )}
        </div>
      </div>

      {/* Edit button */}
      <div className="profile-info-footer">
        <button
          className="profile-edit-btn"
          onClick={onEdit}
          aria-label="Edit address"
        >
          Edit
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Last Order Card
// ─────────────────────────────────────────

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
    <section id="lastOrder" aria-label="Last order" className="profile-last-order-card">
      <p className="profile-last-order-title">My Orders</p>

      {!hasOrders ? (
        <>
          <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
            You don't have any orders yet
          </p>
          <Button className="profile-last-order-btn" onClick={onGoCatalog}>
            Go to Catalog
          </Button>
        </>
      ) : (
        <>
          {/* Thumbnail */}
          <div className="profile-order-thumb-wrap">
            <img
              src={getOrderImageUrl(order?._id ?? "default")}
              alt={getOrderDisplayName(order)}
              className="profile-order-thumb"
              loading="lazy"
            />
            <span className={getStatusBadgeClass(order?.orderStatus)}>
              {getOrderStatusLabel(order?.orderStatus)}
            </span>
          </div>

          {/* Info */}
          <div>
            <p className="profile-last-order-name">{getOrderDisplayName(order)}</p>
            <p className="profile-last-order-date">{formatShortDate(order?.createdAt)}</p>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Button
              className="profile-last-order-btn"
              onClick={onGoCatalog}
            >
              Go to Catalog
            </Button>
            <Button
              variant="outline"
              style={{ borderRadius: "9999px", height: "2.5rem" }}
              onClick={() => onViewOrder(order?._id || "")}
            >
              View order
            </Button>
          </div>
        </>
      )}
    </section>
  );
}

// ─────────────────────────────────────────
// Order Row (compact horizontal)
// ─────────────────────────────────────────

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
  const deliveryCity = order.deliveryAddress?.city;
  const deliveryStreet = order.deliveryAddress?.address;
  const addressLabel = [deliveryCity, deliveryStreet].filter(Boolean).join(", ");

  return (
    <div className="profile-order-row" role="listitem">
      <img
        src={getOrderImageUrl(order._id)}
        alt={getOrderDisplayName(order)}
        className="profile-order-row-img"
        loading="lazy"
      />

      <div className="profile-order-row-info">
        <p className="profile-order-row-name">{getOrderDisplayName(order)}</p>
        {addressLabel && (
          <p className="profile-order-row-address">{addressLabel}</p>
        )}
        <p className="profile-order-row-date">{formatShortDate(order.createdAt)}</p>
      </div>

      <div className="profile-order-row-actions">
        <Button
          className="profile-order-again-btn"
          onClick={() => onOrderAgain(order._id)}
          disabled={repeatingId === order._id}
          aria-label={`Order ${getOrderDisplayName(order)} again`}
        >
          {repeatingId === order._id ? "Ordering..." : "Order Again"}
        </Button>
        <Button
          className="profile-order-more-btn"
          onClick={() => onViewOrder(order._id)}
          aria-label="View order details"
          title="View order details"
        >
          <MoreHorizontal size={16} />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Orders List with Breadcrumb
// ─────────────────────────────────────────

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
    <section id="orders" aria-label="All orders" className="profile-orders-section">
      {/* Breadcrumb */}
      <div className="profile-breadcrumb" aria-label="Breadcrumb">
        <span className="profile-breadcrumb-icon" aria-hidden="true">
          <UserCircle />
        </span>
        <span>My Profile</span>
        <span className="profile-breadcrumb-sep" aria-hidden="true">/</span>
        <span className="profile-breadcrumb-active">My Orders</span>
      </div>

      {/* List card */}
      <div className="profile-orders-list-card" role="list" aria-label="Order list">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            repeatingId={repeatingId}
            onViewOrder={onViewOrder}
            onOrderAgain={onOrderAgain}
          />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// Address Block (show / edit toggle)
// ─────────────────────────────────────────

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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCity(parsed.city);
    setDistrict(parsed.district);
    setStreetHouseApartment(parsed.streetHouseApartment);
    setComment(parsed.comment);
  }, [parsed.city, parsed.district, parsed.streetHouseApartment, parsed.comment]);

  const handleSave = async () => {
    await onSave({
      city,
      district,
      streetHouseApartment,
      comment,
      fullAddress: buildFullAddress(city, district, streetHouseApartment, comment),
    });
    setIsEditing(false);
  };

  return (
    <section id="address" aria-label="My address">
      <h2 className="profile-section-heading">My address</h2>

      <Card className="profile-premium-card" style={{ padding: "1.5rem" }}>
        {!isEditing ? (
          /* ── View mode ── */
          <div>
            <div className="profile-address-view">
              <MapPin className="profile-address-view-icon" aria-hidden="true" />
              {initialAddress?.trim() ? (
                <p className="profile-address-view-text">{initialAddress}</p>
              ) : (
                <p className="profile-address-empty">No address saved yet.</p>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
              <Button
                className="profile-address-edit-btn"
                onClick={() => setIsEditing(true)}
                aria-label="Edit address"
              >
                Edit address
              </Button>
            </div>
          </div>
        ) : (
          /* ── Edit mode ── */
          <div className="profile-address-form-fields">
            <div>
              <label className="profile-field-label" htmlFor="addr-city">City</label>
              <Input
                id="addr-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 text-base"
                placeholder="City name"
              />
            </div>
            <div>
              <label className="profile-field-label" htmlFor="addr-district">District</label>
              <Input
                id="addr-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="h-12 text-base"
                placeholder="District name"
              />
            </div>
            <div>
              <label className="profile-field-label" htmlFor="addr-street">Street / house / apartment</label>
              <Input
                id="addr-street"
                value={streetHouseApartment}
                onChange={(e) => setStreetHouseApartment(e.target.value)}
                className="h-12 text-base"
                placeholder="Street, house number, apartment"
              />
            </div>
            <div>
              <label className="profile-field-label" htmlFor="addr-comment">Comment (optional)</label>
              <Textarea
                id="addr-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Any extra note for delivery (optional)"
                className="min-h-[90px]"
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Button
                size="lg"
                className="w-full justify-center profile-primary-action"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full justify-center"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}

// ─────────────────────────────────────────
// Support Block
// ─────────────────────────────────────────

function SupportBlock() {
  const navigate = useNavigate();
  return (
    <section aria-label="Support">
      <h2 className="profile-section-heading">Need help?</h2>
      <div className="profile-support-actions">
        <Button
          className="profile-support-btn-primary"
          onClick={() => navigate("/contact")}
        >
          Contact via Telegram
        </Button>
        <Button
          className="profile-support-btn-outline"
          asChild
        >
          <a href="tel:+998955215050">Call support</a>
        </Button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────

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
        <div className="profile-loading-wrap">
          <div className="profile-loading-inner">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (userError || ordersError || !user) {
    return (
      <Layout>
        <div className="profile-content" style={{ maxWidth: "480px" }}>
          <Card className="profile-premium-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ fontWeight: 500 }}>Something went wrong</p>
            <Button
              className="profile-hero-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => navigate("/")}
            >
              Go to catalog
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ── Hero (full-width) ── */}
      <GreetingSection
        name={user.name}
        onViewOrders={() => scrollToSection(ordersAnchorId)}
        onEditAddress={() => scrollToSection("address")}
      />

      {/* ── Main content ── */}
      <div className="profile-content">
        {/* Profile + Last Order */}
        <div>
          <h2 className="profile-section-heading">Мой профиль</h2>
          <div className="profile-cards-grid">
            <ProfileInfoCard
              user={user}
              onEdit={() => scrollToSection("address")}
            />
            <LastOrderCard
              order={lastOrder}
              hasOrders={ordersList.length > 0}
              repeatingId={repeatingId}
              onViewOrder={(id) => navigate(`/profile/orders/${id}`)}
              onOrderAgain={handleOrderAgain}
              onGoCatalog={() => navigate("/")}
            />
          </div>
        </div>

        {/* Orders list */}
        <OrdersList
          orders={ordersList}
          repeatingId={repeatingId}
          onViewOrder={(id) => navigate(`/profile/orders/${id}`)}
          onOrderAgain={handleOrderAgain}
        />

        {/* Address form */}
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

        {/* Support */}
        <SupportBlock />
      </div>
    </Layout>
  );
}
