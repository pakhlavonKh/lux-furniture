import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/useLanguageHook";
import { SEO } from "@/components/SEO";

import craftsmanshipImage from "@/assets/craftsmanship.jpg";
import heroImage from "@/assets/hero-living-room.jpg";
import factoryImgage from "@/assets/factory.png";

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      title: t("about.artisanalTitle"),
      description: t("about.artisanalDesc"),
    },
    {
      title: t("about.materialsTitle"),
      description: t("about.materialsDesc"),
    },
    {
      title: t("about.designTitle"),
      description: t("about.designDesc"),
    },
  ];

  return (
    <>
      <SEO
        title={t("about.seo.title") || "About | Manaku"}
        description={
          t("about.seo.description") || "About Manaku luxury furniture."
        }
        url="https://lux-furniture-demo.netlify.app/about"
      />
      <Layout>
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Manaku showroom"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
            />
          </div>

          <div className="container-luxury relative z-10 text-center pt-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-caption text-primary-foreground mb-4">
                {t("about.story")}
              </p>
              <h1 className="heading-display text-primary-foreground mb-6">
                {t("about.title")}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-section mb-8">{t("about.heading")}</h2>

                <div className="space-y-6 text-body">
                  <p>{t("about.paragraph1")}</p>
                  <p>{t("about.paragraph2")}</p>
                  <p>{t("about.paragraph3")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="aspect-[4/5] image-zoom"
              >
                <img
                  src={craftsmanshipImage}
                  alt="Master craftsman at work"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-secondary/30" id="craftsmanship">
          <div className="container-luxury">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-caption mb-4">{t("about.valuesSection")}</p>
                <h2 className="heading-section">{t("about.valuesTitle")}</h2>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-px bg-foreground mx-auto mb-8" />
                  <h3 className="font-serif text-2xl mb-4">{value.title}</h3>
                  <p className="text-body">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing Section */}

        <section className="container-luxury grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="aspect-[4/5] image-zoom"
          >
            <img
              src={factoryImgage}
              alt="Factory interior"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-section mb-8">
              {t("about.manufacturingTitle")}
            </h2>

            <div className="space-y-6 text-body">
              <p>{t("about.manufacturingLine1")}</p>
              <p>{t("about.manufacturingLine2")}</p>
              <p>{t("about.manufacturingLine3")}</p>
              <p>{t("about.manufacturingLine4")}</p>
            </div>
          </motion.div>
        </section>

        {/* Sustainability Section */}
        <section className="section-padding" id="sustainability">
          <div className="container-luxury">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-caption mb-4">
                  {t("about.sustainabilitySection")}
                </p>

                <h2 className="heading-section mb-8">
                  {t("about.sustainabilityTitle")}
                </h2>

                <div className="space-y-6 text-body text-lg">
                  <p>{t("about.sustainabilityText1")}</p>
                  <p>{t("about.sustainabilityText2")}</p>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border"
              >
                <div>
                  <p className="font-serif text-4xl mb-2">100%</p>
                  <p className="text-body">{t("about.statMaterials")}</p>
                </div>

                <div>
                  <p className="font-serif text-4xl mb-2">Zero</p>
                  <p className="text-body">{t("about.statWaste")}</p>
                </div>

                <div>
                  <p className="font-serif text-4xl mb-2">50+</p>
                  <p className="text-body">{t("about.statLifespan")}</p>
                </div>

                <div>
                  <p className="font-serif text-4xl mb-2">Carbon</p>
                  <p className="text-body">{t("about.statCarbon")}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Visit Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-luxury">
            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-caption mb-4 text-primary-foreground/60">
                  {t("about.experienceSection")}
                </p>

                <h2 className="heading-section mb-8">
                  {t("about.experienceTitle")}
                </h2>

                <p className="text-primary-foreground/80 mb-8">
                  {t("about.experienceDesc")}
                </p>

                <a
                  href="/contact"
                  className="btn-outline-luxury border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  {t("about.scheduleVisit")}
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
