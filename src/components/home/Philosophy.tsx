import { motion } from "framer-motion";

interface PhilosophyProps {
  image: string;
}

export function Philosophy({ image }: PhilosophyProps) {
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
            <p className="text-caption mb-6">Our Philosophy</p>
            <h2 className="heading-section mb-8">
              Where Craftsmanship
              <br />
              <span className="italic">Meets Vision</span>
            </h2>

            <div className="space-y-6 text-body">
              <p>
                At Maison Luxe, we believe that furniture is more than function
                — it's an expression of how we choose to live. Each piece in our
                collection represents a dialogue between traditional
                craftsmanship and contemporary design.
              </p>
              <p>
                We partner with master artisans across Italy and Europe who
                share our uncompromising commitment to quality. From the
                selection of premium materials to the final hand-finishing,
                every step is executed with precision and care.
              </p>
              <p>
                The result is furniture that doesn't just fill a space — it
                transforms it. Pieces that age gracefully, develop character,
                and become cherished elements of your home for generations.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
              <div>
                <p className="font-serif text-3xl md:text-4xl mb-2">25+</p>
                <p className="text-caption">Years of Excellence</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl mb-2">150+</p>
                <p className="text-caption">Master Artisans</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl mb-2">40+</p>
                <p className="text-caption">Countries Served</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
