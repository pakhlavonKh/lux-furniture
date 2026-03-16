import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllDiscounts, Discount as DiscountType } from "@/lib/api";
import { getProducts, CatalogProduct } from "@/data/catalogData";

interface ProductWithDiscount {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: DiscountType;
  discountedPrice?: number;
}

export function Discounts() {
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [products, setProducts] = useState<ProductWithDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const discountsData = await getAllDiscounts(true);
        const catalogData = getProducts() as CatalogProduct[];

        // Apply discounts to products
        const productsWithDiscounts = catalogData
          .filter((p: CatalogProduct) => {
            const disc = discountsData.find((d) =>
              d.productIds.includes(p.id)
            );
            return !!disc;
          })
          .map((product: CatalogProduct) => {
            const discount = discountsData.find((d: DiscountType) =>
              d.productIds.includes(product.id)
            );
            return {
              id: product.id,
              name: product.nameKey,
              price: product.variants?.[0]?.price || 0,
              image: product.images?.[0] || "",
              discount,
              discountedPrice: discount
                ? (product.variants?.[0]?.price || 0) *
                  (1 - (discount.percentage || 0) / 100)
                : product.variants?.[0]?.price || 0,
            };
          });

        setDiscounts(discountsData);
        setProducts(productsWithDiscounts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setDiscounts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-section bg-background">
        <div className="container-luxury text-center">
          <div className="inline-block w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (error || (discounts.length === 0 && products.length === 0)) {
    return null;
  }

  return (
    <section className="py-section bg-secondary/30">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-section mb-6">Special Offers</h2>

          {discounts.length > 0 && (
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {discounts.slice(0, 2).map((discount, index) => (
                <motion.div
                  key={discount._id || discount.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border p-8 relative overflow-hidden"
                >
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full" />
                  <div className="relative z-10">
                    <div className="inline-block bg-primary text-primary-foreground px-4 py-2 text-caption font-semibold mb-4">
                      {discount.percentage}% OFF
                    </div>
                    <h3 className="heading-card mb-3">{discount.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {discount.description}
                    </p>
                    {discount.code && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm">Code:</span>
                        <code className="bg-background px-3 py-1 font-mono text-sm border border-border">
                          {discount.code}
                        </code>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div>
              <h3 className="heading-card mb-6">Discounted Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: (index % 4) * 0.1,
                    }}
                    viewport={{ once: true }}
                    className="group bg-card border border-border hover:border-foreground transition-colors"
                  >
                    {product.image && (
                      <div className="relative w-full aspect-square overflow-hidden bg-secondary">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.discount && (
                          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs font-semibold">
                            -{product.discount.percentage}%
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4">
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">
                        {product.name}
                      </h4>

                      <div className="flex items-center gap-2 mb-3">
                        {product.discount && (
                          <>
                            <span className="text-muted-foreground text-sm line-through">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-primary font-semibold">
                              ${product.discountedPrice?.toFixed(2)}
                            </span>
                          </>
                        )}
                        {!product.discount && (
                          <span className="font-semibold">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button className="w-full btn-outline-luxury text-xs py-2">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}