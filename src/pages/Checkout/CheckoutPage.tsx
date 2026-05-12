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
        <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-background to-background/50">
          <div className="container-luxury">
            <div className="max-w-md mx-auto">
              <Card className="p-6 space-y-4">
                <p className="font-semibold text-lg">{t("checkout.loginRequired") || "Please log in"}</p>
                <Button size="lg" className="w-full justify-center h-12 text-base font-semibold" onClick={() => navigate("/login")}>
                  {t("checkout.goToLogin") || "Go to login"}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-background to-background/50">
          <div className="container-luxury">
            <div className="max-w-md mx-auto text-center">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-background to-background/50">
          <div className="container-luxury">
            <div className="max-w-md mx-auto">
              <Card className="p-6 space-y-4">
                <p className="font-semibold text-lg">{t("checkout.profileNotLoaded") || "Could not load your profile"}</p>
                <Button size="lg" className="w-full justify-center h-12 text-base font-semibold" onClick={() => navigate("/profile")}>
                  {t("checkout.myProfile") || "My profile"}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-background to-background/50">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2 mb-12">
              <h1 className="heading-section">{t("checkout.title") || "Checkout"}</h1>
              <p className="text-muted-foreground text-lg">
                {t("checkout.description") || "Choose a payment method. We'll prepare your order."}
              </p>
            </div>

            {!canCheckout ? (
              <Card className="p-8 space-y-6 border-rose-200 bg-rose-50/50 dark:bg-rose-950/20">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-semibold text-lg text-foreground">
                      {t("checkout.completeProfile") || "Complete your profile"}
                    </p>
                    <p className="text-muted-foreground">
                      {t("checkout.profileRequired") || "Add phone and delivery address to continue."}
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full justify-center h-12 text-base font-semibold"
                  onClick={() => navigate("/profile", { state: { focus: "address" } })}
                  disabled={isProcessing}
                >
                  {t("checkout.editAddress") || "Edit my address"}
                </Button>
              </Card>
            ) : (
              <>
                {/* Delivery Address Card */}
                <Card className="p-6 space-y-4 border-primary/20 hover:border-primary/40 transition-colors">
                  <p className="font-semibold text-lg">{t("checkout.deliveryAddress") || "Delivery address"}</p>
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                      {user.address}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium block">{t("checkout.commentLabel") || "Comment (optional)"}</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t("checkout.commentPlaceholder") || "Any extra note for delivery (optional)"}
                      className="min-h-[100px] resize-none border-border focus:border-primary"
                      disabled={isProcessing}
                    />
                  </div>
                </Card>

                {/* Payment Method Card */}
                <Card className="p-6 space-y-4 border-primary/20 hover:border-primary/40 transition-colors">
                  <p className="font-semibold text-lg">{t("checkout.paymentMethod") || "Payment method"}</p>
                  <div className="grid grid-cols-1 gap-3">
                    {(["click", "payme", "uzum"] as PaymentMethod[]).map((m) => (
                      <Button
                        key={m}
                        size="lg"
                        className="w-full justify-center h-12 text-base font-semibold rounded-lg transition-all"
                        variant={selectedPayment === m ? "default" : "outline"}
                        onClick={() => startPayment(m)}
                        disabled={isProcessing}
                      >
                        {paymentLabel(m)}
                      </Button>
                    ))}
                  </div>
                </Card>

                {/* Loading State */}
                {isProcessing && (
                  <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                    <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" />
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-400">
                      {t("checkout.preparing") || "Preparing payment..."}
                    </p>
                  </div>
                )}

                {/* Back to Cart Button */}
                <Button
                  size="lg"
                  className="w-full justify-center h-12 text-base font-semibold"
                  variant="outline"
                  onClick={() => navigate("/cart")}
                  disabled={isProcessing}
                >
                  {t("checkout.backToCart") || "Back to cart"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
