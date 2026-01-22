import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";
import { Filter, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const priceMatch = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
      const materialMatch = selectedMaterial === "All" || product.material === selectedMaterial;
      const styleMatch = selectedStyle === "All" || product.style === selectedStyle;

      return categoryMatch && priceMatch && materialMatch && styleMatch;
    });
  }, [selectedCategory, selectedPriceRange, selectedMaterial, selectedStyle]);

  const activeFiltersCount = [
    selectedCategory !== "All",
    selectedPriceRange.label !== "All Prices",
    selectedMaterial !== "All",
    selectedStyle !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedPriceRange(priceRanges[0]);
    setSelectedMaterial("All");
    setSelectedStyle("All");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-caption mb-4">Our Collection</p>
            <h1 className="heading-display mb-6">Catalog</h1>
            <p className="text-body text-lg">
              Explore our curated selection of furniture pieces, each designed to
              bring timeless elegance to your space.
            </p>
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
                <span className="text-sm uppercase tracking-wider">Filters</span>
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
                  Clear all
                </button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 pb-12 border-b border-border"
            >
              {/* Category Filter */}
              <div>
                <h3 className="text-caption mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "block text-sm transition-colors",
                        selectedCategory === category
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-caption mb-4">Price</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range)}
                      className={cn(
                        "block text-sm transition-colors",
                        selectedPriceRange.label === range.label
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div>
                <h3 className="text-caption mb-4">Material</h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <button
                      key={material}
                      onClick={() => setSelectedMaterial(material)}
                      className={cn(
                        "block text-sm transition-colors",
                        selectedMaterial === material
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Filter */}
              <div>
                <h3 className="text-caption mb-4">Style</h3>
                <div className="space-y-2">
                  {styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={cn(
                        "block text-sm transition-colors",
                        selectedStyle === style
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {style}
                    </button>
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
              <p className="text-muted-foreground mb-4">No products match your filters.</p>
              <button
                onClick={clearFilters}
                className="text-sm underline hover:no-underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
