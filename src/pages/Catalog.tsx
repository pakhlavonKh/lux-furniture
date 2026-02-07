import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ui/ProductCard";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { X, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/useLanguageHook";

// Import product images
import armchairImage from "@/assets/product-armchair.jpg";
import diningTableImage from "@/assets/product-dining-table.jpg";
import lampImage from "@/assets/product-lamp.jpg";

// Sample products data
const allProducts = [
  {
    id: "1",
    title: "Aria Lounge Chair",
    slug: "aria-lounge-chair",
    price: 3450,
    image: armchairImage,
    category: "Seating",
    material: "Bouclé Fabric",
    color: "Beige",
    style: "Contemporary",
  },
  {
    id: "2",
    title: "Tavola Dining Table",
    slug: "tavola-dining-table",
    price: 8900,
    image: diningTableImage,
    category: "Dining",
    material: "Walnut Wood",
    color: "Natural",
    style: "Modern",
  },
  {
    id: "3",
    title: "Luce Floor Lamp",
    slug: "luce-floor-lamp",
    price: 1850,
    image: lampImage,
    category: "Lighting",
    material: "Brass",
    color: "Gold",
    style: "Contemporary",
  },
  {
    id: "4",
    title: "Milano Armchair",
    slug: "milano-armchair",
    price: 2890,
    image: armchairImage,
    category: "Seating",
    material: "Leather",
    color: "Cream",
    style: "Classic",
  },
  {
    id: "5",
    title: "Notte Console Table",
    slug: "notte-console-table",
    price: 4200,
    image: diningTableImage,
    category: "Tables",
    material: "Oak Wood",
    color: "Natural",
    style: "Modern",
  },
  {
    id: "6",
    title: "Sereno Table Lamp",
    slug: "sereno-table-lamp",
    price: 980,
    image: lampImage,
    category: "Lighting",
    material: "Ceramic",
    color: "White",
    style: "Minimalist",
  },
];

const categories = ["All", "Seating", "Dining", "Tables", "Lighting", "Bedroom"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under €2,000", min: 0, max: 2000 },
  { label: "€2,000 - €5,000", min: 2000, max: 5000 },
  { label: "€5,000 - €10,000", min: 5000, max: 10000 },
  { label: "Over €10,000", min: 10000, max: Infinity },
];
const materials = ["All", "Bouclé Fabric", "Walnut Wood", "Brass", "Leather", "Oak Wood", "Ceramic"];
const styles = ["All", "Contemporary", "Modern", "Classic", "Minimalist"];

// Category tiles for shopping
const categoryTiles = [
  { key: "furniture", label: "Furniture" },
  { key: "seating", label: "Seating" },
  { key: "dining", label: "Dining" },
  { key: "lighting", label: "Lighting" },
  { key: "tables", label: "Tables" },
  { key: "bedroom", label: "Bedroom" },
  { key: "accessories", label: "Accessories" },
];

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter products by search query
  };

  const handleCategoryClick = (category: string) => {
    if (category === "Furniture") {
      setSelectedCategory("All");
    } else {
      setSelectedCategory(category);
    }
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const searchMatch = searchQuery === "" || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const priceMatch = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
      const materialMatch = selectedMaterial === "All" || product.material === selectedMaterial;
      const styleMatch = selectedStyle === "All" || product.style === selectedStyle;

      return searchMatch && categoryMatch && priceMatch && materialMatch && styleMatch;
    });
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedMaterial, selectedStyle]);

  const activeFiltersCount = [
    selectedCategory !== "All",
    selectedPriceRange.label !== "All Prices",
    selectedMaterial !== "All",
    selectedStyle !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPriceRange(priceRanges[0]);
    setSelectedMaterial("All");
    setSelectedStyle("All");
  };

  // Render filter section
  const renderFilters = () => (
    <div>
      {/* Category Filter */}
      <div className="filter-section">
        <h3>{t("catalog.category")}</h3>
        <div className="filter-buttons">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "filter-button",
                selectedCategory === category && "active"
              )}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <h3>{t("catalog.price")}</h3>
        <div className="filter-buttons">
          {priceRanges.map((range) => (
            <motion.button
              key={range.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPriceRange(range)}
              className={cn(
                "filter-button",
                selectedPriceRange.label === range.label && "active"
              )}
            >
              {range.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Material Filter */}
      <div className="filter-section">
        <h3>{t("catalog.material")}</h3>
        <div className="filter-buttons">
          {materials.map((material) => (
            <motion.button
              key={material}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMaterial(material)}
              className={cn(
                "filter-button",
                selectedMaterial === material && "active"
              )}
            >
              {material}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Style Filter */}
      <div className="filter-section">
        <h3>{t("catalog.style")}</h3>
        <div className="filter-buttons">
          {styles.map((style) => (
            <motion.button
              key={style}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStyle(style)}
              className={cn(
                "filter-button",
                selectedStyle === style && "active"
              )}
            >
              {style}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={clearFilters}
          className="filter-clear-btn"
        >
          {t("catalog.clearAll")}
        </motion.button>
      )}
    </div>
  );

  return (
    <Layout>
      <SEO 
        title="Manaku | Premium Furniture Catalog" 
        description="Explore our exclusive collection of luxury furniture. Handcrafted pieces featuring contemporary and classic designs for refined living."
        url="https://lux-furniture-demo.netlify.app/"
      />

      {/* Hero & Search Section */}
      <section className="pt-28 pb-12 bg-background border-b border-neutral-200">
        <div className="container-luxury">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <form
              onSubmit={handleSearch}
              className="relative max-w-4xl mx-auto"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={t("index.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-6 py-4 pr-12 text-foreground placeholder-neutral-500 focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-4 bg-transparent border-none text-neutral-400 hover:text-foreground transition-colors duration-300 cursor-pointer p-0"
                  title={t("header.search")}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Category Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-xs uppercase tracking-widest mb-6 text-muted-foreground font-semibold">
              {t("index.shopByCategory")}
            </h2>
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3 min-w-min">
                {categoryTiles.map((category, index) => (
                  <motion.button
                    key={category.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(category.label)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 cursor-pointer flex-shrink-0 border rounded transition-all duration-300 hover:-translate-y-1",
                      "w-24 h-24 font-semibold text-xs text-center aspect-square",
                      selectedCategory === category.label || (category.label === "Furniture" && selectedCategory === "All")
                        ? "bg-foreground border-foreground text-background shadow-lg"
                        : "bg-white border-neutral-300 hover:border-foreground hover:shadow-md text-foreground"
                    )}
                  >
                    <span className="px-2 leading-tight break-words">
                      {t(`index.${category.key}`)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Catalog: 2-Column Layout */}
      <section className="section-padding bg-background">
        <div className="container-luxury">
          {/* Mobile: Filter Toggle */}
          <div className="catalog-filter-toggle">
            <p>
              {filteredProducts.length} {filteredProducts.length === 1 ? t("catalog.product") : t("catalog.products")}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "catalog-filter-toggle-btn",
                showFilters && "active"
              )}
            >
              <Menu className="w-4 h-4" />
              <span>
                {t("catalog.filters")}
                {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
              </span>
            </button>
          </div>

          {/* 2-Column Layout Grid */}
          <div className="catalog-layout">
            {/* Left Sidebar: Filters (Desktop Only) */}
            <aside className="catalog-sidebar">
              {renderFilters()}
            </aside>

            {/* Right Side: Products Grid */}
            <div className="catalog-products">
              {/* Mobile Filters (Conditional) */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="catalog-filters-mobile"
                >
                  {renderFilters()}
                </motion.div>
              )}

              {/* Header with Result Count */}
              <div className="catalog-header">
                <p>
                  {filteredProducts.length} {filteredProducts.length === 1 ? t("catalog.product") : t("catalog.products")}
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="catalog-header-clear"
                  >
                    <X className="w-3 h-3" />
                    {t("catalog.clearAll")}
                  </button>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="product-grid"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <ProductCard
                        id={product.id}
                        title={product.title}
                        slug={product.slug}
                        price={product.price}
                        image={product.image}
                        category={product.category}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="catalog-empty"
                >
                  <p>{t("catalog.noProducts")}</p>
                  <button
                    onClick={clearFilters}
                    className="catalog-empty-btn"
                  >
                    {t("catalog.clearAll")}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
