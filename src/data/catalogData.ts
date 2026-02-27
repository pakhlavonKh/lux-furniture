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
const itemsImg = import.meta.glob(
  "../assets/**/*.{png,jpg,jpeg,webp}",
  { eager: true },
) as Record<string, { default: string }>;

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
  sku: string;
  color?: string;
  size?: string;
  material?: string;
  price?: number; // Override basePrice if set
  stock: number; // Single source of truth for stock
  image?: string; // Optional image override
  ikpuCode?: string; // Payme merchant ID for this variant
  packageCode?: string; // Package code for inventory tracking
}

export interface CatalogProduct {
  id: string;
  slug: string;
  categoryId: string;
  subcategoryId?: string; // Optional subcategory
  collectionIds?: string[];
  images: string[]; // Main product images
  nameKey: string;
  descriptionKey?: string;
  shortDescriptionKey?: string;
  basePrice: number; // Default fallback price
  variants?: ProductVariant[];
  isFeatured?: boolean;
  sku: string; // Default SKU
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

// ============ STOCK MANAGEMENT ============
interface StockState {
  variantStock: Record<string, number>;
  lastUpdated: number;
}

// ============ DATA TEMPLATES ============
const categories: CatalogCategory[] = [
  { id: "storage", slug: "storage", nameKey: "categories.storage", descriptionKey: "categories.storage.description", image: shelvingImg, displayOrder: 1 },
  { id: "kitchen", slug: "kitchen", nameKey: "categories.kitchen", descriptionKey: "categories.kitchen.description", image: kitchenImg, displayOrder: 2 },
  { id: "garden", slug: "garden", nameKey: "categories.garden", descriptionKey: "categories.garden.description", image: gardenImg, displayOrder: 3 },
  { id: "office", slug: "office", nameKey: "categories.office", descriptionKey: "categories.office.description", image: officeImg, displayOrder: 4 },
  { id: "children", slug: "children", nameKey: "categories.children", descriptionKey: "categories.children.description", image: childrenImg, displayOrder: 5 },
  { id: "industrial", slug: "industrial", nameKey: "categories.industrial", descriptionKey: "categories.industrial.description", image: industrialImg, displayOrder: 6 },
  { id: "accessories", slug: "accessories", nameKey: "categories.accessories", descriptionKey: "categories.accessories.description", image: accessoriesImg, displayOrder: 7 },
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
];

const products: CatalogProduct[] = [
  {
    id: "1",
    slug: "art_2",
    categoryId: "storage",
    collectionIds: ["artVision"],
    images: ["Art_0002"],
    nameKey: "products.catalog.items.name",
    descriptionKey: "products.catalog.items.description",
    shortDescriptionKey: "products.catalog.items.shortDescription",
    basePrice: 3450,
    sku: "ALC-001",
    ikpuCode: "",
    packageCode: "PKG-ALC-001",
    vatPercent: 12,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "Art_3",
    categoryId: "dining",
    collectionIds: ["artVision"],
    images: ["Art_03", "Art_03_2", "Art_0003"],
    nameKey: "products.catalog.items.name",
    descriptionKey: "products.catalog.items.description",
    shortDescriptionKey: "products.catalog.items.shortDescription",
    basePrice: 8900,
    sku: "DT-002",
    ikpuCode: "507144100000004",
    packageCode: "PKG-DT-002",
    vatPercent: 12,
    variants: [
      {
        id: "2-walnut",
        sku: "DT-002-WAL",
        material: "Walnut",
        price: 8900,
        stock: 2,
      },
      {
        id: "2-oak",
        sku: "DT-002-OAK",
        material: "Oak",
        price: 7850,
        stock: 1,
      },
    ],
    isFeatured: true,
  },
  {
    id: "3",
    slug: "luce-floor-lamp",
    categoryId: "lighting",
    collectionIds: ["lighting"],
    images: ["product-lamp"],
    nameKey: "products.luce",
    descriptionKey: "products.catalog.luce.description",
    shortDescriptionKey: "products.catalog.luce.shortDescription",
    basePrice: 1850,
    sku: "LAMP-003",
    ikpuCode: "507144100000006",
    packageCode: "PKG-LAMP-003",
    vatPercent: 12,
    variants: [
      {
        id: "3-gold",
        sku: "LAMP-003-GOLD",
        color: "Gold",
        price: 1850,
        stock: 15,
      },
      {
        id: "3-black",
        sku: "LAMP-003-BLK",
        color: "Black",
        price: 1850,
        stock: 10,
      },
    ],
    isFeatured: false,
  },
];

// ============ DEFAULT STOCK ============
function createDefaultStockState(): StockState {
  const variantStock: Record<string, number> = {};

  // Set default stock levels for variants
  variantStock["1-beige"] = 5;
  variantStock["1-grey"] = 7;
  variantStock["1-charcoal"] = 0;
  variantStock["2-walnut"] = 2;
  variantStock["2-oak"] = 1;
  variantStock["3-gold"] = 15;
  variantStock["3-black"] = 10;

  return {
    variantStock,
    lastUpdated: Date.now(),
  };
}

// ============ STOCK UTILITIES ============
function clampStock(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

function readStockState(): StockState {
  if (typeof window === "undefined") {
    return createDefaultStockState();
  }

  const raw = localStorage.getItem(CATALOG_STOCK_KEY);
  if (!raw) {
    const defaults = createDefaultStockState();
    localStorage.setItem(CATALOG_STOCK_KEY, JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StockState>;
    const defaults = createDefaultStockState();

    return {
      variantStock: { ...defaults.variantStock, ...(parsed.variantStock || {}) },
      lastUpdated: parsed.lastUpdated || Date.now(),
    };
  } catch {
    const defaults = createDefaultStockState();
    localStorage.setItem(CATALOG_STOCK_KEY, JSON.stringify(defaults));
    return defaults;
  }
}

function writeStockState(next: StockState) {
  if (typeof window === "undefined") return;
  next.lastUpdated = Date.now();
  localStorage.setItem(CATALOG_STOCK_KEY, JSON.stringify(next));
}

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

export function getCollectionBySlug(slug: string): CatalogCollection | undefined {
  return collections.find((c) => c.slug === slug);
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
    result = result.filter((p) => p.collectionIds.includes(filters.collectionId));
  }

  if (filters?.featured) {
    result = result.filter((p) => p.isFeatured);
  }

  return result;
}

export function getProductById(id: string): CatalogProduct | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductBySku(sku: string): CatalogProduct | undefined {
  return products.find((p) => p.sku === sku);
}

export function getProductsByCategory(categoryId: string): CatalogProduct[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getProductsByCollection(collectionId: string): CatalogProduct[] {
  return products.filter((p) => p.collectionIds.includes(collectionId));
}

export function getFeaturedProducts(): CatalogProduct[] {
  return products.filter((p) => p.isFeatured);
}

export function getVariant(
  productId: string,
  variantId: string
): ProductVariant | undefined {
  const product = getProductById(productId);
  return product?.variants?.find((v) => v.id === variantId);
}

// ============ STOCK QUERIES ============
export function isVariantInStock(variant: ProductVariant): boolean {
  return variant.stock > 0;
}

export function getVariantStock(variantId: string): number {
  const state = readStockState();
  return clampStock(state.variantStock[variantId] ?? 0);
}

export function isInStock(productId: string, variantId?: string): boolean {
  if (variantId) {
    return getVariantStock(variantId) > 0;
  }
  // If no variant specified, check if product has any stock
  const product = getProductById(productId);
  if (!product) return false;
  if (product.variants && product.variants.length > 0) {
    return product.variants.some((v) => v.stock > 0);
  }
  return true; // No variants = assume in stock
}

export function getStockStatus(
  variantId?: string
): "in-stock" | "low-stock" | "out-of-stock" {
  if (!variantId) return "in-stock";
  const stock = getVariantStock(variantId);
  if (stock === 0) return "out-of-stock";
  if (stock < 5) return "low-stock";
  return "in-stock";
}

// ============ STOCK MUTATIONS ============
export function setVariantStock(variantId: string, stock: number): boolean {
  const exists = products.some((p) => p.variants?.some((v) => v.id === variantId));
  if (!exists) return false;
  const state = readStockState();
  state.variantStock[variantId] = clampStock(stock);
  writeStockState(state);
  return true;
}

export function reduceVariantStock(
  variant: ProductVariant,
  quantity: number = 1
): boolean {
  const amount = clampStock(quantity);
  if (amount < 1) return false;
  if (variant.stock < amount) return false;

  variant.stock -= amount;
  // Also update localStorage
  const state = readStockState();
  state.variantStock[variant.id] = variant.stock;
  writeStockState(state);
  return true;
}

export function increaseVariantStock(
  variant: ProductVariant,
  quantity: number = 1
): boolean {
  const amount = clampStock(quantity);
  if (amount < 1) return false;

  variant.stock += amount;
  // Also update localStorage
  const state = readStockState();
  state.variantStock[variant.id] = variant.stock;
  writeStockState(state);
  return true;
}

// ============ PRICING ============
export function getDiscountedPrice(basePrice: number, discount?: number): number {
  if (!discount || discount <= 0) return basePrice;
  return Math.round(basePrice * (1 - discount / 100));
}

export function getVariantPrice(variant: ProductVariant, basePrice?: number, discount?: number): number {
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
      product.sku.toLowerCase().includes(lowerQuery) ||
      product.nameKey.toLowerCase().includes(lowerQuery)
  );
}
