// Product.tsx - Product detail page with image gallery, quantity selector, and add to basket functionality.
import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/useLanguageHook";
import { toast } from "sonner";
import { getProductBySlug, getImageUrl, ProductVariant } from "@/data/catalogData";
import { ProductVariantSelector } from "@/components/ProductVariantSelector";
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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const product = slug ? getProductBySlug(slug) : null;

  const images = useMemo(() => product?.images || [], [product?.images]);
  
  // Get base color: use product.color if available, otherwise use first variant's color
  const baseColor = product?.color || product?.variants?.[0]?.color;
  const baseSize = product?.size || product?.variants?.[0]?.size;

  // Create base variant object
  const baseVariant = useMemo(() => ({
    id: `${product?.id}-base`,
    color: baseColor || undefined,
    size: baseSize || undefined,
  }), [product?.id, baseColor, baseSize]);

  // Memoize variants array to prevent infinite re-renders in ProductVariantSelector
  const variantsList = useMemo(() => [
    baseVariant,
    ...(product?.variants || []),
  ], [baseVariant, product?.variants]);

  // Memoize the variant selection handler
  const handleVariantSelect = useCallback((variant: ProductVariant | null) => {
    // Always update the selected variant, including the base variant
    setSelectedVariant(variant);
    // Reset image index to first image when selecting a variant without image override
    if (!variant?.image) {
      setCurrentImageIndex(0);
    } else if (variant.image) {
      const variantImageIndex = images.indexOf(variant.image);
      if (variantImageIndex !== -1) {
        setCurrentImageIndex(variantImageIndex);
      }
    }
  }, [images]);

  // For products without variants, auto-select baseVariant
  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) {
      setSelectedVariant(baseVariant);
    }
  }, [baseVariant, product?.variants]);
  
  // Collect all unique variant images
  const variantImages = useMemo(() => {
    const uniqueImages = new Set<string>();
    product?.variants?.forEach((v) => {
      if (v.image && !images.includes(v.image)) {
        uniqueImages.add(v.image);
      }
    });
    return Array.from(uniqueImages);
  }, [product?.variants, images]);

  // All gallery images (products + variants)
  const allGalleryImages = useMemo(() => [...images, ...variantImages], [images, variantImages]);

  // Find which variant owns a given image, if any
  const getVariantForImage = useCallback((imageName: string) => {
    // Check if it's a variant image
    if (product?.variants) {
      const variant = product.variants.find((v) => v.image === imageName);
      if (variant) {
        return variant;
      }
    }
    // Check if it's a base product image
    if (images.includes(imageName)) {
      return baseVariant;
    }
    return null;
  }, [product?.variants, images, baseVariant]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const nextIndex = (prev + 1) % allGalleryImages.length;
      const nextImageName = allGalleryImages[nextIndex];
      const variant = getVariantForImage(nextImageName);
      if (variant) {
        setSelectedVariant(variant);
      } else {
        setSelectedVariant(null);
      }
      return nextIndex;
    });
  }, [allGalleryImages, getVariantForImage]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const nextIndex = (prev - 1 + allGalleryImages.length) % allGalleryImages.length;
      const nextImageName = allGalleryImages[nextIndex];
      const variant = getVariantForImage(nextImageName);
      if (variant) {
        setSelectedVariant(variant);
      } else {
        setSelectedVariant(null);
      }
      return nextIndex;
    });
  }, [allGalleryImages, getVariantForImage]);

  // Get the display image - use variant image if selected, otherwise use current index
  const displayImageName = useMemo(() => {
    if (selectedVariant?.image) {
      return selectedVariant.image;
    }
    if (currentImageIndex < allGalleryImages.length) {
      return allGalleryImages[currentImageIndex];
    }
    return allGalleryImages[0] || '';
  }, [selectedVariant, allGalleryImages, currentImageIndex]);
  
  const displayPrice = selectedVariant?.price || product?.basePrice;

  // Determine which image is currently active/highlighted
  const activeImageIndex = useMemo(() => {
    if (selectedVariant?.image) {
      const idx = allGalleryImages.indexOf(selectedVariant.image);
      return idx >= 0 ? idx : 0;
    }
    // Ensure currentImageIndex is within bounds
    if (currentImageIndex < allGalleryImages.length) {
      return currentImageIndex;
    }
    return 0;
  }, [selectedVariant, allGalleryImages, currentImageIndex]);

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
                  src={getImageUrl(displayImageName)}
                  alt={t(product.nameKey)}
                  className="gallery-image"
                />

                {allGalleryImages.length > 1 && (
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

              {allGalleryImages.length > 1 && (
                <div className="thumbnail-container">
                  {allGalleryImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        const variant = getVariantForImage(image);
                        setSelectedVariant(variant || null);
                      }}
                      className={cn("thumbnail", activeImageIndex === index && "active")}
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
                €{displayPrice?.toLocaleString()}
              </p>

              {product.descriptionKey && (
                <div className="prose prose-stone max-w-none mb-8">
                  <p className="text-body">{t(product.descriptionKey)}</p>
                </div>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <ProductVariantSelector
                    variants={variantsList}
                    selectedVariantId={selectedVariant?.id}
                    onVariantSelect={handleVariantSelect}
                  />
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
                      // For products with variants, require variant selection
                      if (product.variants && product.variants.length > 0 && !selectedVariant) {
                        toast.error("Please select a color and size");
                        return;
                      }
                      const cart = JSON.parse(
                        localStorage.getItem("cart") || "[]",
                      ) as Array<{
                        id: string;
                        slug: string;
                        name: string;
                        price: number;
                        image: string;
                        quantity: number;
                        color?: string;
                        size?: string;
                      }>;
                      
                      // Use selectedVariant if available, otherwise use base product
                      const variant = selectedVariant || baseVariant;
                      const variantKey = variant 
                        ? `${product.id}-${variant.color || ""}-${variant.size || ""}`
                        : product.id;
                      const existingItem = cart.find((item) => item.id === variantKey);
                      const itemPrice = ('price' in variant && variant.price) || product.basePrice;
                      const itemImage = displayImageName || images[0];
                      
                      if (existingItem) {
                        existingItem.quantity += quantity;
                      } else {
                        cart.push({
                          id: variantKey,
                          slug: product.slug,
                          name: t(product.nameKey),
                          price: itemPrice,
                          image: itemImage,
                          quantity,
                          ...(variant?.color && { color: variant.color }),
                          ...(variant?.size && { size: variant.size }),
                        });
                      }
                      localStorage.setItem("cart", JSON.stringify(cart));
                      // Dispatch custom event to update header cart count
                      window.dispatchEvent(new Event("cartUpdated"));
                      const variantText = [variant?.color, variant?.size].filter(Boolean).join(" • ");
                      toast.success(
                        `Added ${quantity}x ${t(product.nameKey)}${variantText ? " (" + variantText + ")" : ""} to basket`,
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
