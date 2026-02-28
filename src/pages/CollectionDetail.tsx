// CollectionDetail.tsx - Individual collection page showing all products in the collection
import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/useLanguageHook";
import { getCollectionBySlug, getProductsByCollection, getImageUrl } from "@/data/catalogData";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 12;

const CollectionDetail = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<"price-asc" | "price-desc" | null>(null);

  const collection = slug ? getCollectionBySlug(slug) : null;

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const allProducts = collection ? getProductsByCollection(collection.id) : [];
    const products = [...allProducts];

    if (sort === "price-asc") {
      products.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sort === "price-desc") {
      products.sort((a, b) => b.basePrice - a.basePrice);
    }

    return products;
  }, [collection, sort]);

  // Reset to page 1 when sort changes
  if (sort !== null) {
    setCurrentPage(1);
  }

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  if (!collection) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="heading-section mb-4">Collection Not Found</h1>
            <Link to="/collections" className="btn-outline-luxury">
              Back to Collections
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${t(collection.nameKey)} | Manaku`}
        description={t(collection.descriptionKey)}
        url={`https://lux-furniture-demo.netlify.app/collections/${collection.slug}`}
      />

      <section className="pt-28 pb-20">
        <div className="container-luxury">
          {/* Breadcrumb */}
          <nav className="mb-12">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  {t("breadcrumb.home")}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/collections" className="hover:text-foreground transition-colors">
                  {t("navigation.collections")}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{t(collection.nameKey)}</li>
            </ol>
          </nav>

          {/* Collection Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="heading-display mb-6">{t(collection.nameKey)}</h1>
                <p className="text-body text-lg text-muted-foreground mb-8">
                  {t(collection.descriptionKey)}
                </p>
                <div className="text-sm text-muted-foreground">
                  {sortedProducts.length} {t("collections.products").toLowerCase()}
                </div>
              </div>
              <div className="relative overflow-hidden aspect-square rounded-lg">
                <img
                  src={collection.image}
                  alt={t(collection.nameKey)}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Sorting Controls */}
          <div className="mb-12 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {sortedProducts.length} {t("collections.products").toLowerCase()}
            </div>
            <div className="flex gap-4">
              <select
                value={sort || ""}
                onChange={(e) => {
                  const newSort = (e.target.value || null) as "price-asc" | "price-desc" | null;
                  setSort(newSort);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/product/${product.slug}`}
                  className="group cursor-pointer block"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-square mb-4 rounded-lg bg-secondary/50">
                    <img
                      src={getImageUrl(product.images?.[0] || "")}
                      alt={product.slug}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="heading-sm group-hover:opacity-70 transition-opacity line-clamp-2">
                      {product.slug}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ${product.basePrice.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`pagination-page-btn ${
                      currentPage === index + 1 ? "pagination-page-btn--active" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CollectionDetail;
