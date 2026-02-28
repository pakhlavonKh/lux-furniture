// Product.tsx - Product detail page with image gallery, quantity selector, and add to basket functionality.
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/useLanguageHook";
import { toast } from "sonner";
import { getProductBySlug, getImageUrl } from "@/data/catalogData";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Product = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = slug ? getProductBySlug(slug) : null;

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="heading-section mb-4">Product Not Found</h1>
            <Link to="/" className="btn-outline-luxury">
              Back to Catalog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const images = product.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Layout>
      <section className="pt-28 pb-20">
        <div className="container-luxury">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t("breadcrumb.home")}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t("breadcrumb.catalog")}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{t(product.nameKey)}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="gallery-wrapper">
                <img
                  src={getImageUrl(images[currentImageIndex])}
                  alt={t(product.nameKey)}
                  className="gallery-image"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="gallery-nav gallery-nav-left"
                    >
                      <ChevronLeft className="gallery-icon" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="gallery-nav gallery-nav-right"
                    >
                      <ChevronRight className="gallery-icon" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="thumbnail-container">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "thumbnail",
                        currentImageIndex === index
                          ? "opacity-100 ring-2 ring-foreground"
                          : "opacity-60 hover:opacity-100",
                      )}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${t(product.nameKey)} view ${index + 1}`}
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
              <p className="text-caption mb-4">{product.categoryId}</p>
              <h1 className="heading-section mb-4">{t(product.nameKey)}</h1>
              <p className="font-serif text-3xl mb-8">
                €{product.basePrice.toLocaleString()}
              </p>

              {product.descriptionKey && (
                <div className="prose prose-stone max-w-none mb-8">
                  <p className="text-body">{t(product.descriptionKey)}</p>
                </div>
              )}

              {/* Quantity */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="qty-wrapper">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="qty-icon" />
                  </button>

                  <span className="qty-value">{quantity}</span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="qty-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus className="qty-icon" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    try {
                      const cart = JSON.parse(
                        localStorage.getItem("cart") || "[]",
                      ) as Array<{
                        id: string;
                        slug: string;
                        name: string;
                        price: number;
                        image: string;
                        quantity: number;
                      }>;
                      const existingItem = cart.find(
                        (item) => item.id === product.id,
                      );
                      if (existingItem) {
                        existingItem.quantity += quantity;
                      } else {
                        cart.push({
                          id: product.id,
                          slug: product.slug,
                          name: t(product.nameKey),
                          price: product.basePrice,
                          image: product.images[0],
                          quantity,
                        });
                      }
                      localStorage.setItem("cart", JSON.stringify(cart));
                      // Dispatch custom event to update header cart count
                      window.dispatchEvent(new Event("cartUpdated"));
                      toast.success(
                        `Added ${quantity}x ${t(product.nameKey)} to basket`,
                      );
                      setQuantity(1);
                    } catch (error) {
                      toast.error("Failed to add item to basket");
                    }
                  }}
                  className="btn-luxury flex-1 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Basket
                </button>
              </div>

              {/* Benefits */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">White Glove Delivery</p>
                    <p className="text-xs text-muted-foreground">
                      Complimentary installation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">5-Year Warranty</p>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive coverage
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">30-Day Returns</p>
                    <p className="text-xs text-muted-foreground">
                      Hassle-free process
                    </p>
                  </div>
                </div>
              </div> */}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Product;
