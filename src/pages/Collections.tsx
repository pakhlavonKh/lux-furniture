// collections.tsx / pages
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguageHook";
import { SEO } from "@/components/SEO";
import { getCollections, getProductsByCollection } from "@/data/catalogData";

const CollectionsPage = () => {
  const { t } = useLanguage();
  const collections = getCollections();

  return (
    <>
      <SEO
        title={t("collections.seo.title") || "Collections | Manaku"}
        description={t("collections.seo.description") || "Discover our luxury furniture collections."}
        url="https://lux-furniture-demo.netlify.app/collections"
      />
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
              <h1 className="heading-display mb-6">
                {t("collections.title")}
              </h1>

              <p className="text-body text-lg">
                {t("collections.description")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-20">
          <div className="container-luxury">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {collections.map((collection, index) => {
                const productCount = getProductsByCollection(collection.id).length;
                
                return (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link to={`/collections/${collection.slug}`}>

                      {/* Image */}
                      <div className="relative overflow-hidden aspect-square mb-6">
                        <img
                          src={collection.image}
                          alt={t(collection.nameKey)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>

                      {/* Content */}
                      <div className="space-y-3">

                        <h2 className="heading-md group-hover:opacity-70 transition-opacity">
                          {t(collection.nameKey)}
                        </h2>

                        <p className="text-body text-muted-foreground">
                          {t(collection.descriptionKey)}
                        </p>

                        <div className="flex items-center justify-between pt-4">
                          <span className="text-sm text-muted-foreground">
                            {productCount}{" "}
                            {t("collections.products")}
                          </span>

                          <span className="text-sm font-medium">
                            {t("collections.explore")} →
                          </span>
                        </div>

                      </div>

                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary/30 py-8">
          <div className="container-luxury max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-xl mb-6">
                {t("collections.cta")}
              </h2>

              <p className="text-body text-lg mb-8 text-muted-foreground">
                {t("collections.ctaDesc")}
              </p>

              <Link
                to="/"
                className="btn-luxury group inline-flex items-center"
              >
                {t("collections.viewFullCatalog")}
              </Link>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default CollectionsPage;