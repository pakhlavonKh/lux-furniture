import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
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
    const updated = cart.map(i => i.id === id ? { ...i, quantity: newQuantity } : i);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(i => i.id !== id);
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
          <p className="text-muted-foreground">Loading cart...</p>
        </section>
      </Layout>
    );
  }

  if (cart.length === 0) {
    return (
      <Layout>
        <section className="pt-28 pb-12 min-h-screen flex flex-col items-center justify-center text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-6" />
          <h1 className="heading-section mb-4">Your basket is empty</h1>
          <Link to="/" className="btn-luxury">Continue Shopping</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Cart | Manaku" description="Your shopping cart" url="/cart" />

      <section className="pt-28 pb-12 min-h-screen">
        <div className="container-luxury">
          <h1 className="heading-section mb-10">Shopping Basket</h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
            {/* LEFT: Products */}
            <div className="space-y-4">
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  className="flex gap-4 p-4 border border-border rounded-lg bg-background"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.slug}`}
                    className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-muted"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        €{item.price.toLocaleString()} each
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-medium">
                      €{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RIGHT: Summary */}
            <div className="border border-border rounded-lg p-6 h-fit sticky top-28">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>€{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (12%)</span>
                  <span>€{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>€{total.toLocaleString()}</span>
              </div>

              <button className="w-full btn-luxury mb-4">
                Proceed to Checkout
              </button>

              <Link to="/" className="block text-center text-sm text-muted-foreground hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}