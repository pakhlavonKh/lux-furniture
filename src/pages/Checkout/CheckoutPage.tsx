import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/useLanguageHook";
import { AlertCircle } from "lucide-react";

type PaymentMethod = "payme" | "click" | "uzum";

interface MeUser {
  name: string;
  phone?: string;
  address?: string;
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

function buildDeliveryAddress({
  fullName,
  phone,
  userAddress,
  comment,
}: {
  fullName: string;
  phone?: string;
  userAddress?: string;
  comment?: string;
}) {
  const parsed = parseAddress(userAddress);
  const city = parsed.city || "Toshkent";
  const base = [parsed.district, parsed.streetHouseApartment].filter(Boolean).join(", ");
  const address = comment?.trim() ? `${base}${base ? ", " : ""}${comment.trim()}` : base;

  return {
    fullName,
    phone: phone || "",
    city,
    address: address || userAddress || "",
  };
}

function paymentLabel(method: PaymentMethod) {
  if (method === "payme") return "Payme";
  if (method === "click") return "Click";
  return "Uzum";
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const token = localStorage.getItem("authToken");

  const { data: userData, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<{ success: boolean; user: MeUser }>("/api/users/me"),
    enabled: !!token,
    retry: false,
  });

  const user = userData?.user;

  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  const canCheckout = !!user?.phone && !!user?.address;

  const deliveryAddress = useMemo(() => {
    if (!user) {
      return null;
    }
    return buildDeliveryAddress({
      fullName: user.name || "Customer",
      phone: user.phone,
      userAddress: user.address,
      comment,
    });
  }, [comment, user]);

  const startPayment = async (method: PaymentMethod) => {
    if (!user) return;
    if (!deliveryAddress) return;

    setSelectedPayment(method);
    setIsProcessing(true);
    try {
      // 1) Create order (backend calculates totals, reserves stock)
      const checkoutRes = await apiFetch<{
        success: boolean;
        order: { _id?: string; orderNumber?: string; grandTotal?: number };
        payment?: unknown;
      }>("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          paymentMethod: method,
          deliveryAddress,
        }),
      });

      const order = checkoutRes.order;
      const orderIdForPayment = order?.orderNumber || order?._id;
      const amount = order?.grandTotal;

      if (!orderIdForPayment || !amount) {
        throw new Error("Order is missing payment information.");
      }

      // 2) Create payment with provider and redirect user to payment page.
      const returnUrl = `${window.location.origin}/profile/orders/${order?._id || ""}`.replace(/\/$/, "");

      const paymentRes = await apiFetch<{ success: boolean; data: { payment_url?: string; paymentUrl?: string } }>(
        "/api/payments/create",
        {
          method: "POST",
          body: JSON.stringify({
            amount,
            order_id: orderIdForPayment,
            method,
            return_url: returnUrl,
            phone: user.phone || "",
            description: "Furniture purchase",
          }),
        },
      );

      const paymentUrl = paymentRes?.data?.payment_url || paymentRes?.data?.paymentUrl;
      if (!paymentUrl) {
        toast({
          title: "Payment link not ready",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
        return;
      }

      window.location.href = paymentUrl;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Please try again.";
      toast({
        title: "Checkout failed",
        description: message,
        variant: "destructive",
      });
      setSelectedPayment(null);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!token) {
    return (
      <Layout>
        <div className="px-4 py-12 max-w-md mx-auto">
          <Card className="p-5 space-y-3">
            <p className="font-medium">Please log in</p>
            <Button size="lg" className="w-full justify-center" onClick={() => navigate("/login")}>
              Go to login
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="px-4 py-12 max-w-md mx-auto">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="px-4 py-12 max-w-md mx-auto">
          <Card className="p-5 space-y-3">
            <p className="font-medium">Could not load your profile</p>
            <Button size="lg" className="w-full justify-center" onClick={() => navigate("/profile")}>
              My profile
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-8 max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="text-sm text-muted-foreground">Choose a payment method. We’ll prepare your order.</p>
        </div>

        {!canCheckout ? (
          <Card className="p-5 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Complete your profile</p>
                <p className="text-sm text-muted-foreground">
                  Add phone and delivery address to continue.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full justify-center"
              onClick={() => navigate("/profile", { state: { focus: "address" } })}
              disabled={isProcessing}
            >
              Edit my address
            </Button>
          </Card>
        ) : (
          <>
            <Card className="p-5 space-y-4">
              <p className="font-semibold">Delivery address</p>
              <p className="text-sm text-muted-foreground">
                {user.address}
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Comment (optional)</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Any extra note for delivery (optional)"
                  className="min-h-[90px]"
                  disabled={isProcessing}
                />
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <p className="font-semibold">Payment method</p>
              <div className="grid grid-cols-1 gap-2">
                {(["click", "payme", "uzum"] as PaymentMethod[]).map((m) => (
                  <Button
                    key={m}
                    size="lg"
                    className="w-full justify-center"
                    variant={selectedPayment === m ? "default" : "outline"}
                    onClick={() => startPayment(m)}
                    disabled={isProcessing}
                  >
                    {paymentLabel(m)}
                  </Button>
                ))}
              </div>
            </Card>

            {isProcessing && (
              <div className="text-center text-sm text-muted-foreground">
                Preparing payment...
              </div>
            )}

            <Button
              size="lg"
              className="w-full justify-center"
              variant="outline"
              onClick={() => navigate("/cart")}
              disabled={isProcessing}
            >
              Back to cart
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}

