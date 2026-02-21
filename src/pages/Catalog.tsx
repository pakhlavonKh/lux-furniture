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
import { getCatalogProducts } from "@/data/catalogData";

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
  const products = getCatalogProducts();

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
          <div className="categories-scroll">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="category-card"
              >
                <img
                  src={cat.image}
                  alt={t(`categories.${cat.key}`)}
                  className="category-card__image"
                />

                <span className="category-card__title">
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
                className="product-card"
              >
                <div className="product-card__image-wrap">
                  <img
                    src={product.image}
                    alt={t(product.translationKeys.title)}
                    className="product-card__image"
                  />
                </div>

                <div className="product-card__title">
                  {t(product.translationKeys.title)}
                </div>

                <div className="product-card__price">
                  €{product.basePrice.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
