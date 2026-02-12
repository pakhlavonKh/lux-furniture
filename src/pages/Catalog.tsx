
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import kitchenImg from "@/assets/product-dining-table.jpg";
import gardenImg from "@/assets/collection-living.jpg";
import officeImg from "@/assets/product-armchair.jpg";
import childrenImg from "@/assets/product-bed.jpg";
import shelvingImg from "@/assets/product-console.jpg";
import industrialImg from "@/assets/product-sofa.jpg";
import accessoriesImg from "@/assets/product-lamp.jpg";

const categories = [
  { key: "storage", label: "Shelving", image: shelvingImg },
  { key: "kitchen", label: "Kitchen furniture", image: kitchenImg },
  { key: "garden", label: "Garden furniture", image: gardenImg },
  { key: "office", label: "Office furniture", image: officeImg },
  { key: "children", label: "Children's furniture", image: childrenImg },
  { key: "industrial", label: "Industrial furniture", image: industrialImg },
  { key: "accessories", label: "Interior accessories", image: accessoriesImg },
];

export default function Catalog() {
  return (
    <Layout>
      <SEO title="Catalog | Lux Furniture" description="Browse furniture categories" url="https://lux-furniture-demo.netlify.app/catalog" />
      <section className="pt-28 pb-8 bg-background border-b border-neutral-200">
        <div className="container-luxury">
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="flex flex-col items-center bg-white rounded-xl shadow p-3 w-36 min-w-[9rem] cursor-pointer border border-neutral-200 hover:border-foreground transition-all"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    style={{ width: '96px', height: '96px', objectFit: 'contain', marginBottom: '0.75rem', borderRadius: '0.5rem' }}
                  />
                ) : null}
                <span className="text-center text-base font-medium text-foreground mt-auto">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
