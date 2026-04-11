// index.tsx
import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Collections } from "@/components/home/Collections";
import { News } from "@/components/home/News";
import { Discounts } from "@/components/home/Discounts";
import { SEO } from "@/components/SEO";
import { getCollections } from "@/data/catalogData";
import { useApiProducts, getApiImageUrl } from "@/hooks/useApiProducts";
import { useLanguage } from "@/contexts/useLanguageHook";

// Import images
import heroImage from "@/assets/hero-living-room.jpg";

const Index = () => {
  const { products } = useApiProducts();
  const { language } = useLanguage();
  const collections = getCollections().slice(0, 2);

  const featuredProducts = useMemo(() => {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((p) => ({
      id: p._id || p.slug,
      title: p.name?.[language] || p.name?.en || p.slug,
      slug: p.slug,
      price: p.basePrice,
      image: getApiImageUrl(p),
      category: p.category,
    }));
  }, [products, language]);
  
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
