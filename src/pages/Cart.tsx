import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";

export default function Cart() {
  const { t } = useLanguage();

  return (
    <Layout>
      <SEO
        title="Shopping Cart | Manaku"
        description="Review and manage your luxury furniture selections in your shopping cart."
        url="https://lux-furniture-demo.netlify.app/cart"
      />

      <section className="pt-28 pb-12 bg-background min-h-screen">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading-section mb-12">Shopping Basket</h1>

            {/* Empty Cart State */}
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-serif mb-4">Your basket is empty</h2>
              <p className="text-muted-foreground mb-8">
                Start exploring our luxury collection to add items to your cart.
              </p>
              <a
                href="/"
                className="btn-luxury"
              >
                Continue Shopping
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
