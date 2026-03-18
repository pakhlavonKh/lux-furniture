import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Discount as DiscountType } from "@/lib/api";
import { getProducts, getImageUrl, CatalogProduct } from "@/data/catalogData";
import { useLanguage } from "@/contexts/useLanguageHook";
import { InfiniteCarousel, CarouselItem } from "@/components/ui/InfiniteCarousel";

const MOCK_DISCOUNTS: DiscountType[] = [
  {
    _id: "1",
    title: { en: "Office Desk Sale", ru: "Распродажа офисного стола", uz: "Ofis stoli sotuvlari" },
    description: { en: "15% off premium office desks", ru: "15% скидка на премиальные офисные столы", uz: "Premium ofis stolov bo'yicha 15% chegirma" },
    percentage: 15,
    productIds: ["1", "2"],
    isActive: true,
    order: 1,
  },
  {
    _id: "2",
    title: { en: "Cabinet Collection", ru: "Коллекция шкафов", uz: "Kabinet kolleksiyasi" },
    description: { en: "20% off luxury cabinets", ru: "20% скидка на люксосные шкафы", uz: "Luxury shkaflari bo'yicha 20% chegirma" },
    percentage: 20,
    productIds: ["3", "4"],
    isActive: true,
    order: 2,
  },
  {
    _id: "3",
    title: { en: "Lighting Special", ru: "Специальное предложение на освещение", uz: "Yoritish maxsus taklifi" },
    description: { en: "25% off lighting fixtures", ru: "25% скидка на световые приборы", uz: "Yoritgichlar bo'yicha 25% chegirma" },
    percentage: 25,
    productIds: ["5"],
    isActive: true,
    order: 3,
  },
];

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
  const { t } = useLanguage();
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [products, setProducts] = useState<ProductWithDiscount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const discountsData = MOCK_DISCOUNTS;
        const catalogData = getProducts() as CatalogProduct[];

        const productsWithDiscounts = catalogData
          .filter((p) =>
            discountsData.some((d) => d.productIds.includes(p.id))
          )
          .map((product) => {
            const discount = discountsData.find((d) =>
              d.productIds.includes(product.id)
            );

            const price = product.basePrice;

            return {
              id: product.id,
              slug: product.slug,
              name: product.nameKey,
              price,
              image: product.images?.[0]
                ? getImageUrl(product.images[0])
                : "",
              discount,
              discountedPrice: discount
                ? Math.round(price * (1 - (discount.percentage || 0) / 100))
                : price,
            };
          });

        setDiscounts(discountsData);
        setProducts(productsWithDiscounts);
      } catch (error) {
        console.error("Error loading discounts:", error);
        setDiscounts(MOCK_DISCOUNTS);
        const catalogData = getProducts() as CatalogProduct[];
        const fallbackProducts = catalogData
          .filter((p) => MOCK_DISCOUNTS.some((d) => d.productIds.includes(p.id)))
          .map((product) => {
            const discount = MOCK_DISCOUNTS.find((d) => d.productIds.includes(product.id));
            const price = product.basePrice;
            return {
              id: product.id,
              slug: product.slug,
              name: product.nameKey,
              price,
              image: product.images?.[0] ? getImageUrl(product.images[0]) : "",
              discount,
              discountedPrice: discount ? Math.round(price * (1 - (discount.percentage || 0) / 100)) : price,
            };
          });
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="discounts-section">
      <div className="discounts-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="discounts-title">
            {t("discounts.discountedProducts") || "Discounted Products"}
          </h2>

          <InfiniteCarousel
            opts={{ loop: true, align: "start" }}
            showDots
            showArrows
          >
            {products.map((product, index) => (
              <CarouselItem
                key={product.id}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: (index % 4) * 0.08,
                  }}
                  viewport={{ once: true }}
                  className="product-card"
                >
                  {product.image && (
                    <div className="product-image-wrapper">
                      <img
                        src={product.image}
                        alt={t(product.name)}
                        className="product-image"
                      />

                      {product.discount && (
                        <div className="discount-badge">
                          -{product.discount.percentage}%
                        </div>
                      )}
                    </div>
                  )}

                  <div className="product-content">
                    <h4 className="product-title">
                      {t(product.name)}
                    </h4>

                    <div className="product-price">
                      {product.discount ? (
                        <>
                          <span className="price-old">
                            {product.price.toLocaleString()} UZS
                          </span>
                          <span className="price-new">
                            {product.discountedPrice?.toLocaleString()} UZS
                          </span>
                        </>
                      ) : (
                        <span className="price-new">
                          {product.price.toLocaleString()} UZS
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/product/${product.slug}`}
                      className="product-button"
                    >
                      {t("discounts.viewDetails") || "View Details"}
                    </Link>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </InfiniteCarousel>
        </motion.div>
      </div>
    </section>
  );
}