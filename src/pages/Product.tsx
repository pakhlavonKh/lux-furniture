// Product.tsx - Product detail page with image gallery, quantity selector, and add to basket functionality.
import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/useLanguageHook";
import { toast } from "sonner";
import { getApiProductBySlug, getDiscountForProduct, type ProductData } from "@/lib/api";
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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getDiscountedPrice(basePrice: number, discount?: number): number {
  if (!discount || discount <= 0) return basePrice;
  return Math.round(basePrice * (1 - discount / 100));
}

const Product = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState<number | undefined>();

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    getApiProductBySlug(slug)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  const productId = product?._id;

  useEffect(() => {
    if (!productId) return;
    getDiscountForProduct(productId)
      .then((d) => {
        if (d && d.percentage > 0) setDiscountPercentage(d.percentage);
      })
      .catch(() => {});
  }, [productId]);

  const images = useMemo(() => product?.images?.map(img => img.url) || [], [product?.images]);
  const productName = product?.name?.[language] || product?.name?.en || product?.slug || "";
  const displayPrice = product?.basePrice;
  const finalPrice = displayPrice ? getDiscountedPrice(displayPrice, discountPercentage) : undefined;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const displayImageUrl = images[currentImageIndex] || images[0] || "";

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
              <li className="text-foreground">{productName}</li>
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
                  src={displayImageUrl}
                  alt={productName}
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
                  {images.map((imageUrl, index) => (
                    <button
                      key={`${imageUrl}-${index}`}
                      onClick={() => {
                        setCurrentImageIndex(index);
                      }}
                      className={cn("thumbnail", currentImageIndex === index && "active")}
                    >
                      <img
                        src={imageUrl}
                        alt={`${productName} view ${index + 1}`}
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
              <h1 className="heading-section mb-4">{productName}</h1>
              <div className="mb-8">
                {discountPercentage && displayPrice ? (
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-3xl">{finalPrice?.toLocaleString()} UZS</span>
                    <span className="font-serif text-xl text-muted-foreground line-through">{displayPrice.toLocaleString()} UZS</span>
                    <span className="text-sm font-bold text-green-600 bg-green-500/20 px-2 py-1 rounded">-{discountPercentage}%</span>
                  </div>
                ) : (
                  <p className="font-serif text-3xl">{displayPrice?.toLocaleString()} UZS</p>
                )}
              </div>

              {product.description && (product.description[language] || product.description.en) && (
                <div className="prose prose-stone max-w-none mb-8">
                  <p className="text-body">{product.description[language] || product.description.en}</p>
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
                      
                      const cartKey = product._id || product.slug;
                      const existingItem = cart.find((item) => item.id === cartKey);
                      const itemPrice = product.basePrice; // Store base price, discount will be applied in cart
                      // Capture image from product - try multiple sources
                      const itemImage = images && images.length > 0 ? images[0] : (product.image || "");
                      
                      if (existingItem) {
                        existingItem.quantity += quantity;
                      } else {
                        cart.push({
                          id: cartKey,
                          slug: product.slug,
                          name: productName,
                          price: itemPrice,
                          image: itemImage,
                          quantity,
                        });
                      }
                      localStorage.setItem("cart", JSON.stringify(cart));
                      window.dispatchEvent(new Event("cartUpdated"));
                      toast.success(
                        `Added ${quantity}x ${productName} to basket`,
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
