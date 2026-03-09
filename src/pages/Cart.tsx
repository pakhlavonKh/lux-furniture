import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/data/catalogData";

interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

export default function Cart() {
  const { t } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const cartJson = localStorage.getItem("cart") || "[]";
      setCart(JSON.parse(cartJson));
    } catch {
      setCart([]);
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return removeItem(id);
    const updated = cart.map((i) =>
      i.id === id ? { ...i, quantity: newQuantity } : i,
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <Layout>
        <section className="pt-28 pb-12 min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">{t("cart.loading") || "Loading cart..."}</p>
        </section>
      </Layout>
    );
  }

  if (cart.length === 0) {
    return (
      <Layout>
        <section className="pt-28 pb-12 min-h-screen flex flex-col items-center justify-center text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-6" />
          <h1 className="heading-section mb-4">{t("cart.empty") || "Your basket is empty"}</h1>
          <Link to="/" className="btn-luxury">
            {t("cart.continueShopping") || "Continue Shopping"}
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <>
      <SEO
        title={t("cart.seo.title") || "Cart | Manaku"}
        description={
          t("cart.seo.description") || "Your shopping cart."
        }
        url="https://lux-furniture-demo.netlify.app/cart"
      />
      <Layout>
        <section className="pt-28 pb-12 min-h-screen">
          <div className="container-luxury">
            <h1 className="heading-section mb-10">{t("account.basket")}</h1>

            <div className="flex flex-col md:flex-row md:items-start gap-8 lg:gap-10">
              {/* LEFT: Products */}
              <div className="space-y-4 md:min-w-0" style={{ flex: 3 }}>
                {cart.map((item) => (
                  <motion.div key={item.id} layout className="cart-item">
                    {/* Thumbnail */}
                    <Link to={`/product/${item.slug}`} className="cart-thumb">
                      <img src={getImageUrl(item.image)} alt={item.name} />
                    </Link>

                    {/* Info */}
                    <div className="cart-info">
                      <div>
                        <Link
                          to={`/product/${item.slug}`}
                          className="cart-title"
                        >
                          {item.name}
                        </Link>
                        {(item.color || item.size) && (
                          <p className="text-sm text-muted-foreground">
                            {[item.color, item.size].filter(Boolean).join(" • ")}
                          </p>
                        )}
                        <p className="cart-price-each">
                          €{item.price.toLocaleString()}
                          {(item.color || item.size) && ` ${t("cart.each") || "each"}`}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="cart-qty">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="icon-btn"
                        >
                          <Minus className="icon" />
                        </button>

                        <span className="cart-qty-value">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="icon-btn"
                        >
                          <Plus className="icon" />
                        </button>
                      </div>
                    </div>

                    {/* Price + Remove */}
                    <div className="cart-side">
                      <p className="cart-total">
                        €{(item.price * item.quantity).toLocaleString()}
                      </p>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="remove-btn"
                      >
                        <Trash2 className="icon icon-remove" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* RIGHT: Summary */}
              <div className="order-summary">
                <h2 className="order-summary-title">{t("cart.orderSummary") || "Order Summary"}</h2>

                <div className="order-summary-details">
                  <div className="order-summary-row">
                    <span className="order-summary-label">{t("cart.subtotal") || "Subtotal"}</span>
                    <span>€{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="order-summary-row">
                    <span className="order-summary-label">{t("cart.tax") || "Tax (12%)"}</span>
                    <span>€{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="order-summary-total">
                  <span>{t("cart.total") || "Total"}</span>
                  <span>€{total.toLocaleString()}</span>
                </div>

                <button className="checkout-btn btn-luxury">
                  {t("cart.checkout") || "Proceed to Checkout"}
                </button>

                <Link to="/" className="continue-shopping">
                  {t("cart.continueShopping") || "Continue Shopping"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
