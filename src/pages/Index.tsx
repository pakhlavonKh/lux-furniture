// index.tsx
import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Collections } from "@/components/home/Collections";
import { News } from "@/components/home/News";
import { Discounts } from "@/components/home/Discounts";
import { SEO } from "@/components/SEO";
import { getCollections, getProducts, getImageUrl } from "@/data/catalogData";

// Import images
import heroImage from "@/assets/hero-living-room.jpg";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";

// Helper function to get random products from catalog
function getRandomFeaturedProducts(count: number = 3) {
  const allProducts = getProducts();
  
  // Shuffle array and select random items
  const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Transform to FeaturedProducts format
  return selected.map((product) => ({
    id: product.id,
    title: product.slug
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    slug: product.slug,
    price: product.basePrice,
    image: getImageUrl(product.images[0] || ""),
    category: product.categoryId,
  }));
}

const Index = () => {
  const featuredProducts = getRandomFeaturedProducts(3);
  const collections = getCollections().slice(0, 2);
  
  return (
    <>
      <SEO
        title="Manaku | Premium Furniture Collection"
        description="Exclusive luxury furniture collection. Handcrafted pieces for refined living spaces. Discover exceptional design and uncompromising quality."
        url="https://lux-furniture-demo.netlify.app/"
      />
      <Layout>
        <Hero heroImage={heroImage} />
        <Discounts />
        <FeaturedProducts products={featuredProducts} />
        <News />
        <Collections collections={collections} />
      </Layout>
    </>
  );
};

export default Index;
