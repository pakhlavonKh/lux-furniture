// index.tsx
import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Philosophy } from "@/components/home/Philosophy";
import { Collections } from "@/components/home/Collections";

// Import images
import heroImage from "@/assets/hero-living-room.jpg";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";
import armchairImage from "@/assets/product-armchair.jpg";
import diningTableImage from "@/assets/product-dining-table.jpg";
import lampImage from "@/assets/product-lamp.jpg";
import collectionLivingImage from "@/assets/collection-living.jpg";
import collectionBedroomImage from "@/assets/collection-bedroom.jpg";

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

// Sample collections
const collections = [
  {
    id: "1",
    key: "living",
    slug: "living-collection",
    image: collectionLivingImage,
  },
  {
    id: "2",
    key: "bedroom",
    slug: "bedroom-collection",
    image: collectionBedroomImage,
  },
];

const Index = () => {
  return (
    <Layout>
      <Hero heroImage={heroImage} />
      <FeaturedProducts products={featuredProducts} />
      <Philosophy image={craftsmanshipImage} />
      <Collections collections={collections} />
    </Layout>
  );
};

export default Index;
