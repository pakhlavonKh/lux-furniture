import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";

interface HeroProps {
  heroImage: string;
}

export function Hero({ heroImage }: HeroProps) {
  const { t } = useLanguage();
  return (
    <section className="relative h-screen min-h-[700px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Luxury living room interior"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
        />
      </div>

      {/* Content */}
      <div className="container-luxury relative z-10 w-full max-w-full overflow-hidden flex justify-center">
        <div className="w-full flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-4 text-center text-[clamp(3rem,8vw,10rem)] leading-[0.95] font-normal text-primary-foreground"
          >
            {t("hero.artOfLiving")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg mb-10 w-full text-center text-primary-foreground"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/" className="btn-luxury group">
              {t("hero.exploreCollection")}
              <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link to="/about" className="btn-outline-luxury">
              {t("hero.ourStory")}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
