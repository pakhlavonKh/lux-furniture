import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguageHook";
import armchairImage from "@/assets/product-armchair.jpg";
import diningTableImage from "@/assets/product-dining-table.jpg";
import lampImage from "@/assets/product-lamp.jpg";

const collections = [
  {
    id: "1",
    name: "Living Collection",
    slug: "living-collection",
    description: "Sculptural sofas and refined seating for modern living spaces",
    image: armchairImage,
    productCount: 12,
  },
  {
    id: "2",
    name: "Bedroom Collection",
    slug: "bedroom-collection",
    description: "Serene pieces designed for rest and rejuvenation",
    image: lampImage,
    productCount: 8,
  },
  {
    id: "3",
    name: "Dining Collection",
    slug: "dining-collection",
    description: "Elegant tables and chairs for sophisticated entertaining",
    image: diningTableImage,
    productCount: 10,
  },
  {
    id: "4",
    name: "Lighting Collection",
    slug: "lighting-collection",
    description: "Ambient and sculptural lighting to enhance any space",
    image: lampImage,
    productCount: 6,
  },
  {
    id: "5",
    name: "Contemporary",
    slug: "contemporary",
    description: "Modern design with clean lines and innovative materials",
    image: armchairImage,
    productCount: 15,
  },
  {
    id: "6",
    name: "Classic",
    slug: "classic",
    description: "Timeless elegance with traditional craftsmanship",
    image: diningTableImage,
    productCount: 11,
  },
];

const Collections = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-caption mb-4">{t("collections.subtitle")}</p>
            <h1 className="heading-display mb-6">{t("collections.title")}</h1>
            <p className="text-body text-lg">
              {t("collections.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/catalog?collection=${collection.slug}`}>
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-square mb-6">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h2 className="heading-md group-hover:opacity-70 transition-opacity">
                      {collection.name}
                    </h2>
                    <p className="text-body text-muted-foreground">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-sm text-muted-foreground">
                        {collection.productCount} {t("collections.products")}
                      </span>
                      <span className="text-sm font-medium">Explore →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-secondary/30">
        <div className="container-luxury max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-xl mb-6">{t("collections.cta")}</h2>
            <p className="text-body text-lg mb-8 text-muted-foreground">
              {t("collections.ctaDesc")}
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-foreground text-background hover:bg-foreground/90 transition-colors uppercase text-sm tracking-wider font-medium"
            >
              {t("collections.viewFullCatalog")}
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
