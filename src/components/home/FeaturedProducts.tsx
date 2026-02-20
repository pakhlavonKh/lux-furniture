import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";

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
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-caption mb-4">{t("featured.title")}</p>
            <h2 className="heading-section">{t("featured.subtitle")}</h2>
          </div>
          <Link
            to="/"
            className="link-underline text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("featured.viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Link to={`/product/${product.slug}`} className="group block">
                <div className="aspect-[4/5] mb-6 bg-muted">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image w-full h-full object-cover transition-transform duration-700"
                  />
                  <div className="product-overlay absolute inset-0 bg-foreground/5 opacity-0 transition-opacity duration-300" />
                </div>
                <p className="text-caption mb-2 text-muted-foreground !important">{product.category}</p>
                <h3 className="heading-card mb-2 group-hover:text-muted-foreground transition-colors text-foreground !important">
                  {product.title}
                </h3>
                <p className="font-sans text-muted-foreground text-sm">
                  €{product.price.toLocaleString()}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
