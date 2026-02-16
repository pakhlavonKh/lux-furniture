import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/useLanguageHook";
import kitchenImg from "@/assets/product-dining-table.jpg";
import gardenImg from "@/assets/collection-living.jpg";
import officeImg from "@/assets/product-armchair.jpg";
import childrenImg from "@/assets/product-bed.jpg";
import shelvingImg from "@/assets/product-console.jpg";
import industrialImg from "@/assets/product-sofa.jpg";
import accessoriesImg from "@/assets/product-lamp.jpg";
import { products } from "@/data/catalogProducts";

const categories = [
  { key: "storage", image: shelvingImg },
  { key: "kitchen", image: kitchenImg },
  { key: "garden", image: gardenImg },
  { key: "office", image: officeImg },
  { key: "children", image: childrenImg },
  { key: "industrial", image: industrialImg },
  { key: "accessories", image: accessoriesImg },
];

export default function Catalog() {
  const { t } = useLanguage();

  return (
    <Layout>
      <SEO
        title={t("catalog.seo.title")}
        description={t("catalog.seo.description")}
        url="https://lux-furniture-demo.netlify.app/catalog"
      />

      {/* Categories Section */}
      <section className="pt-28 pb-8 bg-background border-b border-neutral-200">
        <div className="container-luxury">
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="flex flex-col items-center bg-white rounded-xl shadow p-3 w-36 min-w-[9rem] cursor-pointer border border-neutral-200 hover:border-foreground transition-all"
              >
                <img
                  src={cat.image}
                  alt={t(`categories.${cat.key}`)}
                  style={{
                    width: "96px",
                    height: "96px",
                    objectFit: "contain",
                    marginBottom: "0.75rem",
                    borderRadius: "0.5rem",
                  }}
                />

                <span className="text-center text-base font-medium text-foreground mt-auto">
                  {t(`categories.${cat.key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-12 bg-background">
        <div className="container-luxury">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            {t("catalog.allProducts")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-neutral-200 hover:border-foreground transition-all"
              >
                <div className="w-full aspect-square mb-4 rounded overflow-hidden flex items-center justify-center bg-neutral-100">
                  <img
                    src={product.image}
                    alt={t(`products.${product.id}.name`)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-lg font-medium text-foreground mb-2 text-center">
                  {t(`products.${product.id}.name`)}
                </div>

                <div className="text-primary font-semibold text-base">
                  {product.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}