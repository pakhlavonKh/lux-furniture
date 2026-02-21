import armchairImage from "@/assets/product-armchair.jpg";
import diningTableImage from "@/assets/product-dining-table.jpg";
import lampImage from "@/assets/product-lamp.jpg";

const CATALOG_STOCK_KEY = "catalogStockState";

export interface ProductTranslationKeys {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  material: string;
  color: string;
  style: string;
  dimensions: string;
  care: string;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  material?: string;
  price: number;
  stock: number;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  image: string;
  images: string[];
  basePrice: number;
  variants: ProductVariant[];
  stock: number;
  discount?: number;
  isFeatured: boolean;
  sku: string;
  translationKeys: ProductTranslationKeys;
  createdAt: Date;
  updatedAt: Date;
}

interface StockState {
  productStock: Record<string, number>;
  variantStock: Record<string, number>;
}

const catalogTemplate: CatalogProduct[] = [
  {
    id: "1",
    slug: "aria-lounge-chair",
    image: armchairImage,
    images: [armchairImage],
    basePrice: 3450,
    stock: 12,
    variants: [
      { id: "1-beige", color: "Beige", price: 3450, stock: 5 },
      { id: "1-grey", color: "Grey", price: 3450, stock: 7 },
      { id: "1-charcoal", color: "Charcoal", price: 3650, stock: 0 },
    ],
    discount: 0,
    isFeatured: true,
    sku: "ALC-001",
    translationKeys: {
      title: "products.ariaLounge",
      shortDescription: "products.catalog.aria.shortDescription",
      description: "products.catalog.aria.description",
      category: "products.category.seating",
      material: "products.catalog.aria.material",
      color: "products.catalog.aria.color",
      style: "products.catalog.aria.style",
      dimensions: "products.catalog.aria.dimensions",
      care: "products.catalog.aria.care",
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    slug: "tavola-dining-table",
    image: diningTableImage,
    images: [diningTableImage],
    basePrice: 8900,
    stock: 3,
    variants: [
      { id: "2-walnut", material: "Walnut", price: 8900, stock: 2 },
      { id: "2-oak", material: "Oak", price: 7850, stock: 1 },
    ],
    discount: 5,
    isFeatured: true,
    sku: "DT-002",
    translationKeys: {
      title: "products.tavola",
      shortDescription: "products.catalog.tavola.shortDescription",
      description: "products.catalog.tavola.description",
      category: "products.category.dining",
      material: "products.catalog.tavola.material",
      color: "products.catalog.tavola.color",
      style: "products.catalog.tavola.style",
      dimensions: "products.catalog.tavola.dimensions",
      care: "products.catalog.tavola.care",
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    slug: "luce-floor-lamp",
    image: lampImage,
    images: [lampImage],
    basePrice: 1850,
    stock: 25,
    variants: [
      { id: "3-gold", color: "Gold", price: 1850, stock: 15 },
      { id: "3-black", color: "Black", price: 1850, stock: 10 },
    ],
    discount: 0,
    isFeatured: false,
    sku: "LAMP-003",
    translationKeys: {
      title: "products.luce",
      shortDescription: "products.catalog.luce.shortDescription",
      description: "products.catalog.luce.description",
      category: "products.category.lighting",
      material: "products.catalog.luce.material",
      color: "products.catalog.luce.color",
      style: "products.catalog.luce.style",
      dimensions: "products.catalog.luce.dimensions",
      care: "products.catalog.luce.care",
    },
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
];

function clampStock(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

function createDefaultStockState(): StockState {
  return catalogTemplate.reduce<StockState>(
    (acc, product) => {
      acc.productStock[product.id] = product.stock;
      for (const variant of product.variants) {
        acc.variantStock[variant.id] = variant.stock;
      }
      return acc;
    },
    { productStock: {}, variantStock: {} }
  );
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
    };
  } catch {
    const defaults = createDefaultStockState();
    localStorage.setItem(CATALOG_STOCK_KEY, JSON.stringify(defaults));
    return defaults;
  }
}

function writeStockState(next: StockState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CATALOG_STOCK_KEY, JSON.stringify(next));
}

function hydrateProduct(product: CatalogProduct, stockState: StockState): CatalogProduct {
  return {
    ...product,
    stock: clampStock(stockState.productStock[product.id] ?? product.stock),
    variants: product.variants.map((variant) => ({
      ...variant,
      stock: clampStock(stockState.variantStock[variant.id] ?? variant.stock),
    })),
  };
}

export function getCatalogProducts(): CatalogProduct[] {
  const stockState = readStockState();
  return catalogTemplate.map((product) => hydrateProduct(product, stockState));
}

export function getProductById(productId: string): CatalogProduct | undefined {
  return getCatalogProducts().find((product) => product.id === productId);
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return getCatalogProducts().find((product) => product.slug === slug);
}

export function getFeaturedProducts(): CatalogProduct[] {
  return getCatalogProducts().filter((product) => product.isFeatured);
}

export function getProductsByCategory(categoryKey: string): CatalogProduct[] {
  return getCatalogProducts().filter((product) => product.translationKeys.category === categoryKey);
}

export function setProductStock(productId: string, stock: number): boolean {
  const product = catalogTemplate.find((p) => p.id === productId);
  if (!product) return false;

  const state = readStockState();
  state.productStock[productId] = clampStock(stock);
  writeStockState(state);
  return true;
}

export function setVariantStock(variantId: string, stock: number): boolean {
  const exists = catalogTemplate.some((product) => product.variants.some((variant) => variant.id === variantId));
  if (!exists) return false;

  const state = readStockState();
  state.variantStock[variantId] = clampStock(stock);
  writeStockState(state);
  return true;
}

export function reduceStock(productId: string, variantId?: string, quantity: number = 1): boolean {
  const amount = clampStock(quantity);
  if (amount < 1) return false;

  const state = readStockState();

  if (variantId) {
    const current = clampStock(state.variantStock[variantId] ?? 0);
    if (current < amount) return false;
    state.variantStock[variantId] = current - amount;
    writeStockState(state);
    return true;
  }

  const current = clampStock(state.productStock[productId] ?? 0);
  if (current < amount) return false;
  state.productStock[productId] = current - amount;
  writeStockState(state);
  return true;
}

export function increaseStock(productId: string, variantId?: string, quantity: number = 1): boolean {
  const amount = clampStock(quantity);
  if (amount < 1) return false;

  const state = readStockState();

  if (variantId) {
    const current = clampStock(state.variantStock[variantId] ?? 0);
    state.variantStock[variantId] = current + amount;
    writeStockState(state);
    return true;
  }

  const current = clampStock(state.productStock[productId] ?? 0);
  state.productStock[productId] = current + amount;
  writeStockState(state);
  return true;
}

export function isInStock(productId: string, variantId?: string): boolean {
  const product = getProductById(productId);
  if (!product) return false;

  if (variantId) {
    const variant = product.variants.find((v) => v.id === variantId);
    return Boolean(variant && variant.stock > 0);
  }

  return product.stock > 0;
}

export function getDiscountedPrice(basePrice: number, discount?: number): number {
  if (!discount || discount <= 0) return basePrice;
  return Math.round(basePrice * (1 - discount / 100));
}

export function searchProducts(query: string): CatalogProduct[] {
  const lowerQuery = query.toLowerCase();
  return getCatalogProducts().filter(
    (product) =>
      product.slug.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery) ||
      product.translationKeys.title.toLowerCase().includes(lowerQuery)
  );
}
