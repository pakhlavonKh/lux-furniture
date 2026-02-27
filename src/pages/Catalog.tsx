// This page is the main catalog view, where users can browse through all the products available in the store. It features a horizontal scrollable section at the top for filtering products by category, and a sidebar for additional filters and sorting options. The products are displayed in a responsive grid layout, and users can click on any product to view its details. The page also includes SEO metadata for better search engine visibility.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/useLanguageHook";
import { getImageUrl } from "@/data/catalogData";
import {
  StorageIcon,
  KitchenIcon,
  GardenIcon,
  OfficeIcon,
  ChildrenIcon,
  IndustrialIcon,
  AccessoriesIcon,
} from "@/components/icons/CategoryIcons";
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
  {
    key: "storage",
    icon: StorageIcon,
    subcategories: [
      { title: "Wardrobes", image: shelvingImg },
      { title: "Cabinets", image: kitchenImg },
      { title: "Dressers", image: officeImg },
      { title: "Shelving Units", image: shelvingImg },
      { title: "Sideboards", image: kitchenImg },
    ],
  },
  {
    key: "kitchen",
    icon: KitchenIcon,
    subcategories: [
      { title: "Dining Tables", image: kitchenImg },
      { title: "Dining Chairs", image: officeImg },
      { title: "Bar Stools", image: gardenImg },
      { title: "Kitchen Islands", image: shelvingImg },
      { title: "Buffets", image: kitchenImg },
    ],
  },
  {
    key: "garden",
    icon: GardenIcon,
    subcategories: [
      { title: "Outdoor Tables", image: gardenImg },
      { title: "Outdoor Chairs", image: gardenImg },
      { title: "Lounge Sets", image: industrialImg },
      { title: "Sunbeds", image: gardenImg },
    ],
  },
  {
    key: "office",
    icon: OfficeIcon,
    subcategories: [
      { title: "Office Desks", image: officeImg },
      { title: "Office Chairs", image: officeImg },
      { title: "Bookcases", image: shelvingImg },
      { title: "Filing Cabinets", image: kitchenImg },
    ],
  },
  {
    key: "children",
    icon: ChildrenIcon,
    subcategories: [
      { title: "Kids Beds", image: childrenImg },
      { title: "Study Desks", image: officeImg },
      { title: "Kids Wardrobes", image: shelvingImg },
      { title: "Toy Storage", image: kitchenImg },
    ],
  },
  {
    key: "industrial",
    icon: IndustrialIcon,
    subcategories: [
      { title: "Metal Tables", image: industrialImg },
      { title: "Loft Shelving", image: shelvingImg },
      { title: "Industrial Cabinets", image: industrialImg },
      { title: "Factory Style Desks", image: industrialImg },
    ],
  },
  {
    key: "accessories",
    icon: AccessoriesIcon,
    subcategories: [
      { title: "Lamps", image: accessoriesImg },
      { title: "Rugs", image: accessoriesImg },
      { title: "Mirrors", image: accessoriesImg },
      { title: "Wall Decor", image: accessoriesImg },
      { title: "Vases", image: accessoriesImg },
    ],
  },
];

export default function Catalog() {
  const { t } = useLanguage();
  const products = getProducts();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<"price-asc" | "price-desc" | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      setFiltersOpen(event.matches); // open only on desktop
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
      <section className="catalog-nav-section">
        <div
          className="catalog-nav-wrapper"
          onMouseLeave={() => setHoveredCategory(null)}
        >
          {/* Your existing horizontal scroll */}
          <div className="container-luxury">
            <div className="categories-scroll">
              {categories.map((cat) => {
                const Icon = cat.icon;

                return (
                  <button
                    className="category-card"
                    key={cat.key}
                    onMouseEnter={() => setHoveredCategory(cat.key)}
                  >
                    {/* <Icon className="category-card__image" /> */}
                    <span className="category-card__title">
                      {t(`categories.${cat.key}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MEGA DROPDOWN */}
          <div
            className={`mega-dropdown ${
              hoveredCategory ? "mega-dropdown--open" : ""
            }`}
          >
            {categories.map((cat) =>
              hoveredCategory === cat.key ? (
                <div key={cat.key} className="mega-content container-luxury">
                  {/* LEFT COLUMN */}
                  <div className="mega-left">
                    <h3 className="mega-title">{t(`categories.${cat.key}`)}</h3>

                    <ul className="mega-list">
                      {cat.subcategories?.map((sub) => (
                        <li key={sub.title}>
                          <button
                            onClick={() => {
                              setSelectedCategory(cat.key);
                              setHoveredCategory(null);
                            }}
                          >
                            {t(`subcategories.${sub.title}`)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* RIGHT GRID */}
                  <div className="mega-grid">
                    {cat.subcategories?.map((sub) => (
                      <Link key={sub.title} to="#" className="mega-card">
                        <div className="mega-card__image-wrap">
                          <img src={sub.image} alt={sub.title} />
                        </div>
                        <span className="mega-card__title">
                          {t(`subcategories.${sub.title}`)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </div>
      </section>

      {/* Products + Filters */}
      <section className="py-12 bg-background">
        <div className="container-luxury">
          {!isDesktop && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {t("catalog.allProducts")}
              </h2>
              <button
                onClick={() => setFiltersOpen((prev) => !prev)}
                className="filters-toggle-btn"
                aria-expanded={filtersOpen}
                aria-controls="catalog-filters"
              >
                <Filter className="filters-toggle-icon" />
                {t("catalog.filters") || "Filters"}
              </button>
            </div>
          )}

          <div className="md:flex md:flex-row gap-8 lg:gap-10 items-start">
            {/* Filters Panel */}
            <aside
              id="catalog-filters"
              className={`filters-panel ${
                isDesktop
                  ? "filters-desktop"
                  : filtersOpen
                    ? "filters-mobile-open"
                    : "filters-mobile-closed"
              }`}
            >
              {/* Header */}
              <div className="filters-header">
                <Filter className="filters-header-icon" />
                <span>{t("catalog.filters") || "Filters"}</span>
              </div>

              {/* Category */}
              <div className="filters-section">
                <h3 className="filter-section-title">
                  {t("catalog.category") || "Category"}
                </h3>

                <div className="filter-group">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`filter-item ${selectedCategory === null ? "active" : ""}`}
                  >
                    {t("catalog.all") || "All"}
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`filter-item ${
                        selectedCategory === cat.key ? "active" : ""
                      }`}
                    >
                      {t(`categories.${cat.key}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="filters-section">
                <h3 className="filter-section-title">
                  {t("catalog.sort") || "Sort"}
                </h3>

                <div className="filter-group">
                  <button
                    onClick={() => setSort("price-asc")}
                    className={`filter-item ${sort === "price-asc" ? "active" : ""}`}
                  >
                    {t("catalog.priceLowHigh") || "Price: Low → High"}
                  </button>

                  <button
                    onClick={() => setSort("price-desc")}
                    className={`filter-item ${sort === "price-desc" ? "active" : ""}`}
                  >
                    {t("catalog.priceHighLow") || "Price: High → Low"}
                  </button>
                </div>
              </div>

              {/* Clear */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSort(null);
                }}
                className="filters-clear"
              >
                {t("catalog.clearFilters") || "Clear filters"}
              </button>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
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
                            src={getImageUrl(product.images[0])}
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
