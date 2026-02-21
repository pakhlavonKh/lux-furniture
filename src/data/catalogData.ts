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

// ============ TYPES ============
export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  material?: string;
  price: number;
  ikpuCode?: string; // Payme merchant ID for this variant
  packageCode?: string; // Package code for inventory tracking
}

export interface CatalogProduct {
  id: string;
  slug: string;
  categoryId: string;
  collectionIds: string[];
  image: string;
  images?: string[];
  nameKey: string;
  descriptionKey?: string;
  shortDescriptionKey?: string;
  basePrice: number;
  variants: ProductVariant[];
  discount?: number;
  isFeatured: boolean;
  sku: string;
  ikpuCode?: string; // Default IKPU code for product
  packageCode?: string; // Default package code
  vatPercent?: number; // VAT percentage (default 12%)
  sizeImages?: Record<string, string[]>;
  colorImages?: Record<string, string[]>;
  sizePrices?: Record<string, number>;
  sizeDescriptions?: Record<string, string>;
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
  productStock: Record<string, number>;
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
    id: "living",
    slug: "living",
    nameKey: "collections.items.living.name",
    descriptionKey: "collections.items.living.description",
    image: armchairImage,
    displayOrder: 1,
  },
  {
    id: "dining",
    slug: "dining",
    nameKey: "collections.items.dining.name",
    descriptionKey: "collections.items.dining.description",
    image: diningTableImage,
    displayOrder: 2,
  },
  {
    id: "lighting",
    slug: "lighting",
    nameKey: "collections.items.lighting.name",
    descriptionKey: "collections.items.lighting.description",
    image: lampImage,
    displayOrder: 3,
  },
];

const products: CatalogProduct[] = [
  {
    id: "1",
    slug: "aria-lounge-chair",
    categoryId: "storage",
    collectionIds: ["living"],
    image: armchairImage,
    images: [armchairImage],
    nameKey: "products.ariaLounge",
    descriptionKey: "products.catalog.aria.description",
    shortDescriptionKey: "products.catalog.aria.shortDescription",
    basePrice: 3450,
    sku: "ALC-001",
    ikpuCode: "507144100000001",
    packageCode: "PKG-ALC-001",
    vatPercent: 12,
    variants: [
      {
        id: "1-beige",
        sku: "ALC-001-BEIGE",
        color: "Beige",
        price: 3450,
        ikpuCode: "507144100000001",
        packageCode: "PKG-ALC-001-BEI",
      },
      {
        id: "1-grey",
        sku: "ALC-001-GREY",
        color: "Grey",
        price: 3450,
        ikpuCode: "507144100000002",
        packageCode: "PKG-ALC-001-GRE",
      },
      {
        id: "1-charcoal",
        sku: "ALC-001-CHAR",
        color: "Charcoal",
        price: 3650,
        ikpuCode: "507144100000003",
        packageCode: "PKG-ALC-001-CHA",
      },
    ],
    discount: 0,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "tavola-dining-table",
    categoryId: "dining",
    collectionIds: ["dining"],
    image: diningTableImage,
    images: [diningTableImage],
    nameKey: "products.tavola",
    descriptionKey: "products.catalog.tavola.description",
    shortDescriptionKey: "products.catalog.tavola.shortDescription",
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
        ikpuCode: "507144100000004",
        packageCode: "PKG-DT-002-WAL",
      },
      {
        id: "2-oak",
        sku: "DT-002-OAK",
        material: "Oak",
        price: 7850,
        ikpuCode: "507144100000005",
        packageCode: "PKG-DT-002-OAK",
      },
    ],
    discount: 5,
    isFeatured: true,
  },
  {
    id: "3",
    slug: "luce-floor-lamp",
    categoryId: "lighting",
    collectionIds: ["lighting"],
    image: lampImage,
    images: [lampImage],
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
        ikpuCode: "507144100000006",
        packageCode: "PKG-LAMP-003-GLD",
      },
      {
        id: "3-black",
        sku: "LAMP-003-BLK",
        color: "Black",
        price: 1850,
        ikpuCode: "507144100000007",
        packageCode: "PKG-LAMP-003-BLK",
      },
    ],
    discount: 0,
    isFeatured: false,
  },
];

// ============ DEFAULT STOCK ============
function createDefaultStockState(): StockState {
  const productStock: Record<string, number> = {};
  const variantStock: Record<string, number> = {};

  // Set default stock levels for products
  productStock["1"] = 12;
  productStock["2"] = 3;
  productStock["3"] = 25;

  // Set default stock levels for variants
  variantStock["1-beige"] = 5;
  variantStock["1-grey"] = 7;
  variantStock["1-charcoal"] = 0;
  variantStock["2-walnut"] = 2;
  variantStock["2-oak"] = 1;
  variantStock["3-gold"] = 15;
  variantStock["3-black"] = 10;

  return {
    productStock,
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
      productStock: { ...defaults.productStock, ...(parsed.productStock || {}) },
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
  return product?.variants.find((v) => v.id === variantId);
}

// ============ STOCK MANAGEMENT ============
// ============ STOCK QUERIES ============
export function getProductStock(productId: string): number {
  const state = readStockState();
  return clampStock(state.productStock[productId] ?? 0);
}

export function getVariantStock(variantId: string): number {
  const state = readStockState();
  return clampStock(state.variantStock[variantId] ?? 0);
}

export function isInStock(productId: string, variantId?: string): boolean {
  if (variantId) {
    return getVariantStock(variantId) > 0;
  }
  return getProductStock(productId) > 0;
}

export function getStockStatus(
  productId: string,
  variantId?: string
): "in-stock" | "low-stock" | "out-of-stock" {
  const stock = variantId ? getVariantStock(variantId) : getProductStock(productId);
  if (stock === 0) return "out-of-stock";
  if (stock < 5) return "low-stock";
  return "in-stock";
}

// ============ STOCK MANAGEMENT ============
export function setProductStock(productId: string, stock: number): boolean {
  if (!getProductById(productId)) return false;
  const state = readStockState();
  state.productStock[productId] = clampStock(stock);
  writeStockState(state);
  return true;
}

export function setVariantStock(variantId: string, stock: number): boolean {
  const exists = products.some((p) => p.variants.some((v) => v.id === variantId));
  if (!exists) return false;
  const state = readStockState();
  state.variantStock[variantId] = clampStock(stock);
  writeStockState(state);
  return true;
}

export function reduceStockAfterOrder(
  productId: string,
  variantId?: string,
  quantity: number = 1
): boolean {
  const amount = clampStock(quantity);
  if (amount < 1) return false;

  const state = readStockState();

  if (variantId) {
    const current = clampStock(state.variantStock[variantId] ?? 0);
    if (current < amount) return false;
    state.variantStock[variantId] = current - amount;
  }

  const productCurrent = clampStock(state.productStock[productId] ?? 0);
  if (productCurrent < amount) return false;
  state.productStock[productId] = productCurrent - amount;

  writeStockState(state);
  return true;
}

export function increaseStock(
  productId: string,
  variantId?: string,
  quantity: number = 1
): boolean {
  const amount = clampStock(quantity);
  if (amount < 1) return false;

  const state = readStockState();

  if (variantId) {
    const current = clampStock(state.variantStock[variantId] ?? 0);
    state.variantStock[variantId] = current + amount;
  }

  const productCurrent = clampStock(state.productStock[productId] ?? 0);
  state.productStock[productId] = productCurrent + amount;

  writeStockState(state);
  return true;
}

// ============ PRICING ============
export function getDiscountedPrice(basePrice: number, discount?: number): number {
  if (!discount || discount <= 0) return basePrice;
  return Math.round(basePrice * (1 - discount / 100));
}

export function getVariantPrice(variant: ProductVariant, discount?: number): number {
  return getDiscountedPrice(variant.price, discount);
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
