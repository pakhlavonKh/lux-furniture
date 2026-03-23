import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useOrder, type Order } from "@/hooks/profileHooks";

function formatMoneyUzSum(value?: number) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "";
  return `${n.toLocaleString()} UZS`;
}

function formatShortDate(date?: string) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
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

function getTimelineCurrentStep(orderStatus?: string) {
  const s = (orderStatus || "").toLowerCase();
  if (s === "created") return 0;
  if (s === "confirmed") return 1;
  if (s === "in_production" || s === "ready" || s === "shipped") return 2;
  if (s === "delivered") return 3;
  return -1;
}

function getPaymentLabel(method?: string) {
  const m = (method || "").toLowerCase();
  if (m === "payme") return "Payme";
  if (m === "click") return "Click";
  if (m === "uzum") return "Uzum";
  return method || "—";
}

function getOrderDisplayName(order: Order | undefined) {
  const firstItem = order?.items?.[0];
  if (firstItem?.nameSnapshot) return firstItem.nameSnapshot;
  return "Your order";
}

function StatusTimeline({ order }: { order: Order }) {
  const currentStep = getTimelineCurrentStep(order.orderStatus);
  const steps = [
    "Order received",
    "Confirmed",
    "On the way",
    "Delivered",
  ] as const;

  return (
    <Card className="p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-lg font-semibold">Delivery status</p>
        <p className="text-sm text-muted-foreground">{getOrderStatusLabel(order.orderStatus)}</p>
      </div>

      <div className="space-y-3">
        {steps.map((label, idx) => {
          const isCurrent = idx === currentStep;
          const isDone = currentStep >= 0 && idx < currentStep;

          return (
            <div key={label} className="flex gap-3 items-start">
              <div
                className={[
                  "mt-0.5 h-9 w-9 rounded-full flex items-center justify-center border",
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary"
                    : isDone
                      ? "bg-primary/20 text-primary border-primary/20"
                      : "bg-muted text-muted-foreground border-border",
                ].join(" ")}
              >
                {isDone || isCurrent ? "✓" : idx + 1}
              </div>
              <div>
                <p className={isCurrent ? "font-semibold" : ""}>{label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function OrderItems({ order }: { order: Order }) {
  const items = order.items ?? [];
  if (items.length === 0) {
    return (
      <Card className="p-5">
        <p className="text-sm text-muted-foreground">No items found.</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-lg font-semibold">Items</p>
        <p className="text-sm text-muted-foreground">{formatShortDate(order.createdAt)}</p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={`${item.nameSnapshot}-${idx}`} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium">{item.nameSnapshot}</p>
              <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
            </div>
            <div className="text-sm font-semibold text-right shrink-0">{formatMoneyUzSum(item.totalItemPrice)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function OrderSummary({ order }: { order: Order }) {
  const addr = order.deliveryAddress;
  const addressText = [addr?.city, addr?.address].filter(Boolean).join(", ") || "—";

  return (
    <Card className="p-5 space-y-4">
      <p className="text-lg font-semibold">Order summary</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-semibold">{formatMoneyUzSum(order.grandTotal)}</p>
        </div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-muted-foreground">Delivery address</p>
          <p className="text-sm font-medium text-right">{addressText}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Payment method</p>
          <p className="text-sm font-medium">{getPaymentLabel(order.paymentMethod)}</p>
        </div>
      </div>

      <div className="pt-2">
        <p className="text-sm text-muted-foreground">About: {getOrderDisplayName(order)}</p>
      </div>
    </Card>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="px-4 py-12 max-w-md mx-auto">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="px-4 py-12 max-w-md mx-auto">
          <Card className="p-5 space-y-3">
            <p className="font-medium">Could not load this order</p>
            <Button size="lg" className="w-full justify-center" onClick={() => navigate("/profile")}>
              My orders
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  // Small UX: show a clean top action.
  const title = getOrderDisplayName(order);

  return (
    <Layout>
      <div className="px-4 py-8 max-w-md mx-auto space-y-6">
        <div className="space-y-3">
          <Button size="lg" variant="outline" className="w-full justify-center" onClick={() => navigate("/profile")}>
            My orders
          </Button>
          <div>
            <p className="text-xl font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{getOrderStatusLabel(order.orderStatus)}</p>
          </div>
        </div>

        <StatusTimeline order={order} />
        <OrderItems order={order} />
        <OrderSummary order={order} />
      </div>
    </Layout>
  );
}

