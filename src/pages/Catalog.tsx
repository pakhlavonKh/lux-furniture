import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/useLanguageHook";
import { getImageUrl, getProducts } from "@/data/catalogData";
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

import { Filter, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const ITEMS_PER_PAGE = 12;

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
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sort, setSort] = useState<"price-asc" | "price-desc" | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const isInitialMount = useRef(true);

  const [currentPage, setCurrentPageState] = useState(() => {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get("page") || "1", 10);
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page") || "1", 10);
    setCurrentPageState(page);
  }, [location.search]);

  const setCurrentPage = useCallback(
    (page: number | ((p: number) => number)) => {
      const newPage =
        typeof page === "function" ? page(currentPage) : page;
      setCurrentPageState(newPage);
      navigate(`/?page=${newPage}`, { replace: false });
    },
    [currentPage, navigate]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      setFiltersOpen(e.matches);
      if (!e.matches) setActiveMega(null);
    };

    setIsDesktop(mediaQuery.matches);
    setFiltersOpen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () =>
      mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory) {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    if (selectedSubcategory) {
      list = list.filter((p) => p.subcategoryId === selectedSubcategory);
    }

    if (sort === "price-asc") {
      list.sort((a, b) => a.basePrice - b.basePrice);
    }

    if (sort === "price-desc") {
      list.sort((a, b) => b.basePrice - a.basePrice);
    }

    return list;
  }, [products, selectedCategory, selectedSubcategory, sort]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, sort, setCurrentPage]);

  useEffect(() => {
    if (selectedSubcategory) {
      // Find which category contains this subcategory and expand it
      const categoryToExpand = categories.find((cat) =>
        cat.subcategories.some(
          (sub) => sub.title.toLowerCase().replace(/\s+/g, "-") === selectedSubcategory
        )
      );
      if (categoryToExpand) {
        setExpandedCategories((prev) => new Set([...prev, categoryToExpand.key]));
      }
    }
  }, [selectedSubcategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const paginationPages = useMemo(() => {
    const pages: (number | null)[] = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= left && i <= right)
      ) {
        pages.push(i);
      } else if (
        (i === left - 1 || i === right + 1) &&
        pages[pages.length - 1] !== null
      ) {
        pages.push(null);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <Layout>
      <SEO
        title={t("catalog.seo.title")}
        description={t("catalog.seo.description")}
        url="https://lux-furniture-demo.netlify.app/catalog"
      />

      {/* CATEGORY NAVIGATION */}
      <section className="catalog-nav-section">
        <div
          className="catalog-nav-wrapper"
          onMouseLeave={() => {
            if (isDesktop) setActiveMega(null);
          }}
        >
          <div className="container-luxury">
            <div className="categories-scroll">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className="category-card"
                  onMouseEnter={() => {
                    if (isDesktop) setActiveMega(cat.key);
                  }}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    if (!isDesktop) {
                      setActiveMega((prev) =>
                        prev === cat.key ? null : cat.key
                      );
                    }
                  }}
                >
                  <span className="category-card__title">
                    {t(`categories.${cat.key}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            className={`mega-dropdown ${
              activeMega ? "mega-dropdown--open" : ""
            } ${!isDesktop ? "mega-dropdown--mobile" : ""}`}
          >
            {categories.map((cat) =>
              activeMega === cat.key ? (
                <div key={cat.key} className="mega-content container-luxury">
                  <div className="mega-left">
                    <h3 className="mega-title">
                      {t(`categories.${cat.key}`)}
                    </h3>
                    <ul className="mega-list">
                      {cat.subcategories.map((sub) => {
                        const subcategoryId = sub.title.toLowerCase().replace(/\s+/g, "-");
                        return (
                          <li key={sub.title}>
                            <button
                              onClick={() => {
                                setSelectedCategory(cat.key);
                                setSelectedSubcategory(subcategoryId);
                                if (!isDesktop) setActiveMega(null);
                              }}
                            >
                              {t(`subcategories.${sub.title}`)}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mega-grid">
                    {cat.subcategories.map((sub) => {
                      const subcategoryId = sub.title.toLowerCase().replace(/\s+/g, "-");
                      return (
                        <button
                          key={sub.title}
                          onClick={() => {
                            setSelectedCategory(cat.key);
                            setSelectedSubcategory(subcategoryId);
                            if (!isDesktop) setActiveMega(null);
                          }}
                          className="mega-card"
                          style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}
                        >
                          <div className="mega-card__image-wrap">
                            <img src={sub.image} alt={sub.title} />
                          </div>
                          <span className="mega-card__title">
                            {t(`subcategories.${sub.title}`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </section>

      {/* PRODUCTS + FILTERS */}
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
              >
                <Filter className="filters-toggle-icon" />
                {t("catalog.filters") || "Filters"}
              </button>
            </div>
          )}

          <div className="md:flex gap-8 items-start">
            <aside
              className={`filters-panel ${
                isDesktop
                  ? "filters-desktop"
                  : filtersOpen
                  ? "filters-mobile-open"
                  : "filters-mobile-closed"
              }`}
            >
              <div className="filters-header">
                <Filter className="filters-header-icon" />
                <span>{t("catalog.filters") || "Filters"}</span>
              </div>

              <div className="filters-section">
                <h3 className="filter-section-title">
                  {t("catalog.category") || "Category"}
                </h3>
                <div className="filter-group">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubcategory(null);
                    }}
                    className={`filter-item ${
                      selectedCategory === null && selectedSubcategory === null ? "active" : ""
                    }`}
                  >
                    {t("catalog.all") || "All"}
                  </button>

                  {categories.map((cat) => (
                    <div key={cat.key}>
                      <div className={`filter-item ${
                            selectedCategory === cat.key ? "active" : ""
                          }`}>
                        <button
                          onClick={() => setSelectedCategory(cat.key)}
                          className="filter-button"
                        >
                          {t(`categories.${cat.key}`)}
                          
                        </button>
                          
                        <button
                          onClick={() => {
                            setExpandedCategories((prev) => {
                              const newSet = new Set(prev);
                              if (newSet.has(cat.key)) {
                                newSet.delete(cat.key);
                              } else {
                                newSet.add(cat.key);
                              }
                              return newSet;
                            });
                          }}
                          className="chevron-btn"
                        >
                          <ChevronDown
                            className={`chevron-down ${
                              expandedCategories.has(cat.key)
                                ? "open"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                      {expandedCategories.has(cat.key) && (
                        <div className="filter-subcategories">
                          {cat.subcategories.map((sub) => {
                            const subcategoryId = sub.title.toLowerCase().replace(/\s+/g, "-");
                            return (
                              <button
                                key={sub.title}
                                onClick={() => {
                                  setSelectedCategory(cat.key);
                                  setSelectedSubcategory(subcategoryId);
                                }}
                                className={`filter-item text-sm block w-full text-left ${
                                  selectedSubcategory === subcategoryId ? "active" : ""
                                }`}
                              >
                                {t(`subcategories.${sub.title}`)}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="filters-section">
                <h3 className="filter-section-title">
                  {t("catalog.sort") || "Sort"}
                </h3>
                <div className="filter-group">
                  <button
                    onClick={() => setSort("price-asc")}
                    className={`filter-item ${
                      sort === "price-asc" ? "active" : ""
                    }`}
                  >
                    {t("catalog.priceLowHigh")}
                  </button>
                  <button
                    onClick={() => setSort("price-desc")}
                    className={`filter-item ${
                      sort === "price-desc" ? "active" : ""
                    }`}
                  >
                    {t("catalog.priceHighLow")}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                  setSort(null);
                }}
                className="filters-clear"
              >
                {t("catalog.clearFilters")}
              </button>
            </aside>

            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {paginatedProducts.map((product) => (
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
                          className="product-card__image group-hover:scale-105 transition"
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

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {paginationPages.map((page) =>
                    page === null ? (
                      <span key="ellipsis" className="pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-page-btn ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(totalPages, p + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}