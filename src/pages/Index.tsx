// index.tsx
import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Collections } from "@/components/home/Collections";
import { News } from "@/components/home/News";
import { Discounts } from "@/components/home/Discounts";
import { SEO } from "@/components/SEO";
import { getCollections } from "@/data/catalogData";

// Import images
import heroImage from "@/assets/hero-living-room.jpg";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";
import armchairImage from "@/assets/product-armchair.jpg";
import diningTableImage from "@/assets/product-dining-table.jpg";
import lampImage from "@/assets/product-lamp.jpg";

// Sample featured products
const featuredProducts = [
  {
    id: "1",
    title: "Aria Lounge Chair",
    slug: "aria-lounge-chair",
    price: 3450,
    image: armchairImage,
    category: "Seating",
  },
  {
    id: "2",
    title: "Tavola Dining Table",
    slug: "tavola-dining-table",
    price: 8900,
    image: diningTableImage,
    category: "Dining",
  },
  {
    id: "3",
    title: "Luce Floor Lamp",
    slug: "luce-floor-lamp",
    price: 1850,
    image: lampImage,
    category: "Lighting",
  },
];

const Index = () => {
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
