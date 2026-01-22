import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
}

export function ProductCard({
  title,
  slug,
  price,
  image,
  category,
  isNew,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Link to={`/product/${slug}`} className="group block">
        <div className="product-card aspect-[3/4] mb-5 bg-muted relative">
          <img
            src={image}
            alt={title}
            className="product-image w-full h-full object-cover transition-transform duration-700"
          />
          <div className="product-overlay absolute inset-0 bg-foreground/5 opacity-0 transition-opacity duration-300" />

          {isNew && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-foreground text-background text-xs uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {category && <p className="text-caption mb-2">{category}</p>}

        <h3 className="font-serif text-lg md:text-xl mb-2 group-hover:text-muted-foreground transition-colors">
          {title}
        </h3>

        <p className="font-sans text-muted-foreground">
          €{price.toLocaleString()}
        </p>
      </Link>
    </motion.div>
  );
}
