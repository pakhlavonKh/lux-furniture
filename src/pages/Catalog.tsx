import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/useLanguageHook";
import { useApiProducts, getApiImageUrl } from "@/hooks/useApiProducts";
import type { ProductData, Discount } from "@/lib/api";
import { getAllDiscounts } from "@/lib/api";
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
  const { t, language } = useLanguage();
  const { products, loading: productsLoading } = useApiProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const minPrice = parseInt(searchParams.get("minPrice") || "0", 10);
  const maxPrice = parseInt(searchParams.get("maxPrice") || "50000000", 10);

  const [isDesktop, setIsDesktop] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const isInitialMount = useRef(true);
  const scrollPositionRef = useRef(0);

  // Get filter values from URL search params
  const selectedCategory = searchParams.get("category") || null;
  const selectedSubcategory = searchParams.get("subcategory") || null;
  const sort = (searchParams.get("sort") || null) as "price-asc" | "price-desc" | null;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Helper functions to update URL params
 const updateFilters = useCallback(
  (updates: {
    category?: string | null;
    subcategory?: string | null;
    sort?: "price-asc" | "price-desc" | null;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
  }) => {
    // Save scroll position before URL change
    scrollPositionRef.current = window.scrollY;

    const newParams = new URLSearchParams(searchParams);

    if (updates.category !== undefined) {
      if (updates.category) newParams.set("category", updates.category);
      else newParams.delete("category");
    }

    if (updates.subcategory !== undefined) {
      if (updates.subcategory) newParams.set("subcategory", updates.subcategory);
      else newParams.delete("subcategory");
    }

    if (updates.sort !== undefined) {
      if (updates.sort) newParams.set("sort", updates.sort);
      else newParams.delete("sort");
    }

    if (updates.minPrice !== undefined) {
      if (updates.minPrice > 0)
        newParams.set("minPrice", String(updates.minPrice));
      else newParams.delete("minPrice");
    }

    if (updates.maxPrice !== undefined) {
      if (updates.maxPrice < 50000000)
        newParams.set("maxPrice", String(updates.maxPrice));
      else newParams.delete("maxPrice");
    }

    if (updates.page !== undefined) {
      newParams.set("page", String(updates.page));
    }

    setSearchParams(newParams);
  },
  [searchParams, setSearchParams]
);

  const setSelectedCategory = useCallback(
    (category: string | null) => {
      updateFilters({ category, page: 1 });
    },
    [updateFilters]
  );

  const setSelectedSubcategory = useCallback(
    (subcategory: string | null) => {
      updateFilters({ subcategory, page: 1 });
    },
    [updateFilters]
  );

  const setSort = useCallback(
    (sortOption: "price-asc" | "price-desc" | null) => {
      updateFilters({ sort: sortOption, page: 1 });
    },
    [updateFilters]
  );

  const setCurrentPage = useCallback(
    (page: number | ((p: number) => number)) => {
      const newPage =
        typeof page === "function" ? page(currentPage) : page;
      updateFilters({ page: newPage });
    },
    [currentPage, updateFilters]
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

    // Disable automatic scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () =>
      mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
  if (!isInitialMount.current) {
    window.scrollTo({
      top: scrollPositionRef.current,
      behavior: "auto",
    });
  } else {
    isInitialMount.current = false;
  }
}, [searchParams]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedSubcategory) {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    // Filter by price range
    list = list.filter((p) => {
      const price = p.basePrice;
      return price >= minPrice && price <= maxPrice;
    });

    if (sort === "price-asc") {
      list.sort((a, b) => a.basePrice - b.basePrice);
    }

    if (sort === "price-desc") {
      list.sort((a, b) => b.basePrice - a.basePrice);
    }

    return list;
  }, [products, selectedCategory, selectedSubcategory, sort, minPrice, maxPrice]);



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

  // Fetch active discounts for display
  useEffect(() => {
    getAllDiscounts(true)
      .then((data) => {
        console.log("=".repeat(60));
        console.log("🎯 DISCOUNTS FETCHED FOR CATALOG");
        console.log("=".repeat(60));
        console.log("Total discounts:", data.length);
        data.forEach((d, i) => {
          console.log(`\nDiscount ${i + 1}:`);
          console.log("  Title:", d.title?.en);
          console.log("  Percentage:", d.percentage);
          console.log("  Active:", d.isActive);
          console.log("  Product IDs in discount:", d.productIds);
          console.log("    - Type:", typeof d.productIds);
          console.log("    - Is Array:", Array.isArray(d.productIds));
          console.log("    - Length:", d.productIds?.length);
          if (d.productIds && d.productIds.length > 0) {
            console.log("    - First ID:", d.productIds[0], "- Type:", typeof d.productIds[0]);
          }
        });
        console.log("=".repeat(60));
        setDiscounts(data);
      })
      .catch((error) => {
        console.error("Failed to fetch discounts:", error);
        setDiscounts([]);
      });
  }, []);

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
            onMouseEnter={() => {
              if (isDesktop && activeMega) {
                // Keep dropdown open when hovering over it
              }
            }}
            onMouseLeave={() => {
              if (isDesktop) setActiveMega(null);
            }}
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
                      updateFilters({ category: null, subcategory: null });
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

              <div className="filters-section">
                <h3 className="filter-section-title">
                  {t("catalog.priceRange") || "Price Range"}
                </h3>
                <div className="filter-group">
                  <div className="price-slider-wrapper">
                    <div className="price-slider-track">
                      <input
                        type="range"
                        min="0"
                        max="50000000"
                        value={minPrice}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value <= maxPrice) {
                            updateFilters({ minPrice: value });
                          }
                        }}
                        className="price-slider price-slider-min"
                      />
                      <input
                        type="range"
                        min="0"
                        max="50000000"
                        value={maxPrice}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= minPrice) {
                            updateFilters({ maxPrice: value });
                          }
                        }}
                        className="price-slider price-slider-max"
                      />
                    </div>
                    <div className="price-display">
                      <div className="price-display-item">
                        <span className="price-label">{t("catalog.from") || "From"}</span>
                        <div className="price-input-wrapper">
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => {
                              const value = Math.max(0, parseInt(e.target.value) || 0);
                              if (value <= maxPrice) {
                                updateFilters({ minPrice: value });
                              }
                            }}
                            className="price-display-input"
                            min="0"
                            max={maxPrice}
                          />
                          <span className="price-display-unit">UZS</span>
                        </div>
                      </div>
                      <div className="price-display-item">
                        <span className="price-label">{t("catalog.to") || "To"}</span>
                        <div className="price-input-wrapper">
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => {
                              const value = Math.max(0, parseInt(e.target.value) || 50000000);
                              if (value >= minPrice) {
                                updateFilters({ maxPrice: value });
                              }
                            }}
                            className="price-display-input"
                            min={minPrice}
                            max="50000000"
                          />
                          <span className="price-display-unit">UZS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  updateFilters({
                    category: null,
                    subcategory: null,
                    sort: null,
                    minPrice: 0,
                    maxPrice: 50000000,
                    page: 1,
                  });
                }}
                className="filters-clear"
              >
                {t("catalog.clearFilters")}
              </button>
            </aside>

            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {productsLoading ? (
                  <div className="col-span-full py-20 flex items-center justify-center">
                    <div className="animate-spin w-6 h-6 border-2 border-foreground border-t-transparent rounded-full" />
                  </div>
                ) : paginatedProducts.map((product, productIndex) => {
                  const imageUrl = getApiImageUrl(product);
                  const productId = product._id;
                  
                  // Debug only for first 3 products on first page
                  const shouldDebug = currentPage === 1 && productIndex < 3;
                  
                  const discount = productId && discounts.find((d) => {
                    const ids = Array.isArray(d.productIds) ? d.productIds : [];
                    
                    if (shouldDebug) {
                      console.log(`\n📦 Product ${productIndex + 1}: ${product.slug || product.name || "unknown"}`);
                      console.log("  Product._id:", productId, "- Type:", typeof productId);
                      console.log("  Discount to check:", d.title?.en);
                      console.log("  Discount.productIds:", ids);
                    }
                    
                    const found = ids.some((id) => {
                      const strId = String(id);
                      const strProductId = String(productId);
                      const matches = strId === strProductId;
                      
                      if (shouldDebug && ids.length > 0) {
                        console.log(`    Comparing: "${strId}" === "${strProductId}" → ${matches}`);
                      }
                      return matches;
                    }) && d.isActive;
                    
                    if (found && shouldDebug) {
                      console.log("  ✅ MATCH FOUND!");
                    }
                    
                    return found;
                  });
                  const discountedPrice = discount
                    ? Math.round(product.basePrice * (1 - (discount.percentage || 0) / 100))
                    : product.basePrice;
                  const showDiscount = discount && discount.percentage > 0;

                  return (
                    <div key={product._id || product.slug} className="group">
                      <Link
                        to={`/product/${product.slug}`}
                        className="block"
                      >
                        <div className="product-card">
                          <div className="product-card__image-wrap">
                            <img
                              src={imageUrl}
                              alt={product.name?.[language] || product.name?.en || product.slug}
                              className="product-card__image group-hover:scale-105 transition"
                            />
                            {showDiscount && (
                              <div style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                backgroundColor: "#e53e3e",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 600
                              }}>
                                -{discount.percentage}%
                              </div>
                            )}
                          </div>
                          <div className="product-card__title">
                            {product.name?.[language] || product.name?.en || product.slug}
                          </div>
                          <div className="product-card__price">
                            {showDiscount ? (
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ textDecoration: "line-through", color: "#999", fontSize: 12 }}>
                                  {product.basePrice.toLocaleString()} UZS
                                </span>
                                <span style={{ fontWeight: 600, color: "#e53e3e" }}>
                                  {discountedPrice.toLocaleString()} UZS
                                </span>
                              </div>
                            ) : (
                              product.basePrice.toLocaleString() + " UZS"
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
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