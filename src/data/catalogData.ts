// CatalogData.ts
import armchairImage from "@/assets/product-armchair.jpg";
import diningTableImage from "@/assets/product-dining-table.jpg";
import lampImage from "@/assets/product-lamp.jpg";
import shelvingImg from "@/assets/product-console.jpg";
import kitchenImg from "@/assets/product-dining-table.jpg";
import gardenImg from "@/assets/collection-living.jpg";
import officeImg from "@/assets/product-armchair.jpg";
import childrenImg from "@/assets/product-bed.jpg";
import industrialImg from "@/assets/product-sofa.jpg";
import accessoriesImg from "@/assets/product-lamp.jpg";

const CATALOG_STOCK_KEY = "catalogStockState";

// ============ IMAGE LOADING ============
interface ImageSources {
  webp?: string;
  fallback: string;
}

// Glob all images from assets folder and subfolders
const itemsImg = import.meta.glob("../assets/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
}) as Record<string, { default: string }>;

/**
 * Find and return image sources by basename
 * Automatically searches through all assets subfolders
 * @param basename - Image filename without extension (e.g., "aria-lounge" or with extension "aria-lounge.jpg")
 * @returns ImageSources with webp and fallback paths
 * @example
 * const images = getImageSources("aria-lounge");
 * const images = getImageSources("product-lamp.jpg");
 */
export function getImageSources(basename: string): ImageSources {
  if (!basename) return { webp: undefined, fallback: "" };

  // Remove extension if provided
  const nameWithoutExt = basename.replace(/\.(webp|jpg|jpeg|png)$/i, "");

  // Search through all loaded images to find matching basename
  let webp: string | undefined;
  let fallback: string | undefined;

  for (const [path, module] of Object.entries(itemsImg)) {
    const imageUrl = module.default;

    // Extract filename from path
    const filename = path.split("/").pop() || "";
    const filenameWithoutExt = filename.replace(/\.(webp|jpg|jpeg|png)$/i, "");

    // Match based on basename (case-insensitive)
    if (filenameWithoutExt.toLowerCase() === nameWithoutExt.toLowerCase()) {
      if (filename.endsWith(".webp")) {
        webp = imageUrl;
      } else if (
        filename.endsWith(".jpg") ||
        filename.endsWith(".jpeg") ||
        filename.endsWith(".png")
      ) {
        fallback = imageUrl;
      }
    }
  }

  return {
    webp,
    fallback: fallback || webp || "",
  };
}

/**
 * Get the fallback image URL for a product
 * Use this directly in img src when you have a product image name
 * @param imageName - Image filename without extension
 * @returns The image URL or empty string if not found
 * @example
 * <img src={getImageUrl("Art_0002")} alt="product" />
 */
export function getImageUrl(imageName: string): string {
  return getImageSources(imageName).fallback;
}

// ============ TYPES ============
export interface ProductVariant {
  id: string;
  color?: string;
  size?: string;
  material?: string;
  price?: number; // Override basePrice if set
  image?: string; // Optional image override
}

export interface CatalogProduct {
  id: string;
  slug: string;
  categoryId: string;
  subcategoryId?: string; // Optional subcategory
  collectionIds?: string[];
  color?: string; // Optional color for filtering
  size?: string; // Optional size for filtering
  sizes?: string[]; // Multiple sizes if applicable
  colors?: string[]; // Multiple colors if applicable
  material?: string; // Optional material for filtering
  images: string[]; // Main product images
  nameKey: string;
  descriptionKey?: string;
  shortDescriptionKey?: string;
  basePrice: number; // Default fallback price
  variants?: ProductVariant[];
  ikpuCode?: string; // Default IKPU code
  packageCode?: string; // Default package code
  vatPercent?: number; // VAT percentage (default 12%)
}

export interface CatalogCategory {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  image?: string;
  displayOrder: number;
}

export interface CatalogCollection {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  image: string;
  displayOrder: number;
}

export interface CatalogSubcategory {
  id: string;
  slug: string;
  categoryId: string;
  nameKey: string;
  descriptionKey?: string;
  image?: string;
  displayOrder: number;
}

// ============ STOCK MANAGEMENT ============
interface StockState {
  variantStock: Record<string, number>;
  lastUpdated: number;
}

// ============ DATA TEMPLATES ============
const categories: CatalogCategory[] = [
  {
    id: "storage",
    slug: "storage",
    nameKey: "categories.storage",
    descriptionKey: "categories.storage.description",
    image: shelvingImg,
    displayOrder: 1,
  },
  {
    id: "kitchen",
    slug: "kitchen",
    nameKey: "categories.kitchen",
    descriptionKey: "categories.kitchen.description",
    image: kitchenImg,
    displayOrder: 2,
  },
  {
    id: "garden",
    slug: "garden",
    nameKey: "categories.garden",
    descriptionKey: "categories.garden.description",
    image: gardenImg,
    displayOrder: 3,
  },
  {
    id: "office",
    slug: "office",
    nameKey: "categories.office",
    descriptionKey: "categories.office.description",
    image: officeImg,
    displayOrder: 4,
  },
  {
    id: "children",
    slug: "children",
    nameKey: "categories.children",
    descriptionKey: "categories.children.description",
    image: childrenImg,
    displayOrder: 5,
  },
  {
    id: "industrial",
    slug: "industrial",
    nameKey: "categories.industrial",
    descriptionKey: "categories.industrial.description",
    image: industrialImg,
    displayOrder: 6,
  },
  {
    id: "accessories",
    slug: "accessories",
    nameKey: "categories.accessories",
    descriptionKey: "categories.accessories.description",
    image: accessoriesImg,
    displayOrder: 7,
  },
];

const collections: CatalogCollection[] = [
  {
    id: "artVision",
    slug: "artVision",
    nameKey: "collections.items.artVision.name",
    descriptionKey: "collections.items.artVision.description",
    image: armchairImage,
    displayOrder: 1,
  },
  {
    id: "drive",
    slug: "drive",
    nameKey: "collections.items.drive.name",
    descriptionKey: "collections.items.drive.description",
    image: diningTableImage,
    displayOrder: 2,
  },
  {
    id: "genesis",
    slug: "genesis",
    nameKey: "collections.items.genesis.name",
    descriptionKey: "collections.items.genesis.description",
    image: lampImage,
    displayOrder: 3,
  },
  {
    id: "alto",
    slug: "alto",
    nameKey: "collections.items.alto.name",
    descriptionKey: "collections.items.alto.description",
    image: officeImg,
    displayOrder: 4,
  },
  {
    id: "metar",
    slug: "metar",
    nameKey: "collections.items.metar.name",
    descriptionKey: "collections.items.metar.description",
    image: kitchenImg,
    displayOrder: 5,
  },
  {
    id: "negoziatore",
    slug: "negoziatore",
    nameKey: "collections.items.negoziatore.name",
    descriptionKey: "collections.items.negoziatore.description",
    image: gardenImg,
    displayOrder: 6,
  },
  {
    id: "vesta",
    slug: "vesta",
    nameKey: "collections.items.vesta.name",
    descriptionKey: "collections.items.vesta.description",
    image: diningTableImage,
    displayOrder: 7,
  },
  {
    id: "altagama",
    slug: "altagama",
    nameKey: "collections.items.altagama.name",
    descriptionKey: "collections.items.altagama.description",
    image: diningTableImage,
    displayOrder: 8,
  },
  {
    id: "goliath",
    slug: "goliath",
    nameKey: "collections.items.goliath.name",
    descriptionKey: "collections.items.goliath.description",
    image: officeImg,
    displayOrder: 9,
  },
];

// ============ SUBCATEGORIES ============
const subcategories: CatalogSubcategory[] = [
  // Storage subcategories
  {
    id: "wardrobes",
    slug: "wardrobes",
    categoryId: "storage",
    nameKey: "subcategories.wardrobes",
    descriptionKey: "subcategories.wardrobes.description",
    image: shelvingImg,
    displayOrder: 1,
  },
  {
    id: "cabinets",
    slug: "cabinets",
    categoryId: "storage",
    nameKey: "subcategories.cabinets",
    descriptionKey: "subcategories.cabinets.description",
    image: shelvingImg,
    displayOrder: 2,
  },
  {
    id: "dressers",
    slug: "dressers",
    categoryId: "storage",
    nameKey: "subcategories.dressers",
    descriptionKey: "subcategories.dressers.description",
    image: shelvingImg,
    displayOrder: 3,
  },
  {
    id: "shelving-units",
    slug: "shelving-units",
    categoryId: "storage",
    nameKey: "subcategories.shelving-units",
    descriptionKey: "subcategories.shelving-units.description",
    image: shelvingImg,
    displayOrder: 4,
  },
  {
    id: "sideboards",
    slug: "sideboards",
    categoryId: "storage",
    nameKey: "subcategories.sideboards",
    descriptionKey: "subcategories.sideboards.description",
    image: shelvingImg,
    displayOrder: 5,
  },
  // Kitchen subcategories
  {
    id: "dining-tables",
    slug: "dining-tables",
    categoryId: "kitchen",
    nameKey: "subcategories.dining-tables",
    descriptionKey: "subcategories.dining-tables.description",
    image: kitchenImg,
    displayOrder: 1,
  },
  {
    id: "dining-chairs",
    slug: "dining-chairs",
    categoryId: "kitchen",
    nameKey: "subcategories.dining-chairs",
    descriptionKey: "subcategories.dining-chairs.description",
    image: kitchenImg,
    displayOrder: 2,
  },
  {
    id: "bar-stools",
    slug: "bar-stools",
    categoryId: "kitchen",
    nameKey: "subcategories.bar-stools",
    descriptionKey: "subcategories.bar-stools.description",
    image: kitchenImg,
    displayOrder: 3,
  },
  {
    id: "kitchen-islands",
    slug: "kitchen-islands",
    categoryId: "kitchen",
    nameKey: "subcategories.kitchen-islands",
    descriptionKey: "subcategories.kitchen-islands.description",
    image: kitchenImg,
    displayOrder: 4,
  },
  {
    id: "buffets",
    slug: "buffets",
    categoryId: "kitchen",
    nameKey: "subcategories.buffets",
    descriptionKey: "subcategories.buffets.description",
    image: kitchenImg,
    displayOrder: 5,
  },
  // Garden subcategories
  {
    id: "outdoor-tables",
    slug: "outdoor-tables",
    categoryId: "garden",
    nameKey: "subcategories.outdoor-tables",
    descriptionKey: "subcategories.outdoor-tables.description",
    image: gardenImg,
    displayOrder: 1,
  },
  {
    id: "outdoor-chairs",
    slug: "outdoor-chairs",
    categoryId: "garden",
    nameKey: "subcategories.outdoor-chairs",
    descriptionKey: "subcategories.outdoor-chairs.description",
    image: gardenImg,
    displayOrder: 2,
  },
  {
    id: "lounge-sets",
    slug: "lounge-sets",
    categoryId: "garden",
    nameKey: "subcategories.lounge-sets",
    descriptionKey: "subcategories.lounge-sets.description",
    image: gardenImg,
    displayOrder: 3,
  },
  {
    id: "sunbeds",
    slug: "sunbeds",
    categoryId: "garden",
    nameKey: "subcategories.sunbeds",
    descriptionKey: "subcategories.sunbeds.description",
    image: gardenImg,
    displayOrder: 4,
  },
  // Office subcategories
  {
    id: "office-desks",
    slug: "office-desks",
    categoryId: "office",
    nameKey: "subcategories.office-desks",
    descriptionKey: "subcategories.office-desks.description",
    image: officeImg,
    displayOrder: 1,
  },
  {
    id: "office-chairs",
    slug: "office-chairs",
    categoryId: "office",
    nameKey: "subcategories.office-chairs",
    descriptionKey: "subcategories.office-chairs.description",
    image: officeImg,
    displayOrder: 2,
  },
  {
    id: "bookcases",
    slug: "bookcases",
    categoryId: "office",
    nameKey: "subcategories.bookcases",
    descriptionKey: "subcategories.bookcases.description",
    image: officeImg,
    displayOrder: 3,
  },
  {
    id: "filing-cabinets",
    slug: "filing-cabinets",
    categoryId: "office",
    nameKey: "subcategories.filing-cabinets",
    descriptionKey: "subcategories.filing-cabinets.description",
    image: officeImg,
    displayOrder: 4,
  },
  // Children subcategories
  {
    id: "kids-beds",
    slug: "kids-beds",
    categoryId: "children",
    nameKey: "subcategories.kids-beds",
    descriptionKey: "subcategories.kids-beds.description",
    image: childrenImg,
    displayOrder: 1,
  },
  {
    id: "study-desks",
    slug: "study-desks",
    categoryId: "children",
    nameKey: "subcategories.study-desks",
    descriptionKey: "subcategories.study-desks.description",
    image: childrenImg,
    displayOrder: 2,
  },
  {
    id: "kids-wardrobes",
    slug: "kids-wardrobes",
    categoryId: "children",
    nameKey: "subcategories.kids-wardrobes",
    descriptionKey: "subcategories.kids-wardrobes.description",
    image: childrenImg,
    displayOrder: 3,
  },
  {
    id: "toy-storage",
    slug: "toy-storage",
    categoryId: "children",
    nameKey: "subcategories.toy-storage",
    descriptionKey: "subcategories.toy-storage.description",
    image: childrenImg,
    displayOrder: 4,
  },
  // Industrial subcategories
  {
    id: "metal-tables",
    slug: "metal-tables",
    categoryId: "industrial",
    nameKey: "subcategories.metal-tables",
    descriptionKey: "subcategories.metal-tables.description",
    image: industrialImg,
    displayOrder: 1,
  },
  {
    id: "loft-shelving",
    slug: "loft-shelving",
    categoryId: "industrial",
    nameKey: "subcategories.loft-shelving",
    descriptionKey: "subcategories.loft-shelving.description",
    image: industrialImg,
    displayOrder: 2,
  },
  {
    id: "industrial-cabinets",
    slug: "industrial-cabinets",
    categoryId: "industrial",
    nameKey: "subcategories.industrial-cabinets",
    descriptionKey: "subcategories.industrial-cabinets.description",
    image: industrialImg,
    displayOrder: 3,
  },
  {
    id: "factory-style-desks",
    slug: "factory-style-desks",
    categoryId: "industrial",
    nameKey: "subcategories.factory-style-desks",
    descriptionKey: "subcategories.factory-style-desks.description",
    image: industrialImg,
    displayOrder: 4,
  },
  // Accessories subcategories
  {
    id: "lamps",
    slug: "lamps",
    categoryId: "accessories",
    nameKey: "subcategories.lamps",
    descriptionKey: "subcategories.lamps.description",
    image: accessoriesImg,
    displayOrder: 1,
  },
  {
    id: "rugs",
    slug: "rugs",
    categoryId: "accessories",
    nameKey: "subcategories.rugs",
    descriptionKey: "subcategories.rugs.description",
    image: accessoriesImg,
    displayOrder: 2,
  },
  {
    id: "mirrors",
    slug: "mirrors",
    categoryId: "accessories",
    nameKey: "subcategories.mirrors",
    descriptionKey: "subcategories.mirrors.description",
    image: accessoriesImg,
    displayOrder: 3,
  },
  {
    id: "wall-decor",
    slug: "wall-decor",
    categoryId: "accessories",
    nameKey: "subcategories.wall-decor",
    descriptionKey: "subcategories.wall-decor.description",
    image: accessoriesImg,
    displayOrder: 4,
  },
  {
    id: "vases",
    slug: "vases",
    categoryId: "accessories",
    nameKey: "subcategories.vases",
    descriptionKey: "subcategories.vases.description",
    image: accessoriesImg,
    displayOrder: 5,
  },
];

const products: CatalogProduct[] = [
  {
    id: "1",
    slug: "art_0",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["artVision"],
    images: ["Art2_0001"],
    nameKey: "products.catalog.items.1.name",
    descriptionKey: "products.catalog.items.1.description",
    shortDescriptionKey: "products.catalog.items.1.shortDescription",
    basePrice: 2450,
    ikpuCode: "507144100000003",
    packageCode: "PKG-STO-001",
    vatPercent: 12,
  },
  {
    id: "2",
    slug: "art_1",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["artVision"],
    images: ["Art2_0000"],
    nameKey: "products.catalog.items.2.name",
    descriptionKey: "products.catalog.items.2.description",
    shortDescriptionKey: "products.catalog.items.2.shortDescription",
    basePrice: 2450,
    ikpuCode: "507144100000004",
    packageCode: "PKG-STO-002",
    vatPercent: 12,
  },
  {
    id: "3",
    slug: "art_2",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["artVision"],
    images: ["Art_0002"],
    nameKey: "products.catalog.items.3.name",
    descriptionKey: "products.catalog.items.3.description",
    shortDescriptionKey: "products.catalog.items.3.shortDescription",
    basePrice: 3450,
    ikpuCode: "",
    packageCode: "PKG-ALC-001",
    vatPercent: 12,
  },
  {
    id: "4",
    slug: "Art_3",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["artVision"],
    images: ["Art_0003", "Art_03_2", "Art_03"],
    nameKey: "products.catalog.items.4.name",
    descriptionKey: "products.catalog.items.4.description",
    shortDescriptionKey: "products.catalog.items.4.shortDescription",
    basePrice: 8900,
    ikpuCode: "507144100000004",
    packageCode: "PKG-DT-002",
    vatPercent: 12,
  },
  {
    id: "5",
    slug: "Art_4",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["artVision"],
    images: ["Art_0004", "Art_04"],
    nameKey: "products.catalog.items.5.name",
    descriptionKey: "products.catalog.items.5.description",
    shortDescriptionKey: "products.catalog.items.5.shortDescription",
    basePrice: 1850,
    ikpuCode: "507144100000006",
    packageCode: "PKG-LAMP-003",
    vatPercent: 12,
  },
  {
    id: "6",
    slug: "Art_5",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["artVision"],
    images: ["Art2_0025", "Art2_0026", "Art_05_2", "Art_05"],
    nameKey: "products.catalog.items.6.name",
    descriptionKey: "products.catalog.items.6.description",
    shortDescriptionKey: "products.catalog.items.6.shortDescription",
    basePrice: 2450,
    ikpuCode: "507144100000007",
    packageCode: "PKG-STO-004",
    vatPercent: 12,
  },
  {
    id: "7",
    slug: "Art_7",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["artVision"],
    images: ["Art2_0017", "Art_07"],
    nameKey: "products.catalog.items.7.name",
    descriptionKey: "products.catalog.items.7.description",
    shortDescriptionKey: "products.catalog.items.7.shortDescription",
    basePrice: 2950,
    ikpuCode: "507144100000008",
    packageCode: "PKG-STO-005",
    vatPercent: 12,
  },
  {
    id: "8",
    slug: "Art_8",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["artVision"],
    images: ["Art_0008", "Art_0011", "Art_08_3"],
    nameKey: "products.catalog.items.8.name",
    descriptionKey: "products.catalog.items.8.description",
    shortDescriptionKey: "products.catalog.items.8.shortDescription",
    basePrice: 3050,
    ikpuCode: "507144100000009",
    packageCode: "PKG-STO-006",
    vatPercent: 12,
  },
  {
    id: "9",
    slug: "Art_9",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["artVision"],
    images: ["Art_0009", "Art_09_2"],
    nameKey: "products.catalog.items.9.name",
    descriptionKey: "products.catalog.items.9.description",
    shortDescriptionKey: "products.catalog.items.9.shortDescription",
    basePrice: 3250,
    ikpuCode: "507144100000010",
    packageCode: "PKG-STO-007",
    vatPercent: 12,
  },
  {
    id: "10",
    slug: "art_10",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["artVision"],
    images: ["Art_0010", "Art_10_2", "Art_10_2-2"],
    nameKey: "products.catalog.items.10.name",
    descriptionKey: "products.catalog.items.10.description",
    shortDescriptionKey: "products.catalog.items.10.shortDescription",
    basePrice: 3350,
    ikpuCode: "507144100000011",
    packageCode: "PKG-STO-008",
    vatPercent: 12,
  },
  {
    id: "11",
    slug: "art_11",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["artVision"],
    images: ["Art_0009"],
    nameKey: "products.catalog.items.11.name",
    descriptionKey: "products.catalog.items.11.description",
    shortDescriptionKey: "products.catalog.items.11.shortDescription",
    basePrice: 3150,
    ikpuCode: "507144100000012",
    packageCode: "PKG-STO-009",
    vatPercent: 12,
  },
  {
    id: "12",
    slug: "art_12",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["artVision"],
    images: ["Art_0012", "Art_0016", "Art_12"],
    nameKey: "products.catalog.items.12.name",
    descriptionKey: "products.catalog.items.12.description",
    shortDescriptionKey: "products.catalog.items.12.shortDescription",
    basePrice: 2750,
    ikpuCode: "507144100000013",
    packageCode: "PKG-LAMP-010",
    vatPercent: 12,
  },
  {
    id: "13",
    slug: "art_13",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["artVision"],
    images: ["Art_0013", "ArtVision13"],
    nameKey: "products.catalog.items.13.name",
    descriptionKey: "products.catalog.items.13.description",
    shortDescriptionKey: "products.catalog.items.13.shortDescription",
    basePrice: 3450,
    ikpuCode: "507144100000014",
    packageCode: "PKG-STO-011",
    vatPercent: 12,
  },
  {
    id: "14",
    slug: "art_14",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["artVision"],
    images: ["Art_0014"],
    nameKey: "products.catalog.items.14.name",
    descriptionKey: "products.catalog.items.14.description",
    shortDescriptionKey: "products.catalog.items.14.shortDescription",
    basePrice: 3550,
    ikpuCode: "507144100000015",
    packageCode: "PKG-STO-012",
    vatPercent: 12,
  },
  {
    id: "15",
    slug: "art_15",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["artVision"],
    images: ["Art_0015"],
    nameKey: "products.catalog.items.15.name",
    descriptionKey: "products.catalog.items.15.description",
    shortDescriptionKey: "products.catalog.items.15.shortDescription",
    basePrice: 3350,
    ikpuCode: "507144100000016",
    packageCode: "PKG-STO-013",
    vatPercent: 12,
  },
  {
    id: "16",
    slug: "art_16",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["artVision"],
    images: ["Art2_0028"],
    nameKey: "products.catalog.items.16.name",
    descriptionKey: "products.catalog.items.16.description",
    shortDescriptionKey: "products.catalog.items.16.shortDescription",
    basePrice: 3250,
    ikpuCode: "507144100000017",
    packageCode: "PKG-STO-014",
    vatPercent: 12,
  },
  {
    id: "17",
    slug: "art_17",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["artVision"],
    images: ["Art_03"],
    nameKey: "products.catalog.items.17.name",
    descriptionKey: "products.catalog.items.17.description",
    shortDescriptionKey: "products.catalog.items.17.shortDescription",
    basePrice: 3150,
    ikpuCode: "507144100000018",
    packageCode: "PKG-STO-015",
    vatPercent: 12,
  },
  {
    id: "18",
    slug: "art_19",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["artVision"],
    images: ["Art2_0019"],
    nameKey: "products.catalog.items.18.name",
    descriptionKey: "products.catalog.items.18.description",
    shortDescriptionKey: "products.catalog.items.18.shortDescription",
    basePrice: 3050,
    ikpuCode: "507144100000019",
    packageCode: "PKG-STO-016",
    vatPercent: 12,
  },
  {
    id: "19",
    slug: "art_25",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["artVision"],
    images: ["Art_0034 (1)"],
    nameKey: "products.catalog.items.19.name",
    descriptionKey: "products.catalog.items.19.description",
    shortDescriptionKey: "products.catalog.items.19.shortDescription",
    basePrice: 2950,
    ikpuCode: "507144100000020",
    packageCode: "PKG-STO-017",
    vatPercent: 12,
  },
  // Drive collection
  {
    id: "20",
    slug: "drive_0",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["Drive_10032"],
    nameKey: "products.catalog.items.20.name",
    descriptionKey: "products.catalog.items.20.description",
    shortDescriptionKey: "products.catalog.items.20.shortDescription",
    basePrice: 4150,
    ikpuCode: "507144100000017",
    packageCode: "PKG-DRIVE-000",
    vatPercent: 12,
  },
  {
    id: "21",
    slug: "drive_1",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["DRV501DX"],
    nameKey: "products.catalog.items.21.name",
    descriptionKey: "products.catalog.items.21.description",
    shortDescriptionKey: "products.catalog.items.21.shortDescription",
    basePrice: 4150,
    ikpuCode: "507144100000017",
    packageCode: "PKG-DRIVE-000",
    vatPercent: 12,
  },
  {
    id: "22",
    slug: "drive_20",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["Drive_30036"],
    nameKey: "products.catalog.items.22.name",
    descriptionKey: "products.catalog.items.22.description",
    shortDescriptionKey: "products.catalog.items.22.shortDescription",
    basePrice: 4150,
    ikpuCode: "507144100000017",
    packageCode: "PKG-DRIVE-000",
    vatPercent: 12,
  },
  {
    id: "23",
    slug: "drive_1",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["Drive_0003"],
    nameKey: "products.catalog.items.23.name",
    descriptionKey: "products.catalog.items.23.description",
    shortDescriptionKey: "products.catalog.items.23.shortDescription",
    basePrice: 4250,
    ikpuCode: "507144100000018",
    packageCode: "PKG-DRIVE-001",
    vatPercent: 12,
  },
  {
    id: "24",
    slug: "drive_2",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["drive"],
    images: ["Drive_0004"],
    nameKey: "products.catalog.items.24.name",
    descriptionKey: "products.catalog.items.24.description",
    shortDescriptionKey: "products.catalog.items.24.shortDescription",
    basePrice: 4350,
    ikpuCode: "507144100000019",
    packageCode: "PKG-DRIVE-002",
    vatPercent: 12,
  },
  {
    id: "25",
    slug: "drive_3",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["Drive_0005"],
    nameKey: "products.catalog.items.25.name",
    descriptionKey: "products.catalog.items.25.description",
    shortDescriptionKey: "products.catalog.items.25.shortDescription",
    basePrice: 4450,
    ikpuCode: "507144100000020",
    packageCode: "PKG-DRIVE-003",
    vatPercent: 12,
  },
  {
    id: "26",
    slug: "drive_4",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["Drive_0007"],
    nameKey: "products.catalog.items.26.name",
    descriptionKey: "products.catalog.items.26.description",
    shortDescriptionKey: "products.catalog.items.26.shortDescription",
    basePrice: 4550,
    ikpuCode: "507144100000021",
    packageCode: "PKG-DRIVE-004",
    vatPercent: 12,
  },
  {
    id: "27",
    slug: "drive_5",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["Drive_0008"],
    nameKey: "products.catalog.items.27.name",
    descriptionKey: "products.catalog.items.27.description",
    shortDescriptionKey: "products.catalog.items.27.shortDescription",
    basePrice: 4650,
    ikpuCode: "507144100000022",
    packageCode: "PKG-DRIVE-005",
    vatPercent: 12,
  },
  {
    id: "28",
    slug: "drive_6",
    categoryId: "office",
    subcategoryId: "office-chairs",
    collectionIds: ["drive"],
    images: ["Drive_0011"],
    nameKey: "products.catalog.items.28.name",
    descriptionKey: "products.catalog.items.28.description",
    shortDescriptionKey: "products.catalog.items.28.shortDescription",
    basePrice: 4750,
    ikpuCode: "507144100000023",
    packageCode: "PKG-DRIVE-006",
    vatPercent: 12,
  },
  {
    id: "29",
    slug: "drive_7",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["drive"],
    images: ["Drive_0012"],
    nameKey: "products.catalog.items.29.name",
    descriptionKey: "products.catalog.items.29.description",
    shortDescriptionKey: "products.catalog.items.29.shortDescription",
    basePrice: 4850,
    ikpuCode: "507144100000024",
    packageCode: "PKG-DRIVE-007",
    vatPercent: 12,
  },
  {
    id: "30",
    slug: "drive_8",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["drive"],
    images: ["Drive_0013-2"],
    nameKey: "products.catalog.items.30.name",
    descriptionKey: "products.catalog.items.30.description",
    shortDescriptionKey: "products.catalog.items.30.shortDescription",
    basePrice: 4950,
    ikpuCode: "507144100000025",
    packageCode: "PKG-DRIVE-008",
    vatPercent: 12,
  },
  {
    id: "31",
    slug: "drive_9",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["drive"],
    images: ["Drive_0014"],
    nameKey: "products.catalog.items.31.name",
    descriptionKey: "products.catalog.items.31.description",
    shortDescriptionKey: "products.catalog.items.31.shortDescription",
    basePrice: 5050,
    ikpuCode: "507144100000026",
    packageCode: "PKG-DRIVE-009",
    vatPercent: 12,
  },
  {
    id: "32",
    slug: "drive_10",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["drive"],
    images: ["Drive_0034"],
    nameKey: "products.catalog.items.32.name",
    descriptionKey: "products.catalog.items.32.description",
    shortDescriptionKey: "products.catalog.items.32.shortDescription",
    basePrice: 5150,
    ikpuCode: "507144100000027",
    packageCode: "PKG-DRIVE-010",
    vatPercent: 12,
  },
  {
    id: "33",
    slug: "drive_11",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["drive"],
    images: ["Drive_0035"],
    nameKey: "products.catalog.items.33.name",
    descriptionKey: "products.catalog.items.33.description",
    shortDescriptionKey: "products.catalog.items.33.shortDescription",
    basePrice: 5250,
    ikpuCode: "507144100000028",
    packageCode: "PKG-DRIVE-011",
    vatPercent: 12,
  },
  {
    id: "34",
    slug: "drive_12",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["drive"],
    images: ["Drive-Design-11"],
    nameKey: "products.catalog.items.34.name",
    descriptionKey: "products.catalog.items.34.description",
    shortDescriptionKey: "products.catalog.items.34.shortDescription",
    basePrice: 5350,
    ikpuCode: "507144100000029",
    packageCode: "PKG-DRIVE-012",
    vatPercent: 12,
  },
  {
    id: "35",
    slug: "drive_13",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["drive"],
    images: ["Drive  Design_0011"],
    nameKey: "products.catalog.items.35.name",
    descriptionKey: "products.catalog.items.35.description",
    shortDescriptionKey: "products.catalog.items.35.shortDescription",
    basePrice: 5450,
    ikpuCode: "507144100000030",
    packageCode: "PKG-DRIVE-013",
    vatPercent: 12,
  },
  {
    id: "36",
    slug: "drive_14",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["drive"],
    images: ["Drive0003"],
    nameKey: "products.catalog.items.36.name",
    descriptionKey: "products.catalog.items.36.description",
    shortDescriptionKey: "products.catalog.items.36.shortDescription",
    basePrice: 5550,
    ikpuCode: "507144100000031",
    packageCode: "PKG-DRIVE-014",
    vatPercent: 12,
  },
  {
    id: "37",
    slug: "drive_15",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["Drive-Design-15"],
    nameKey: "products.catalog.items.37.name",
    descriptionKey: "products.catalog.items.37.description",
    shortDescriptionKey: "products.catalog.items.37.shortDescription",
    basePrice: 5650,
    ikpuCode: "507144100000032",
    packageCode: "PKG-DRIVE-015",
    vatPercent: 12,
  },
  {
    id: "38",
    slug: "drive_16",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["ce4d3029f7527dea8f1cf5e006ddf0c6"],
    nameKey: "products.catalog.items.38.name",
    descriptionKey: "products.catalog.items.38.description",
    shortDescriptionKey: "products.catalog.items.38.shortDescription",
    basePrice: 6250,
    ikpuCode: "507144100000033",
    packageCode: "PKG-GEN-001",
    vatPercent: 12,
  },
  {
    id: "39",
    slug: "drive_17",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["e509b88ed239cbe8e79b1c4a1a8626fa"],
    nameKey: "products.catalog.items.39.name",
    descriptionKey: "products.catalog.items.39.description",
    shortDescriptionKey: "products.catalog.items.39.shortDescription",
    basePrice: 3850,
    ikpuCode: "507144100000034",
    packageCode: "PKG-GEN-002",
    vatPercent: 12,
  },
  {
    id: "40",
    slug: "drive_18",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["drive"],
    images: ["48dba99176dcfbb828119025575692c5"],
    nameKey: "products.catalog.items.40.name",
    descriptionKey: "products.catalog.items.40.description",
    shortDescriptionKey: "products.catalog.items.40.shortDescription",
    basePrice: 4550,
    ikpuCode: "507144100000035",
    packageCode: "PKG-GEN-003",
    vatPercent: 12,
  },

  // Genesis collection
  {
    id: "41",
    slug: "genesis_4",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: [
      "shkaf-dlya-dokumentov-genesis-operative-jno931u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.41.name",
    descriptionKey: "products.catalog.items.41.description",
    shortDescriptionKey: "products.catalog.items.41.shortDescription",
    basePrice: 5750,
    ikpuCode: "507144100000036",
    packageCode: "PKG-GEN-004",
    vatPercent: 12,
  },
  {
    id: "42",
    slug: "genesis_5",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: [
      "shkaf-dlya-dokumentov-genesis-operative-jno932u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.42.name",
    descriptionKey: "products.catalog.items.42.description",
    shortDescriptionKey: "products.catalog.items.42.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000037",
    packageCode: "PKG-GEN-005",
    vatPercent: 12,
  },
  {
    id: "43",
    slug: "genesis_6",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: [
      "shkaf-dlya-dokumentov-genesis-operative-jno934u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.43.name",
    descriptionKey: "products.catalog.items.43.description",
    shortDescriptionKey: "products.catalog.items.43.shortDescription",
    basePrice: 5950,
    ikpuCode: "507144100000038",
    packageCode: "PKG-GEN-006",
    vatPercent: 12,
  },
  {
    id: "44",
    slug: "genesis_7",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: [
      "shkaf-dlya-dokumentov-genesis-operative-jno935u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.44.name",
    descriptionKey: "products.catalog.items.44.description",
    shortDescriptionKey: "products.catalog.items.44.shortDescription",
    basePrice: 6050,
    ikpuCode: "507144100000039",
    packageCode: "PKG-GEN-007",
    vatPercent: 12,
  },
  {
    id: "45",
    slug: "genesis_8",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: [
      "shkaf-dlya-dokumentov-genesis-operative-jno937u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.45.name",
    descriptionKey: "products.catalog.items.45.description",
    shortDescriptionKey: "products.catalog.items.45.shortDescription",
    basePrice: 6150,
    ikpuCode: "507144100000040",
    packageCode: "PKG-GEN-008",
    vatPercent: 12,
  },
  {
    id: "46",
    slug: "genesis_9",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: [
      "shkaf-dlya-dokumentov-genesis-operative-jno938u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.46.name",
    descriptionKey: "products.catalog.items.46.description",
    shortDescriptionKey: "products.catalog.items.46.shortDescription",
    basePrice: 6250,
    ikpuCode: "507144100000041",
    packageCode: "PKG-GEN-009",
    vatPercent: 12,
  },
  {
    id: "47",
    slug: "genesis_10",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: ["shkaf-dlya-dokumentov-genesis-operative-jno939u727-seryj-kamen"],
    nameKey: "products.catalog.items.47.name",
    descriptionKey: "products.catalog.items.47.description",
    shortDescriptionKey: "products.catalog.items.47.shortDescription",
    basePrice: 6350,
    ikpuCode: "507144100000042",
    packageCode: "PKG-GEN-010",
    vatPercent: 12,
  },
  {
    id: "48",
    slug: "genesis_11",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: ["shkaf-dlya-odezhdy-genesis-operative-jno930u727-seryj-kamen"],
    nameKey: "products.catalog.items.48.name",
    descriptionKey: "products.catalog.items.48.description",
    shortDescriptionKey: "products.catalog.items.48.shortDescription",
    basePrice: 5450,
    ikpuCode: "507144100000043",
    packageCode: "PKG-GEN-011",
    vatPercent: 12,
  },
  {
    id: "49",
    slug: "genesis_12",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: ["shkaf-dlya-odezhdy-genesis-operative-jno933u727-seryj-kamen"],
    nameKey: "products.catalog.items.49.name",
    descriptionKey: "products.catalog.items.49.description",
    shortDescriptionKey: "products.catalog.items.49.shortDescription",
    basePrice: 5550,
    ikpuCode: "507144100000044",
    packageCode: "PKG-GEN-012",
    vatPercent: 12,
  },
  {
    id: "50",
    slug: "genesis_13",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: [
      "shkaf-dlya-dokumentov-genesis-operative-jno942u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.50.name",
    descriptionKey: "products.catalog.items.50.description",
    shortDescriptionKey: "products.catalog.items.50.shortDescription",
    basePrice: 4850,
    ikpuCode: "507144100000045",
    packageCode: "PKG-GEN-013",
    vatPercent: 12,
  },
  {
    id: "51",
    slug: "genesis_14",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: ["shkaf-dlya-odezhdy-genesis-operative-jno936u727-seryj-kamen"],
    nameKey: "products.catalog.items.51.name",
    descriptionKey: "products.catalog.items.51.description",
    shortDescriptionKey: "products.catalog.items.51.shortDescription",
    basePrice: 6550,
    ikpuCode: "507144100000046",
    packageCode: "PKG-GEN-014",
    vatPercent: 12,
  },
  {
    id: "52",
    slug: "genesis_15",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["genesis"],
    images: ["shkaf-dlya-dokumentov-genesis-operative-jno940u727-seryj-kamen"],
    nameKey: "products.catalog.items.52.name",
    descriptionKey: "products.catalog.items.52.description",
    shortDescriptionKey: "products.catalog.items.52.shortDescription",
    basePrice: 4450,
    ikpuCode: "507144100000047",
    packageCode: "PKG-GEN-015",
    vatPercent: 12,
  },
  {
    id: "53",
    slug: "genesis_16",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["genesis"],
    images: ["stol-pismennyj-genesis-operativ-jno118-seryy-kamen"],
    nameKey: "products.catalog.items.53.name",
    descriptionKey: "products.catalog.items.53.description",
    shortDescriptionKey: "products.catalog.items.53.shortDescription",
    basePrice: 3950,
    ikpuCode: "507144100000048",
    packageCode: "PKG-GEN-016",
    vatPercent: 12,
  },
  {
    id: "54",
    slug: "genesis_17",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["genesis"],
    images: ["stol-bench-dvojnoj-pryamoj-genesis-operativ-jno140-seryy-kamen"],
    nameKey: "products.catalog.items.54.name",
    descriptionKey: "products.catalog.items.54.description",
    shortDescriptionKey: "products.catalog.items.54.shortDescription",
    basePrice: 4050,
    ikpuCode: "507144100000049",
    packageCode: "PKG-GEN-017",
    vatPercent: 12,
  },
  {
    id: "55",
    slug: "genesis_18",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["genesis"],
    images: ["stol-bench-malyj-pravyj-genesis-operativ-jno114dx-seryj-kamen"],
    nameKey: "products.catalog.items.55.name",
    descriptionKey: "products.catalog.items.55.description",
    shortDescriptionKey: "products.catalog.items.55.shortDescription",
    basePrice: 4150,
    ikpuCode: "507144100000050",
    packageCode: "PKG-GEN-018",
    vatPercent: 12,
  },
  {
    id: "56",
    slug: "genesis_19",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: [
      "tumba-pod-orgtekhniku-na-kolyosakh-genesis-operativ-jno302-seryj-kamen",
    ],
    nameKey: "products.catalog.items.56.name",
    descriptionKey: "products.catalog.items.56.description",
    shortDescriptionKey: "products.catalog.items.56.shortDescription",
    basePrice: 6850,
    ikpuCode: "507144100000051",
    packageCode: "PKG-GEN-019",
    vatPercent: 12,
  },
  {
    id: "57",
    slug: "genesis_20",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: [
      "tumba-pod-orgtekhniku-na-kolyosakh-levaya-genesis-operativ-jno301sx-seryj-kamen",
    ],
    nameKey: "products.catalog.items.57.name",
    descriptionKey: "products.catalog.items.57.description",
    shortDescriptionKey: "products.catalog.items.57.shortDescription",
    basePrice: 5950,
    ikpuCode: "507144100000052",
    packageCode: "PKG-GEN-020",
    vatPercent: 12,
  },
  {
    id: "58",
    slug: "genesis_21",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: ["tumba-dlya-dokumentov-genesis-operative-jno921u727-seryj-kamen"],
    nameKey: "products.catalog.items.58.name",
    descriptionKey: "products.catalog.items.58.description",
    shortDescriptionKey: "products.catalog.items.58.shortDescription",
    basePrice: 4750,
    ikpuCode: "507144100000053",
    packageCode: "PKG-ALT-003",
    vatPercent: 12,
  },
  {
    id: "59",
    slug: "genesis_22",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: ["tumba-dlya-dokumentov-genesis-operative-jno923u727-seryj-kamen"],
    nameKey: "products.catalog.items.59.name",
    descriptionKey: "products.catalog.items.59.description",
    shortDescriptionKey: "products.catalog.items.59.shortDescription",
    basePrice: 5250,
    ikpuCode: "507144100000054",
    packageCode: "PKG-ALT-004",
    vatPercent: 12,
  },
  {
    id: "60",
    slug: "genesis_23",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: ["tumba-dlya-dokumentov-genesis-operative-jno924u727-seryj-kamen"],
    nameKey: "products.catalog.items.60.name",
    descriptionKey: "products.catalog.items.60.description",
    shortDescriptionKey: "products.catalog.items.60.shortDescription",
    basePrice: 5350,
    ikpuCode: "507144100000055",
    packageCode: "PKG-ALT-005",
    vatPercent: 12,
  },
  {
    id: "61",
    slug: "genesis_24",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: ["tumba-dlya-dokumentov-genesis-operative-jno925u727-seryj-kamen"],
    nameKey: "products.catalog.items.61.name",
    descriptionKey: "products.catalog.items.61.description",
    shortDescriptionKey: "products.catalog.items.61.shortDescription",
    basePrice: 5450,
    ikpuCode: "507144100000056",
    packageCode: "PKG-ALT-006",
    vatPercent: 12,
  },
  {
    id: "62",
    slug: "genesis_25",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: ["tumba-dlya-dokumentov-genesis-operative-jno926u727-seryj-kamen"],
    nameKey: "products.catalog.items.62.name",
    descriptionKey: "products.catalog.items.62.description",
    shortDescriptionKey: "products.catalog.items.62.shortDescription",
    basePrice: 6150,
    ikpuCode: "507144100000057",
    packageCode: "PKG-ALT-007",
    vatPercent: 12,
  },
  {
    id: "63",
    slug: "genesis_26",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: [
      "tumba-dlya-dokumentov-genesis-operative-jno927u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.63.name",
    descriptionKey: "products.catalog.items.63.description",
    shortDescriptionKey: "products.catalog.items.63.shortDescription",
    basePrice: 6250,
    ikpuCode: "507144100000058",
    packageCode: "PKG-ALT-008",
    vatPercent: 12,
  },
  {
    id: "64",
    slug: "genesis_27",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: [
      "tumba-dlya-dokumentov-genesis-operative-jno928u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.64.name",
    descriptionKey: "products.catalog.items.64.description",
    shortDescriptionKey: "products.catalog.items.64.shortDescription",
    basePrice: 6350,
    ikpuCode: "507144100000059",
    packageCode: "PKG-ALT-009",
    vatPercent: 12,
  },
  {
    id: "65",
    slug: "genesis_28",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: [
      "tumba-dlya-dokumentov-genesis-operative-jno929u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.65.name",
    descriptionKey: "products.catalog.items.65.description",
    shortDescriptionKey: "products.catalog.items.65.shortDescription",
    basePrice: 6450,
    ikpuCode: "507144100000060",
    packageCode: "PKG-ALT-010",
    vatPercent: 12,
  },
  {
    id: "66",
    slug: "genesis_29",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: [
      "tumba-dlya-dokumentov-genesis-operative-jno941u727-seryj-kamen-prozrachnoe-steklo",
    ],
    nameKey: "products.catalog.items.66.name",
    descriptionKey: "products.catalog.items.66.description",
    shortDescriptionKey: "products.catalog.items.66.shortDescription",
    basePrice: 5550,
    ikpuCode: "507144100000061",
    packageCode: "PKG-ALT-011",
    vatPercent: 12,
  },
  {
    id: "67",
    slug: "genesis_30",
    categoryId: "office",
    subcategoryId: "filling-cabinets",
    collectionIds: ["genesis"],
    images: ["stellazh-peregorodka-genesis-operativ-jno205dx-seryj-kamen"],
    nameKey: "products.catalog.items.67.name",
    descriptionKey: "products.catalog.items.67.description",
    shortDescriptionKey: "products.catalog.items.67.shortDescription",
    basePrice: 6750,
    ikpuCode: "507144100000062",
    packageCode: "PKG-ALT-012",
    vatPercent: 12,
  },
  // Metar collection
  {
    id: "68",
    slug: "metar_1",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["metar"],
    images: ["15609_049", "15609_048", "15609_047", "15609_041", "15609_039"],
    nameKey: "products.catalog.items.68.name",
    descriptionKey: "products.catalog.items.68.description",
    shortDescriptionKey: "products.catalog.items.68.shortDescription",
    basePrice: 7250,
    ikpuCode: "507144100000063",
    packageCode: "PKG-ALT-013",
    vatPercent: 12,
  },
  {
    id: "69",
    slug: "metar_2",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["metar"],
    images: ["15609_009", "15609_010", "15609_011", "15609_012"],
    nameKey: "products.catalog.items.69.name",
    descriptionKey: "products.catalog.items.69.description",
    shortDescriptionKey: "products.catalog.items.69.shortDescription",
    basePrice: 6750,
    ikpuCode: "507144100000064",
    packageCode: "PKG-ALT-014",
    vatPercent: 12,
  },
  {
    id: "70",
    slug: "metar_3",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["metar"],
    images: ["15609_004", "15609_002"],
    nameKey: "products.catalog.items.70.name",
    descriptionKey: "products.catalog.items.70.description",
    shortDescriptionKey: "products.catalog.items.70.shortDescription",
    basePrice: 3850,
    ikpuCode: "507144100000065",
    packageCode: "PKG-ALT-015",
    vatPercent: 12,
  },
  {
    id: "71",
    slug: "metar_4",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["metar"],
    images: ["15609_027", "15609_028", "15609_029", "15609_030", "15609_031"],
    nameKey: "products.catalog.items.71.name",
    descriptionKey: "products.catalog.items.71.description",
    shortDescriptionKey: "products.catalog.items.71.shortDescription",
    basePrice: 5150,
    ikpuCode: "507144100000066",
    packageCode: "PKG-ALT-016",
    vatPercent: 12,
  },
  // Alto collection
  {
    id: "72",
    slug: "alto_1",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["alto"],
    images: [
      "stol-dlya-rukovoditelya-alto-ast-169-venge-magiya-dub-boford"
    ],
    nameKey: "products.catalog.items.72.name",
    descriptionKey: "products.catalog.items.72.description",
    shortDescriptionKey: "products.catalog.items.72.shortDescription",
    basePrice: 3650,
    ikpuCode: "507144100000067",
    packageCode: "PKG-ALT-017",
    vatPercent: 12,
  },
  {
    id: "73",
    slug: "alto_2",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["alto"],
    images: [
      "stol-dlya-rukovoditelya-na-opornoj-tumbe-levyj-alto-act-1716l-venge-magiya-dub-boford",
      "stol-dlya-rukovoditelya-na-opornoj-tumbe-pravyj-alto-act-1716r-venge-magiya-dub-boford",
    ],
    // left right !!!!!!
    nameKey: "products.catalog.items.73.name",
    descriptionKey: "products.catalog.items.73.description",
    shortDescriptionKey: "products.catalog.items.73.shortDescription",
    basePrice: 4950,
    ikpuCode: "507144100000068",
    packageCode: "PKG-ALT-018",
    vatPercent: 12,
  },
  {
    id: "74",
    slug: "alto_3",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["alto"],
    images: ["stol-dlya-rukovoditelya-na-opornoj-tumbe-levyj-alto-act-1918l-venge-magiya-dub-boford"],
    nameKey: "products.catalog.items.74.name",
    descriptionKey: "products.catalog.items.74.description",
    shortDescriptionKey: "products.catalog.items.74.shortDescription",
    basePrice: 4450,
    ikpuCode: "507144100000069",
    packageCode: "PKG-MET-001",
    vatPercent: 12,
  },
  {
    id: "75",
    slug: "alto_4",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["alto"],
    images: ["stoly-dlya-peregovorov-alto-act-1212-venge-magiya-dub-boford"],
    nameKey: "products.catalog.items.75.name",
    descriptionKey: "products.catalog.items.75.description",
    shortDescriptionKey: "products.catalog.items.75.shortDescription",
    basePrice: 4550,
    ikpuCode: "507144100000070",
    packageCode: "PKG-MET-002",
    vatPercent: 12,
  },
  {
    id: "76",
    slug: "alto_5",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["alto"],
    images: ["stol-zhurnalnyj-alto-act-105-venge-magiya-dub-boford"],
    nameKey: "products.catalog.items.76.name",
    descriptionKey: "products.catalog.items.76.description",
    shortDescriptionKey: "products.catalog.items.76.shortDescription",
    basePrice: 4650,
    ikpuCode: "507144100000071",
    packageCode: "PKG-MET-003",
    vatPercent: 12,
  },
  {
    id: "77",
    slug: "alto_6",
    categoryId: "office",
    subcategoryId: "filing-cabinets",
    collectionIds: ["alto"],
    images: ["tumba-mobilnaya-alto-amc-3d-dub-boford"],
    nameKey: "products.catalog.items.77.name",
    descriptionKey: "products.catalog.items.77.description",
    shortDescriptionKey: "products.catalog.items.77.shortDescription",
    basePrice: 4750,
    ikpuCode: "507144100000072",
    packageCode: "PKG-MET-004",
    vatPercent: 12,
  },
  {
    id: "78",
    slug: "alto_7",
    categoryId: "office",
    subcategoryId: "filing-cabinets",
    collectionIds: ["alto"],
    images: ["tumba-pod-frigobar-alto-atf-170-venge-magiya-dub-boford"],
    nameKey: "products.catalog.items.78.name",
    descriptionKey: "products.catalog.items.78.description",
    shortDescriptionKey: "products.catalog.items.78.shortDescription",
    basePrice: 4850,
    ikpuCode: "507144100000073",
    packageCode: "PKG-MET-005",
    vatPercent: 12,
  },
  {
    id: "79",
    slug: "alto_8",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-nizkij-alto-alc-851-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.79.name",
    descriptionKey: "products.catalog.items.79.description",
    shortDescriptionKey: "products.catalog.items.79.shortDescription",
    basePrice: 4950,
    ikpuCode: "507144100000074",
    packageCode: "PKG-MET-006",
    vatPercent: 12,
  },
  {
    id: "80",
    slug: "alto_9",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-srednij-alto-amc-857-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.80.name",
    descriptionKey: "products.catalog.items.80.description",
    shortDescriptionKey: "products.catalog.items.80.shortDescription",
    basePrice: 5050,
    ikpuCode: "507144100000075",
    packageCode: "PKG-MET-007",
    vatPercent: 12,
  },
  {
    id: "81",
    slug: "alto_10",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-srednij-alto-amc-853-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.81.name",
    descriptionKey: "products.catalog.items.81.description",
    shortDescriptionKey: "products.catalog.items.81.shortDescription",
    basePrice: 5150,
    ikpuCode: "507144100000076",
    packageCode: "PKG-MET-008",
    vatPercent: 12,
  },
  {
    id: "82",
    slug: "alto_11",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-srednij-alto-amc-851-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.82.name",
    descriptionKey: "products.catalog.items.82.description",
    shortDescriptionKey: "products.catalog.items.82.shortDescription",
    basePrice: 5250,
    ikpuCode: "507144100000077",
    packageCode: "PKG-MET-009",
    vatPercent: 12,
  },
  {
    id: "83",
    slug: "alto_12",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-vysokij-alto-ahc-855-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.83.name",
    descriptionKey: "products.catalog.items.83.description",
    shortDescriptionKey: "products.catalog.items.83.shortDescription",
    basePrice: 5350,
    ikpuCode: "507144100000078",
    packageCode: "PKG-MET-010",
    vatPercent: 12,
  },
  {
    id: "84",
    slug: "alto_13",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-alto-ahc-857-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.84.name",
    descriptionKey: "products.catalog.items.84.description",
    shortDescriptionKey: "products.catalog.items.84.shortDescription",
    basePrice: 5450,
    ikpuCode: "507144100000079",
    packageCode: "PKG-MET-011",
    vatPercent: 12,
  },
  {
    id: "85",
    slug: "alto_14",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-vysokij-alto-ahc-854-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.85.name",
    descriptionKey: "products.catalog.items.85.description",
    shortDescriptionKey: "products.catalog.items.85.shortDescription",
    basePrice: 5550,
    ikpuCode: "507144100000080",
    packageCode: "PKG-MET-012",
    vatPercent: 12,
  },
  {
    id: "86",
    slug: "alto_15",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-vysokij-alto-ahc-853-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.86.name",
    descriptionKey: "products.catalog.items.86.description",
    shortDescriptionKey: "products.catalog.items.86.shortDescription",
    basePrice: 5650,
    ikpuCode: "507144100000081",
    packageCode: "PKG-MET-013",
    vatPercent: 12,
  },
  {
    id: "87",
    slug: "alto_16",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-vysokij-alto-ahc-851-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.87.name",
    descriptionKey: "products.catalog.items.87.description",
    shortDescriptionKey: "products.catalog.items.87.shortDescription",
    basePrice: 5750,
    ikpuCode: "507144100000082",
    packageCode: "PKG-MET-014",
    vatPercent: 12,
  },
  {
    id: "88",
    slug: "alto_17",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["alto"],
    images: ["shkaf-dlya-dokumentov-vysokij-alto-ahc-851-dub-boford-venge-magiya"],
    nameKey: "products.catalog.items.88.name",
    descriptionKey: "products.catalog.items.88.description",
    shortDescriptionKey: "products.catalog.items.88.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-015",
    vatPercent: 12,
  },
  // vesta collection
  {
    id: "89",
    slug: "vesta_1",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["vesta"],
    images: ["stol-peregovorov-na-4-chelovek-z-101-dub-galifaks-belyj-beton-chikago"],
    nameKey: "products.catalog.items.89.name",
    descriptionKey: "products.catalog.items.89.description",
    shortDescriptionKey: "products.catalog.items.89.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-016",
    vatPercent: 12,
  },
  {
    id: "90",
    slug: "vesta_2",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["vesta"],
    images: ["stol-peregovorov-na-4-chelovek-z-102-dub-galifaks-belyj-beton-chikago"],
    nameKey: "products.catalog.items.90.name",
    descriptionKey: "products.catalog.items.90.description",
    shortDescriptionKey: "products.catalog.items.90.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-017",
    vatPercent: 12,
  },
  {
    id: "91",
    slug: "vesta_3",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["vesta"],
    images: ["stol-peregovorov-na-8-chelovek-z-103-dub-galifaks-belyj-beton-chikago"],
    nameKey: "products.catalog.items.91.name",
    descriptionKey: "products.catalog.items.91.description",
    shortDescriptionKey: "products.catalog.items.91.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-018",
    vatPercent: 12,
  },
  {
    id: "92",
    slug: "vesta_4",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["vesta"],
    images: ["stol-peregovorov-na-10-chelovek-z-104-dub-galifaks-belyj-beton-chikago"],
    nameKey: "products.catalog.items.92.name",
    descriptionKey: "products.catalog.items.92.description",
    shortDescriptionKey: "products.catalog.items.92.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-019",
    vatPercent: 12,
  },
  {
    id: "93",
    slug: "vesta_5",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["vesta"],
    color: "brown",
    images: ["stol-peregovorov-na-12-chelovekz-201"],
    nameKey: "products.catalog.items.93.name",
    descriptionKey: "products.catalog.items.93.description",
    shortDescriptionKey: "products.catalog.items.93.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-020",
    vatPercent: 12,
  },
  
  // goliath collection
  {
    id: "94",
    slug: "goliath_1",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["goliath"],
    color: "brown",
    images: ["Gemini_Generated_Image_6s6nhu6s6nhu6s6n"],
    nameKey: "products.catalog.items.94.name",
    descriptionKey: "products.catalog.items.94.description",
    shortDescriptionKey: "products.catalog.items.94.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-020",
    vatPercent: 12,
    variants: [
      {
        id: "94-1",
        price: 5850,
        image: "Gemini_Generated_Image_r47d1r47d1r47d1r",
        color: "white"
      }]
  },
  {
    id: "95",
    slug: "goliath_2",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["goliath"],
    images: ["Gemini_Generated_Image_95jrkz95jrkz95jr"],
    color: "brown",
    nameKey: "products.catalog.items.95.name",
    descriptionKey: "products.catalog.items.95.description",
    shortDescriptionKey: "products.catalog.items.95.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-022",
    vatPercent: 12,
    variants: [
      {
        id: "95-1",
        price: 5850,
        image: "Gemini_Generated_Image_vibwzuvibwzuvibw",
        color: "white",
      }
    ]
  },
  {
    id: "96",
    slug: "goliath_3",
    categoryId: "office",
    subcategoryId: "office-desks",
    color: "brown",
    collectionIds: ["goliath"],
    images: ["Gemini_Generated_Image_1ruiz31ruiz31rui"],
    nameKey: "products.catalog.items.96.name",
    descriptionKey: "products.catalog.items.96.description",
    shortDescriptionKey: "products.catalog.items.96.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-023",
    vatPercent: 12,
    variants: [
      {
        id: "96-1",
        price: 5850,
        image: "Gemini_Generated_Image_h5ypn7h5ypn7h5yp",
        color: "white",
      }
    ]
  },
  {
    id: "97",
    slug: "goliath_4",
    categoryId: "office",
    subcategoryId: "bookcases",
    collectionIds: ["goliath"],
    color: "brown",
    images: ["Gemini_Generated_Image_aw5et6aw5et6aw5e"],
    nameKey: "products.catalog.items.97.name",
    descriptionKey: "products.catalog.items.97.description",
    shortDescriptionKey: "products.catalog.items.97.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-024",
    vatPercent: 12,
    variants: [
      {
        id: "97-1",
        price: 5850,
        image: "Gemini_Generated_Image_5bmt365bmt365bmt`",
        color: "white",
      }
    ]
  },

  // altagama collection
  {
    id: "98",
    slug: "altagama_1",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["altagama"],
    images: ["Gemini_Generated_Image_gfr2g1gfr2g1gfr2"],
    nameKey: "products.catalog.items.98.name",
    descriptionKey: "products.catalog.items.98.description",
    shortDescriptionKey: "products.catalog.items.98.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-025",
    vatPercent: 12,
  },
  {
    id: "99",
    slug: "altagama_2",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["altagama"],
    images: ["Gemini_Generated_Image_b96wdfb96wdfb96w"],
    nameKey: "products.catalog.items.99.name",
    descriptionKey: "products.catalog.items.99.description",
    shortDescriptionKey: "products.catalog.items.99.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-026",
    vatPercent: 12,
  },
  {
    id: "100",
    slug: "altagama_3",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["altagama"],
    images: ["Gemini_Generated_Image_xk045zxk045zxk04"],
    nameKey: "products.catalog.items.100.name",
    descriptionKey: "products.catalog.items.100.description",
    shortDescriptionKey: "products.catalog.items.100.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-027",
    vatPercent: 12,
  },
  {
    id: "101",
    slug: "altagama_4",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["altagama"],
    images: ["Gemini_Generated_Image_a0m47xa0m47xa0m4"],
    nameKey: "products.catalog.items.101.name",
    descriptionKey: "products.catalog.items.101.description",
    shortDescriptionKey: "products.catalog.items.101.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-028",
    vatPercent: 12,
  },
  {
    id: "102",
    slug: "altagama_5",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["altagama"],
    images: ["Gemini_Generated_Image_422e6w422e6w422e"],
    nameKey: "products.catalog.items.102.name",
    descriptionKey: "products.catalog.items.102.description",
    shortDescriptionKey: "products.catalog.items.102.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-029",
    vatPercent: 12,
  },
  {
    id: "103",
    slug: "altagama_6",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["altagama"],
    images: ["Gemini_Generated_Image_b0qz54b0qz54b0qz"],
    nameKey: "products.catalog.items.103.name",
    descriptionKey: "products.catalog.items.103.description",
    shortDescriptionKey: "products.catalog.items.103.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-030",
    vatPercent: 12,
    variants: [
      {
        id: "103-1",
        price: 5850,
        image: "Gemini_Generated_Image_vn0hfevn0hfevn0h",
        color: "black",
      }
    ]
  },
  {
    id: "104",
    slug: "altagama_7",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["altagama"],
    images: ["Gemini_Generated_Image_wnxn6ewnxn6ewnxn"],
    nameKey: "products.catalog.items.104.name",
    descriptionKey: "products.catalog.items.104.description",
    shortDescriptionKey: "products.catalog.items.104.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-031",
    vatPercent: 12,
  },
  {
    id: "105",
    slug: "altagama_8",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["altagama"],
    images: ["Gemini_Generated_Image_8hzc578hzc578hzc"],
    color: "white",
    nameKey: "products.catalog.items.105.name",
    descriptionKey: "products.catalog.items.105.description",
    shortDescriptionKey: "products.catalog.items.105.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-032",
    vatPercent: 12,
    variants: [
      {
        id: "105-1",
        price: 5850,
        image: "Gemini_Generated_Image_7rqqic7rqqic7rqq",
        color: "brown",
      }
    ]
  },
  {
    id: "106",
    slug: "altagama_9",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["altagama"],
    images: ["Gemini_Generated_Image_oll7dyoll7dyoll7"],
    nameKey: "products.catalog.items.106.name",
    descriptionKey: "products.catalog.items.106.description",
    shortDescriptionKey: "products.catalog.items.106.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-033",
    vatPercent: 12,
  },

  // negoziatore collection
  {
    id: "107",
    slug: "negoziatore_1",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (30)"],
    color: "woody",
    nameKey: "products.catalog.items.107.name",
    descriptionKey: "products.catalog.items.107.description",
    shortDescriptionKey: "products.catalog.items.107.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-034",
    vatPercent: 12,
    variants: [
      {
        id: "107-1",
        price: 5850,
        color: "black",
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (31)",
      },
      {
        id: "107-2",
        price: 5850,
        color: "white",
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (32)",
      },
      {
        id: "107-3",
        price: 5850,
        color: "gray",
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (33)",
      },
      {
        id: "107-4",  
        price: 5850,
        color: "brown",
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (34)",
      }
    ]
  },
  {
    id: "108",
    slug: "negoziatore_2",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    color: "woody",
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (28)"],
    nameKey: "products.catalog.items.108.name",
    descriptionKey: "products.catalog.items.108.description",
    shortDescriptionKey: "products.catalog.items.108.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-035",
    vatPercent: 12,
    variants: [
      {
        id: "108-1",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (20)",
        color: "black",
      },
      {
        id: "108-2",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (22)",
        color: "white",
      },
      {
        id: "108-3",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (24)",
        color: "gray",
      },
      {
        id: "108-4",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (26)",
        color: "brown",
      }
    ]
  },
  {
    id: "109",
    slug: "negoziatore_3",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (9)"],
    color: "woody",
    nameKey: "products.catalog.items.109.name",
    descriptionKey: "products.catalog.items.109.description",
    shortDescriptionKey: "products.catalog.items.109.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-036",
    vatPercent: 12,
    variants: [
      {
        id: "109-1",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (10)",
        color: "black",
      },
      {
        id: "109-2",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (11)",
        color: "white",
      },
      { 
        id: "109-3",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (12)",
        color: "gray",
      },
      {
        id: "109-4",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (13)",
        color: "brown",
      }
    ]
  },
  {
    id: "110",
    slug: "negoziatore_4",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (1)"],
    color: "woody",
    nameKey: "products.catalog.items.110.name",
    descriptionKey: "products.catalog.items.110.description",
    shortDescriptionKey: "products.catalog.items.110.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-037",
    vatPercent: 12,
  },
  {
    id: "111",
    slug: "negoziatore_5",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (7)"],
    color: "woody",
    nameKey: "products.catalog.items.111.name",
    descriptionKey: "products.catalog.items.111.description",
    shortDescriptionKey: "products.catalog.items.111.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-038",
    vatPercent: 12,
    variants: [
      {
        id: "111-1",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (3)",
        color: "black",
      },
      {
        id: "111-2",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (4)",
        color: "white",
      },
      {
        id: "111-3",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (5)",
        color: "gray",
      },
      {
        id: "111-4",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (6)",
        color: "brown",
      }
    ]
  },
  {
    id: "112",
    slug: "negoziatore_6",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    color: "woody",
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (74)"],
    nameKey: "products.catalog.items.112.name",
    descriptionKey: "products.catalog.items.112.description",
    shortDescriptionKey: "products.catalog.items.112.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-039",
    vatPercent: 12,
    variants: [
      {
        id: "112-1",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (70)",
        color: "black",
      },
      {
        id: "112-2",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (71)",
        color: "white",
      },
      {
        id: "112-3",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (72)",
        color: "gray",
      },
      {
        id: "112-4",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (73)",
        color: "brown",
      }
    ]
  },
  {
    id: "113",
    slug: "negoziatore_7",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (19)"],
    color: "woody",
    nameKey: "products.catalog.items.113.name",
    descriptionKey: "products.catalog.items.113.description",
    shortDescriptionKey: "products.catalog.items.113.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-040",
    vatPercent: 12,
    variants: [
      {
        id: "113-1",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (15)",
        color: "black",
      },
      {
        id: "113-2",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (16)",
        color: "white",
      },
      {
        id: "113-3",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (17)",
        color: "gray",
      },
      {
        id: "113-4",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (18)",
        color: "brown",
      }
    ]
  },
  {
    id: "114",
    slug: "negoziatore_8",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (8)"],
    nameKey: "products.catalog.items.114.name",
    descriptionKey: "products.catalog.items.114.description",
    shortDescriptionKey: "products.catalog.items.114.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-041",
    vatPercent: 12,
  },
  {
    id: "115",
    slug: "negoziatore_9",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (69)"],
    color: "woody",
    nameKey: "products.catalog.items.115.name",
    descriptionKey: "products.catalog.items.115.description",
    shortDescriptionKey: "products.catalog.items.115.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-042",
    vatPercent: 12,
    variants: [
      {
        id: "115-1",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (65)",
        color: "black",
      },
      {
        id: "115-2",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (66)",
        color: "white",
      },
      {
        id: "115-3",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (67)",
        color: "gray",
      },
      {
        id: "115-4",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (68)",
        color: "brown",
      }
    ]
  },
  {
    id: "116",
    slug: "negoziatore_10",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (80)"],
    nameKey: "products.catalog.items.116.name",
    descriptionKey: "products.catalog.items.116.description",
    shortDescriptionKey: "products.catalog.items.116.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-043",
    vatPercent: 12,
  },
  {
    id: "117",
    slug: "negoziatore_11",
    categoryId: "office",
    subcategoryId: "office-desks",
    collectionIds: ["negoziatore"],
    images: ["Gemini_Generated_Image_qa7293qa7293qa72 (79)"],
    nameKey: "products.catalog.items.117.name",
    descriptionKey: "products.catalog.items.117.description",
    shortDescriptionKey: "products.catalog.items.117.shortDescription",
    basePrice: 5850,
    ikpuCode: "507144100000083",
    packageCode: "PKG-MET-044",
    vatPercent: 12,
    variants: [
      {
        id: "117-1",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (75)",
        color: "black",
      },
      {
        id: "117-2",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (76)",
        color: "white",
      },
      {
        id: "117-3",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (77)",
        color: "gray",
      },
      {
        id: "117-4",
        price: 5850,
        image: "Gemini_Generated_Image_qa7293qa7293qa72 (78)",
        color: "brown",
      }
    ]
  }
];

// ============ CATEGORIES ============
export function getCategories(): CatalogCategory[] {
  return [...categories];
}

export function getCategoryById(id: string): CatalogCategory | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): CatalogCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

// ============ COLLECTIONS ============
export function getCollections(): CatalogCollection[] {
  return [...collections];
}

export function getCollectionById(id: string): CatalogCollection | undefined {
  return collections.find((c) => c.id === id);
}

export function getCollectionBySlug(
  slug: string,
): CatalogCollection | undefined {
  return collections.find((c) => c.slug === slug);
}

// ============ SUBCATEGORIES ============
export function getSubcategories(): CatalogSubcategory[] {
  return [...subcategories];
}

export function getSubcategory(id: string): CatalogSubcategory | undefined {
  return subcategories.find((s) => s.id === id);
}

export function getSubcategoryBySlug(
  slug: string,
): CatalogSubcategory | undefined {
  return subcategories.find((s) => s.slug === slug);
}

export function getSubcategoriesByCategory(
  categoryId: string,
): CatalogSubcategory[] {
  return subcategories.filter((s) => s.categoryId === categoryId);
}

// ============ PRODUCTS ============
export function getProducts(filters?: {
  categoryId?: string;
  collectionId?: string;
  featured?: boolean;
}): CatalogProduct[] {
  let result = [...products];

  if (filters?.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }

  if (filters?.collectionId) {
    result = result.filter((p) =>
      p.collectionIds.includes(filters.collectionId),
    );
  }

  return result;
}

export function getProductById(id: string): CatalogProduct | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): CatalogProduct[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getProductsByCollection(
  collectionId: string,
): CatalogProduct[] {
  return products.filter((p) => p.collectionIds.includes(collectionId));
}

export function getVariant(
  productId: string,
  variantId: string,
): ProductVariant | undefined {
  const product = getProductById(productId);
  return product?.variants?.find((v) => v.id === variantId);
}

// ============ PRICING ============
export function getDiscountedPrice(
  basePrice: number,
  discount?: number,
): number {
  if (!discount || discount <= 0) return basePrice;
  return Math.round(basePrice * (1 - discount / 100));
}

export function getVariantPrice(
  variant: ProductVariant,
  basePrice?: number,
  discount?: number,
): number {
  const price = variant.price ?? basePrice ?? 0;
  return getDiscountedPrice(price, discount);
}

export function calculateTax(price: number, vatPercent: number = 12): number {
  return Math.round((price * vatPercent) / 100);
}

// ============ SEARCH ============
export function searchProducts(query: string): CatalogProduct[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.slug.toLowerCase().includes(lowerQuery) ||
      product.nameKey.toLowerCase().includes(lowerQuery),
  );
}
