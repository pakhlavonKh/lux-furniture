import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/useLanguageHook";

import kitchenImg from "@/assets/product-dining-table.jpg";
import gardenImg from "@/assets/collection-living.jpg";
import officeImg from "@/assets/product-armchair.jpg";
import childrenImg from "@/assets/product-bed.jpg";
import shelvingImg from "@/assets/product-console.jpg";
import industrialImg from "@/assets/product-sofa.jpg";
import accessoriesImg from "@/assets/product-lamp.jpg";

import { getProducts } from "@/data/catalogData";
import { Filter } from "lucide-react";

const categories = [
  { key: "storage", image: shelvingImg },
  { key: "kitchen", image: kitchenImg },
  { key: "garden", image: gardenImg },
  { key: "office", image: officeImg },
  { key: "children", image: childrenImg },
  { key: "industrial", image: industrialImg },
  { key: "accessories", image: accessoriesImg },
];

export default function Catalog() {
  const { t } = useLanguage();
  const products = getProducts();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<"price-asc" | "price-desc" | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      if (event.matches) {
        setFiltersOpen(true);
      }
    };

    setIsDesktop(mediaQuery.matches);
    setFiltersOpen(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory) {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    if (sort === "price-asc") {
      list.sort((a, b) => a.basePrice - b.basePrice);
    }
    if (sort === "price-desc") {
      list.sort((a, b) => b.basePrice - a.basePrice);
    }

    return list;
  }, [products, selectedCategory, sort]);

  return (
    <Layout>
      <SEO
        title={t("catalog.seo.title")}
        description={t("catalog.seo.description")}
        url="https://lux-furniture-demo.netlify.app/catalog"
      />

      {/* Categories Scroll */}
      <section className="pt-28 pb-8 bg-background border-b border-neutral-200">
        <div className="container-luxury">
          <div className="categories-scroll">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === cat.key ? null : cat.key
                  )
                }
                className={`category-card ${
                  selectedCategory === cat.key ? "ring-2 ring-foreground" : ""
                }`}
              >
                <img
                  src={cat.image}
                  alt={t(`categories.${cat.key}`)}
                  className="category-card__image"
                />
                <span className="category-card__title">
                  {t(`categories.${cat.key}`)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products + Filters */}
      <section className="py-12 bg-background">
        <div className="container-luxury">
          {!isDesktop && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t("catalog.allProducts")}</h2>
              <button
                onClick={() => setFiltersOpen((prev) => !prev)}
                className="flex items-center gap-2 border border-border px-4 py-2 rounded-md"
                aria-expanded={filtersOpen}
                aria-controls="catalog-filters"
              >
                <Filter className="w-4 h-4" />
                {t("catalog.filters") || "Filters"}
              </button>
            </div>
          )}

          <div className="md:flex md:flex-row gap-8 lg:gap-10 items-start">
            {/* Filters Panel */}
            <aside
              id="catalog-filters"
              className="w-full md:w-auto border border-border bg-muted/20 rounded-xl p-6 space-y-6 h-fit mb-6 md:mb-0"
              style={{
                flex: "0 0 280px",
                display: isDesktop || filtersOpen ? "block" : "none",
              }}
            >
              <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>{t("catalog.filters") || "Filters"}</span>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  {t("catalog.category") || "Category"}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block text-left w-full px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === null
                        ? "bg-background font-semibold text-foreground border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                    }`}
                  >
                    {t("catalog.all") || "All"}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`block text-left w-full px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === cat.key
                          ? "bg-background font-semibold text-foreground border border-border"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                      }`}
                    >
                      {t(`categories.${cat.key}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  {t("catalog.sort") || "Sort"}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSort("price-asc")}
                    className={`block text-left w-full px-3 py-2 rounded-md transition-colors ${
                      sort === "price-asc"
                        ? "bg-background font-semibold text-foreground border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                    }`}
                  >
                    {t("catalog.priceLowHigh") || "Price: Low → High"}
                  </button>
                  <button
                    onClick={() => setSort("price-desc")}
                    className={`block text-left w-full px-3 py-2 rounded-md transition-colors ${
                      sort === "price-desc"
                        ? "bg-background font-semibold text-foreground border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                    }`}
                  >
                    {t("catalog.priceHighLow") || "Price: High → Low"}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSort(null);
                }}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                {t("catalog.clearFilters") || "Clear filters"}
              </button>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-semibold mb-8" style={{ display: isDesktop ? "block" : "none" }}>
                {t("catalog.allProducts")}
              </h2>

              {filteredProducts.length === 0 ? (
                <p className="text-muted-foreground">
                  {t("catalog.noResults") || "No products found."}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="block group"
                    >
                      <div className="product-card">
                        <div className="product-card__image-wrap">
                          <img
                            src={product.image}
                            alt={t(product.nameKey)}
                            className="product-card__image transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="product-card__title">
                          {t(product.nameKey)}
                        </div>

                        <div className="product-card__price">
                          €{product.basePrice.toLocaleString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}