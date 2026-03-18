import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllDiscounts, Discount as DiscountType } from "@/lib/api";
import { getProducts, getImageUrl, CatalogProduct } from "@/data/catalogData";
import { useLanguage } from "@/contexts/useLanguageHook";
import { InfiniteCarousel, CarouselItem } from "@/components/ui/InfiniteCarousel";

interface ProductWithDiscount {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  discount?: DiscountType;
  discountedPrice?: number;
}

export function Discounts() {
  const { language, t } = useLanguage();
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
            const price = product.basePrice;
            return {
              id: product.id,
              slug: product.slug,
              name: product.nameKey,
              price,
              image: product.images?.[0] ? getImageUrl(product.images[0]) : "",
              discount,
              discountedPrice: discount
                ? price * (1 - (discount.percentage || 0) / 100)
                : price,
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
          <h2 className="heading-section mb-12">{t("discounts.discountedProducts") || "Discounted Products"}</h2>

          {/* Discounted Products Carousel */}
          {products.length > 0 && (
            <InfiniteCarousel
              opts={{ loop: true, align: "start" }}
              showDots={true}
              showArrows={true}
              itemsPerRow={4}
              className="px-0"
            >
              {products.map((product, index) => (
                <CarouselItem
                  key={product.id}
                  flex="0 0 calc(25% - 1.5rem)"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: (index % 4) * 0.1,
                    }}
                    viewport={{ once: true }}
                    className="group bg-card border border-border hover:border-foreground transition-colors h-full flex flex-col"
                  >
                    {product.image && (
                      <div className="relative w-full aspect-square overflow-hidden bg-secondary">
                        <img
                          src={product.image}
                          alt={t(product.name)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.discount && (
                          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs font-semibold">
                            -{product.discount.percentage}%
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">
                        {t(product.name)}
                      </h4>

                      <div className="flex items-center gap-2 mb-3 flex-grow">
                        {product.discount && (
                          <>
                            <span className="text-muted-foreground text-sm line-through">
                              {product.price.toLocaleString()} UZS
                            </span>
                            <span className="text-primary font-semibold">
                              {product.discountedPrice?.toLocaleString()} UZS
                            </span>
                          </>
                        )}
                        {!product.discount && (
                          <span className="font-semibold">
                            {product.price.toLocaleString()} UZS
                          </span>
                        )}
                      </div>

                      <Link to={`/product/${product.slug}`} className="block w-full btn-outline-luxury text-xs py-2 text-center mt-auto">
                        {t("discounts.viewDetails") || "View Details"}
                      </Link>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </InfiniteCarousel>
          )}
        </motion.div>
      </div>
    </section>
  );
}