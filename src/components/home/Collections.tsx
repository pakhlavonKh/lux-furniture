// collections.tsx / home
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import { CatalogCollection } from "@/data/catalogData";

interface CollectionsProps {
  collections: CatalogCollection[];
}

export function Collections({ collections }: CollectionsProps) {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-caption mb-4 text-primary-foreground/60">
            {t("collections.explore")}
          </p>

          <h2 className="heading-section mb-6">
            {t("collections.title")}
          </h2>

          <p className="text-primary-foreground/70">
            {t("collections.description")}
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/collections/${collection.slug}`}
                className="group block relative aspect-[16/10] overflow-hidden"
              >
                <img
                  src={collection.image}
                  alt={t(collection.nameKey)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">
                        {t(collection.nameKey)}
                      </h3>

                      <p className="text-white/70 text-sm max-w-xs">
                        {t(collection.descriptionKey)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
