import React from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

import {
  StorageIcon,
  KitchenIcon,
  GardenIcon,
  OfficeIcon,
  ChildrenIcon,
  IndustrialIcon,
  AccessoriesIcon,
} from "@/components/icons/CategoryIcons";

type Category = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const categories: Category[] = [
  {
    key: "storage",
    label: "Storage systems",
    icon: StorageIcon,
  },
  {
    key: "kitchen",
    label: "Kitchen furniture",
    icon: KitchenIcon,
  },
  {
    key: "garden",
    label: "Garden furniture",
    icon: GardenIcon,
  },
  {
    key: "office",
    label: "Office furniture",
    icon: OfficeIcon,
  },
  {
    key: "children",
    label: "Children's furniture",
    icon: ChildrenIcon,
  },
  {
    key: "industrial",
    label: "Industrial furniture",
    icon: IndustrialIcon,
  },
  {
    key: "accessories",
    label: "Interior accessories",
    icon: AccessoriesIcon,
  },
];

const CatalogCategories = () => {
  return (
    <Layout>
      <SEO
        title="Catalog | Lux Furniture"
        description="Browse furniture categories"
        url="https://lux-furniture-demo.netlify.app/catalog-categories"
      />

      <section className="pt-28 pb-12 bg-background border-b border-neutral-200">
        <div className="container-luxury">

          {/* Header */}
          <div className="flex flex-col items-center mb-12">
            <img src="/manaku_logo.png" alt="Logo" className="h-12 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Catalog</h1>
            <p className="text-muted-foreground text-lg">
              Choose a furniture category
            </p>
          </div>

          {/* Categories */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-8 min-w-min justify-center">

              {categories.map((cat, idx) => {
                const Icon = cat.icon;

                return (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + idx * 0.05,
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="
                      flex flex-col items-center
                      w-48 h-60
                      rounded-2xl
                      border border-neutral-200
                      bg-white
                      cursor-pointer
                      transition-all
                      hover:border-neutral-400
                    "
                  >
                    {/* Icon block */}
                    <div className="flex items-center justify-center h-36 w-full">
                      <Icon className="w-20 h-20 text-neutral-800" />
                    </div>

                    {/* Label */}
                    <span className="text-center text-base font-medium text-foreground px-4 pb-6">
                      {cat.label}
                    </span>
                  </motion.div>
                );
              })}

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CatalogCategories;