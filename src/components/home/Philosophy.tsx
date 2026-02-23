import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/useLanguageHook";

interface PhilosophyProps {
  image: string;
}

export function Philosophy({ image }: PhilosophyProps) {
  const { t } = useLanguage();
  return (
    <section className="section-padding">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] image-zoom"
          >
            <img
              src={image}
              alt="Artisan craftsmanship"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:pl-8"
          >
            <p className="text-caption mb-6">{t("philosophy.section")}</p>
            <h2 className="heading-section mb-8">
              {t("philosophy.title")}
              <br />
              <span className="italic">{t("philosophy.section")}</span>
            </h2>

            <div className="space-y-6 text-body">
              <p>{t("philosophy.description")}</p>
              <p>{t("philosophy.description2")}</p>
              <p>{t("philosophy.description3")}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
              <div>
                <p className="font-serif text-3xl md:text-4xl mb-2">25+</p>
                <p className="text-body">{t("philosophy.yearsOfExcellence")}</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl mb-2">150+</p>
                <p className="text-body">{t("philosophy.masterArtisans")}</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl mb-2">40+</p>
                <p className="text-body">{t("philosophy.countriesServed")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
