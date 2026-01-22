import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus, Check, Truck, Shield, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Import product images
import armchairImage from "@/assets/product-armchair.jpg";
import diningTableImage from "@/assets/product-dining-table.jpg";
import lampImage from "@/assets/product-lamp.jpg";

// Sample product data
interface ProductData {
  id: string;
  title: string;
  price: number;
  description: string;
  materials: string;
  category: string;
  dimensions: string;
  images: string[];
  stock_status: "in_stock" | "out_of_stock";
  features: string[];
}

const products: Record<string, ProductData> = {
  "aria-lounge-chair": {
    id: "1",
    title: "Aria Lounge Chair",
    price: 3450,
    description: "The Aria Lounge Chair embodies the essence of modern Italian design. Its sculptural silhouette, crafted with meticulous attention to proportion and comfort, creates an inviting presence in any living space. The generous seat and enveloping backrest offer exceptional comfort while maintaining an elegant, refined aesthetic.",
    materials: "Premium bouclé fabric upholstery, solid oak wood frame, high-resilience foam cushioning",
    dimensions: "W 78cm × D 82cm × H 75cm, Seat Height: 42cm",
    images: [armchairImage, armchairImage, armchairImage],
    category: "Seating",
    stock_status: "in_stock",
    features: [
      "Hand-crafted in Italy",
      "Kiln-dried hardwood frame",
      "High-density foam core",
      "Removable cushion covers",
    ],
  },
  "tavola-dining-table": {
    id: "2",
    title: "Tavola Dining Table",
    price: 8900,
    description: "The Tavola Dining Table is a masterpiece of natural beauty and contemporary design. Featuring a live-edge walnut top that celebrates the organic character of the wood, this table becomes the heart of any dining room. The sculptural base provides both visual interest and structural integrity.",
    materials: "Solid American black walnut with natural live edge, hand-finished with natural oil",
    dimensions: "L 240cm × W 100cm × H 76cm",
    images: [diningTableImage, diningTableImage, diningTableImage],
    category: "Dining",
    stock_status: "in_stock",
    features: [
      "Sustainably sourced walnut",
      "Each piece is unique",
      "Natural oil finish",
      "Seats 8-10 guests",
    ],
  },
  "luce-floor-lamp": {
    id: "3",
    title: "Luce Floor Lamp",
    price: 1850,
    description: "The Luce Floor Lamp combines sculptural form with functional elegance. The graceful arc of brushed brass supports a natural linen shade that diffuses warm, ambient light. A statement piece that elevates any interior with its refined presence.",
    materials: "Brushed brass frame, natural linen shade, marble base",
    dimensions: "Base: 25cm × 25cm, Height: 180cm, Shade Diameter: 40cm",
    images: [lampImage, lampImage, lampImage],
    category: "Lighting",
    stock_status: "in_stock",
    features: [
      "Dimmable LED compatible",
      "Hand-finished brass",
      "Weighted marble base",
      "3-year warranty",
    ],
  },
};

const Product = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = slug ? products[slug] : null;

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="heading-section mb-4">Product Not Found</h1>
            <Link to="/catalog" className="btn-outline-luxury">
              Back to Catalog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <Layout>
      <section className="pt-28 pb-20">
        <div className="container-luxury">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/catalog" className="hover:text-foreground transition-colors">
                  Catalog
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{product.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-[4/5] bg-muted mb-4 overflow-hidden group">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-20 h-20 bg-muted overflow-hidden transition-opacity",
                        currentImageIndex === index ? "opacity-100 ring-2 ring-foreground" : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-caption mb-4">{product.category}</p>
              <h1 className="heading-section mb-4">{product.title}</h1>
              <p className="font-serif text-3xl mb-8">€{product.price.toLocaleString()}</p>

              <div className="prose prose-stone max-w-none mb-8">
                <p className="text-body">{product.description}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-caption mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-stone" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button className="btn-luxury flex-1">
                  Inquire Now
                </button>
              </div>

              {/* Stock Status */}
              <p className="text-sm text-muted-foreground mb-8">
                {product.stock_status === "in_stock" && (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    In Stock — Ready to Ship
                  </span>
                )}
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-stone mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">White Glove Delivery</p>
                    <p className="text-xs text-muted-foreground">Complimentary installation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-stone mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">5-Year Warranty</p>
                    <p className="text-xs text-muted-foreground">Comprehensive coverage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-stone mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">30-Day Returns</p>
                    <p className="text-xs text-muted-foreground">Hassle-free process</p>
                  </div>
                </div>
              </div>

              {/* Details Accordion */}
              <div className="mt-12 space-y-4">
                <details className="group border-t border-border pt-4">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-medium uppercase tracking-wider">
                    Materials
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-body">{product.materials}</p>
                </details>

                <details className="group border-t border-border pt-4">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-medium uppercase tracking-wider">
                    Dimensions
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-body">{product.dimensions}</p>
                </details>

                <details className="group border-t border-border pt-4">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-medium uppercase tracking-wider">
                    Shipping & Delivery
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-body">
                    Delivery times vary by location. Most items ship within 4-8 weeks.
                    White glove delivery service includes in-room placement and packaging removal.
                    Please contact us for international shipping inquiries.
                  </p>
                </details>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Product;
