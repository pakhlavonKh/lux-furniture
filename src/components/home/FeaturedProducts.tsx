import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import "./FeaturedProducts.css";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  category: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="featured-products">
      <div className="container-luxury">
        {/* Header */}
        <div className="featured-products__header">
          <div>
            <p className="featured-products__label">
              {t("featured.title")}
            </p>
            <h2 className="featured-products__title">
              {t("featured.subtitle")}
            </h2>
          </div>

          <Link to="/" className="featured-products__view-all">
            {t("featured.viewAll")}
            <ArrowRight />
          </Link>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="featured-products__grid"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Link
                to={`/product/${product.slug}`}
                className="featured-products__link"
              >
                {/* Image Card */}
                <div className="featured-products__card">
                  <div className="featured-products__image-wrap">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="featured-products__image"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="featured-products__overlay" />

                  {/* Gradient effect */}
                  <div className="featured-products__gradient" />
                </div>

                {/* Text */}
                <div className="featured-products__info">
                  <p className="featured-products__category">
                    {product.category}
                  </p>

                  <h3 className="featured-products__name">
                    {product.title}
                  </h3>

                  <p className="featured-products__price">
                    {product.price.toLocaleString()} UZS
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}