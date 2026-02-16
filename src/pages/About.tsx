import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/useLanguageHook";

// Import images
import craftsmanshipImage from "@/assets/craftsmanship.jpg";
import heroImage from "@/assets/hero-living-room.jpg";

const About = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Manaku showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>

        <div className="container-luxury relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-caption text-primary-foreground/80 mb-4">{t("about.story")}</p>
            <h1 className="heading-display text-primary-foreground mb-6">
              {t("about.title")}
              <br />
              <span className="italic">{t("about.heading")}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-section mb-8">
                {t("about.heading")}
              </h2>
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
              <p className="text-caption mb-4">Our Values</p>
              <h2 className="heading-section">
                The Pillars of Our Craft
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Artisanal Excellence",
                description:
                  "Every piece is crafted by skilled artisans who have dedicated their lives to mastering traditional techniques. We believe that true luxury lies in the human touch—the subtle imperfections that make each piece unique.",
              },
              {
                title: "Material Integrity",
                description:
                  "We source only the finest materials from responsible suppliers. From sustainably harvested hardwoods to ethically produced leathers and fabrics, every component is selected for its quality and provenance.",
              },
              {
                title: "Timeless Design",
                description:
                  "Our designs transcend trends. We create furniture that will be just as relevant and beautiful in fifty years as it is today. This commitment to timelessness is both an aesthetic and environmental choice.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
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
              <p className="text-caption mb-4">Sustainability</p>
              <h2 className="heading-section mb-8">
                Crafting a Better Future
              </h2>
              <div className="space-y-6 text-body text-lg">
                <p>
                  We believe that true luxury must be sustainable. Our commitment to
                  the environment is woven into every aspect of our operations—from
                  sourcing certified sustainable woods to minimizing waste in our
                  workshops.
                </p>
                <p>
                  By creating furniture designed to last generations, we offer an
                  alternative to the disposable culture of fast furniture. Each piece
                  we make is an investment in quality that reduces the need for
                  replacement and the associated environmental impact.
                </p>
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
                <p className="text-caption">Sustainable Materials</p>
              </div>
              <div>
                <p className="font-serif text-4xl mb-2">Zero</p>
                <p className="text-caption">Landfill Waste</p>
              </div>
              <div>
                <p className="font-serif text-4xl mb-2">50+</p>
                <p className="text-caption">Year Average Lifespan</p>
              </div>
              <div>
                <p className="font-serif text-4xl mb-2">Carbon</p>
                <p className="text-caption">Neutral by 2025</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-luxury">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-caption mb-4 text-primary-foreground/60">Visit Us</p>
              <h2 className="heading-section mb-8">Experience Manaku</h2>
              <p className="text-primary-foreground/80 mb-8">
                We invite you to visit our flagship showroom in Milan, where you can
                experience our collection firsthand and receive personalized guidance
                from our design consultants.
              </p>
              <a href="/contact" className="btn-outline-luxury border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Schedule a Visit
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
