import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ui/ProductCard";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { Filter, ChevronDown, X, Search } from "lucide-react";
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

  return (
    <Layout>
      <SEO 
        title="Manaku | Premium Furniture Catalog" 
        description="Explore our exclusive collection of luxury furniture. Handcrafted pieces featuring contemporary and classic designs for refined living."
        url="https://lux-furniture-demo.netlify.app/"
      />

      {/* Search and Categories Section */}
      <section className="pt-28 pb-12 bg-background">
        <div className="container-luxury">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <form
              onSubmit={handleSearch}
              className="relative max-w-3xl mx-auto"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={t("index.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-6 py-4 pr-12 text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
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
            <h2 className="text-sm uppercase tracking-widest mb-6 text-muted-foreground">
              {t("index.shopByCategory")}
            </h2>
            <div className="overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4 min-w-min">
                {categoryTiles.map((category, index) => (
                  <motion.button
                    key={category.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleCategoryClick(category.label)}
                    className={cn(
                      "flex flex-col items-center justify-center p-0 rounded-2xl transition-all cursor-pointer flex-shrink-0",
                      "w-28 h-28 md:w-32 md:h-32 border-2 font-medium",
                      selectedCategory === category.label || (category.label === "Furniture" && selectedCategory === "All")
                        ? "bg-foreground border-foreground text-background shadow-lg"
                        : "bg-background border-border hover:border-foreground hover:shadow-md",
                      "group"
                    )}
                  >
                    <div className="text-center px-2">
                      <p className="text-sm md:text-base font-semibold leading-snug tracking-tight">
                        {t(`index.${category.key}`)}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="section-padding">
        <div className="container-luxury">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12 pb-8 border-b border-border">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border transition-colors",
                  showFilters ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground"
                )}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm uppercase tracking-wider">{t("catalog.filters")}</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-5 h-5 bg-foreground text-background text-xs flex items-center justify-center rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  {t("catalog.clearAll")}
                </button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? t("catalog.product") : t("catalog.products")}
            </p>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 pb-12 border-b border-border"
            >
              {/* Category Filter */}
              <div className="mb-12">
                <h3 className="text-sm uppercase tracking-widest mb-6 text-muted-foreground">{t("catalog.category")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "flex items-center justify-center p-0 rounded-2xl transition-all cursor-pointer",
                        "w-full aspect-square border-2 font-medium text-sm",
                        selectedCategory === category
                          ? "bg-foreground border-foreground text-background shadow-lg"
                          : "bg-background border-border hover:border-foreground hover:shadow-md"
                      )}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-12">
                <h3 className="text-sm uppercase tracking-widest mb-6 text-muted-foreground">{t("catalog.price")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {priceRanges.map((range) => (
                    <motion.button
                      key={range.label}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setSelectedPriceRange(range)}
                      className={cn(
                        "flex items-center justify-center p-4 rounded-2xl transition-all cursor-pointer",
                        "w-full aspect-square border-2 font-medium text-xs text-center",
                        selectedPriceRange.label === range.label
                          ? "bg-foreground border-foreground text-background shadow-lg"
                          : "bg-background border-border hover:border-foreground hover:shadow-md"
                      )}
                    >
                      {range.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div className="mb-12">
                <h3 className="text-sm uppercase tracking-widest mb-6 text-muted-foreground">{t("catalog.material")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                  {materials.map((material) => (
                    <motion.button
                      key={material}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setSelectedMaterial(material)}
                      className={cn(
                        "flex items-center justify-center p-4 rounded-2xl transition-all cursor-pointer",
                        "w-full aspect-square border-2 font-medium text-xs text-center",
                        selectedMaterial === material
                          ? "bg-foreground border-foreground text-background shadow-lg"
                          : "bg-background border-border hover:border-foreground hover:shadow-md"
                      )}
                    >
                      {material}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Style Filter */}
              <div>
                <h3 className="text-sm uppercase tracking-widest mb-6 text-muted-foreground">{t("catalog.style")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {styles.map((style) => (
                    <motion.button
                      key={style}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setSelectedStyle(style)}
                      className={cn(
                        "flex items-center justify-center p-0 rounded-2xl transition-all cursor-pointer",
                        "w-full aspect-square border-2 font-medium text-sm",
                        selectedStyle === style
                          ? "bg-foreground border-foreground text-background shadow-lg"
                          : "bg-background border-border hover:border-foreground hover:shadow-md"
                      )}
                    >
                      {style}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  slug={product.slug}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">{t("catalog.noProducts")}</p>
              <button
                onClick={clearFilters}
                className="text-sm underline hover:no-underline"
              >
                {t("catalog.clearAll")}
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
