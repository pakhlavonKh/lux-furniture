import React from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

// Images for categories
import kitchenImg from "@/assets/product-dining-table.jpg";
import gardenImg from "@/assets/collection-living.jpg";
import officeImg from "@/assets/product-armchair.jpg";
import childrenImg from "@/assets/product-bed.jpg";
import shelvingImg from "@/assets/product-console.jpg";
import industrialImg from "@/assets/product-sofa.jpg";
import accessoriesImg from "@/assets/product-lamp.jpg";

const categories = [
  {
    key: "kitchen",
    label: "Kitchen furniture",
    image: kitchenImg,
  },
  {
    key: "garden",
    label: "Garden furniture",
    image: gardenImg,
  },
  {
    key: "office",
    label: "Office furniture",
    image: officeImg,
  },
  {
    key: "children",
    label: "Children's furniture",
    image: childrenImg,
  },
  {
    key: "shelving",
    label: "Shelving",
    image: shelvingImg,
  },
  {
    key: "industrial",
    label: "Industrial furniture",
    image: industrialImg,
  },
  {
    key: "accessories",
    label: "Interior accessories",
    image: accessoriesImg,
  },
];

const CatalogCategories = () => {
  return (
    <Layout>
      <SEO title="Catalog | Lux Furniture" description="Browse furniture categories" url="https://lux-furniture-demo.netlify.app/catalog-categories" />
      <section className="pt-28 pb-12 bg-background border-b border-neutral-200">
        <div className="container-luxury">
          <div className="flex flex-col items-center mb-10">
            <img src="/manaku_logo.png" alt="Logo" className="h-12 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Catalog</h1>
            <p className="text-muted-foreground text-lg">Choose a furniture category</p>
          </div>
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-6 min-w-min justify-center">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 w-40 h-48 cursor-pointer border border-neutral-200 hover:border-foreground transition-all"
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-24 h-24 object-contain mb-3 rounded"
                  />
                  <span className="text-center text-base font-medium text-foreground mt-auto">
                    {cat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CatalogCategories;
