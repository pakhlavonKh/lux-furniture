import armchairImage from "@/assets/product-armchair.jpg";
import diningTableImage from "@/assets/product-dining-table.jpg";
import lampImage from "@/assets/product-lamp.jpg";

export type Language = "en" | "ru" | "uz";

export interface ProductTranslation {
  title: string;
  description: string;
  shortDescription: string;
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
  translations: Record<Language, ProductTranslation>;
  createdAt: Date;
  updatedAt: Date;
}

export const catalogData: CatalogProduct[] = [
  {
    id: "1",
    slug: "aria-lounge-chair",
    image: armchairImage,
    images: [armchairImage],
    basePrice: 3450,
    stock: 12,
    variants: [
      {
        id: "1-beige",
        color: "Beige",
        price: 3450,
        stock: 5,
      },
      {
        id: "1-grey",
        color: "Grey",
        price: 3450,
        stock: 7,
      },
      {
        id: "1-charcoal",
        color: "Charcoal",
        price: 3650,
        stock: 0,
      },
    ],
    discount: 0,
    isFeatured: true,
    sku: "ALC-001",
    translations: {
      en: {
        title: "Aria Lounge Chair",
        shortDescription: "Elegant bouclé lounge chair for contemporary living",
        description:
          "The Aria Lounge Chair is an embodiment of modern luxury and comfort. Crafted with premium bouclé fabric, this chair features a gracefully curved silhouette and deep seating that invites relaxation. Perfect for any contemporary interior, the Aria adds sophistication and a sense of refined elegance to your space.",
        category: "Seating",
        material: "Bouclé Fabric",
        color: "Beige, Grey, Charcoal",
        style: "Contemporary",
        dimensions: "W: 85cm | D: 90cm | H: 78cm",
        care: "Vacuum regularly. Spot clean with appropriate fabric cleaner. Protect from direct sunlight.",
      },
      ru: {
        title: "Кресло Aria",
        shortDescription: "Элегантное букле кресло для современной гостиной",
        description:
          "Кресло Aria воплощает современную роскошь и комфорт. Изготовленное из премиум-ткани букле, это кресло имеет грациозный изгиб и глубокую посадку, которая приглашает к расслаблению. Идеально подходит для любого современного интерьера, Aria добавляет изысканность и утонченность в ваше пространство.",
        category: "Мебель для сидения",
        material: "Ткань букле",
        color: "Бежевый, Серый, Темно-серый",
        style: "Современный",
        dimensions: "Ш: 85см | Г: 90см | В: 78см",
        care: "Регулярно пылесосьте. Протирайте пятна подходящим постельным бельем. защищайте от прямого солнечного света.",
      },
      uz: {
        title: "Aria Kreslo",
        shortDescription: "Zamonaviy jinslarga mos xona kreslo",
        description:
          "Aria Kreslo zamonaviy hashamatlik va qulaylikning ifodasi. Premium bukle tkanindan tayyorlangan, bu kresloning gratsil egilgan silueti va chuqur o'tirish joyiga ega. Har qandayy zamonaviy interyer uchun ideal bo'lgan Aria sizning makoniga sofistikatsiyasi va nozik elegansiyani qo'shadi.",
        category: "O'tirish mebeli",
        material: "Bukle tkanin",
        color: "Bezhiy, Kulrang, Qom",
        style: "Zamonaviy",
        dimensions: "K: 85cm | C: 90cm | B: 78cm",
        care: "Muntazam asos. Tegishli matoga bo'lgan chalkashlarni tozalash. To'g'ri quyosh nurlaridan himoya qiling.",
      },
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
      {
        id: "2-walnut",
        material: "Walnut",
        price: 8900,
        stock: 2,
      },
      {
        id: "2-oak",
        material: "Oak",
        price: 7850,
        stock: 1,
      },
    ],
    discount: 5,
    isFeatured: true,
    sku: "DT-002",
    translations: {
      en: {
        title: "Tavola Dining Table",
        shortDescription: "Sophisticated walnut dining table for elevated entertaining",
        description:
          "Tavola is a statement piece that combines functionality with artistic design. Constructed from premium walnut wood, this dining table features clean lines and a minimalist aesthetic. The expansive top accommodates up to 8 guests, making it ideal for both intimate dinners and larger gatherings. Its sturdy base ensures stability while maintaining an elegant profile.",
        category: "Dining",
        material: "Walnut Wood, Oak",
        color: "Natural",
        style: "Modern",
        dimensions: "W: 200cm | D: 100cm | H: 75cm | Seats 8",
        care: "Wipe with soft, dry cloth. Use wood oil every 3 months. Protect from liquid spills.",
      },
      ru: {
        title: "Стол Tavola",
        shortDescription: "Изысканный ореховый обеденный стол",
        description:
          "Tavola - это изделие, которое сочетает функциональность с художественным дизайном. Изготовленный из премиум-ореха, этот обеденный стол отличается чистыми линиями и минималистической эстетикой. Просторная поверхность вмещает до 8 гостей, что идеально подходит как для интимных ужинов, так и для больших встреч. Его прочная база обеспечивает устойчивость при сохранении элегантного профиля.",
        category: "Столовая",
        material: "Ореховое дерево, Дуб",
        color: "Натуральный",
        style: "Современный",
        dimensions: "Ш: 200см | Г: 100см | В: 75см | Вмещает 8",
        care: "Протирайте мягкой сухой тканью. Используйте масло для дерева каждые 3 месяца. Защищайте от пролива жидкости.",
      },
      uz: {
        title: "Tavola Stoli",
        shortDescription: "Sofistikatsiyalangan yog'och ovqat stoli",
        description:
          "Tavola - bu funksiyallikni badiiy dizayn bilan birlashtiradigan asos bo'lmish mahsulot. Premium yog'ochdan tayyorlangan, bu ovqat stoli toza chiziqlar va minimalista estetikaga ega. Keng yuqori qismi 8 nomdan ortiq mehmanni joylashtiraladi, bu intim kechalar va katta uchrashuvlar uchun ideal. Uning mustahkam asos barqarorlikni ta'minlaydi va elegant shaklini saqlaydi.",
        category: "Ovqatxona",
        material: "Yog'och, Arap qurollari",
        color: "Tabiiy",
        style: "Zamonaviy",
        dimensions: "K: 200cm | C: 100cm | B: 75cm | 8 o'rinlik",
        care: "Yumshoq quruq matoga suring. Har 3 oyda yog'och moyli ishlating. Suyuq to'kish orqali himoya qiling.",
      },
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
      {
        id: "3-gold",
        color: "Gold",
        price: 1850,
        stock: 15,
      },
      {
        id: "3-black",
        color: "Black",
        price: 1850,
        stock: 10,
      },
    ],
    discount: 0,
    isFeatured: false,
    sku: "LAMP-003",
    translations: {
      en: {
        title: "Luce Floor Lamp",
        shortDescription: "Contemporary brass floor lamp with warm ambient lighting",
        description:
          "Luce is a statement lighting fixture that transforms any room with its warm, diffused glow. Featuring a sleek brass construction, this floor lamp combines modern aesthetics with functional illumination. The adjustable head allows for directional lighting, making it perfect for reading or creating ambient atmosphere. A minimalist design that complements any interior style.",
        category: "Lighting",
        material: "Brass",
        color: "Gold, Black",
        style: "Contemporary",
        dimensions: "W: 35cm | D: 45cm | H: 160cm",
        care: "Dust brass regularly with soft cloth. LED bulb included. Avoid water contact.",
      },
      ru: {
        title: "Светильник Luce",
        shortDescription: "Современный латунный торшер с теплым светом",
        description:
          "Luce - это дизайнерский светильник, который преобразует любую комнату теплым, рассеянным светом. Отличаясь элегантной латунной конструкцией, этот торшер сочетает современную эстетику с функциональным освещением. Регулируемая головка позволяет направлять свет, что идеально подходит для чтения или создания уютной атмосферы. Минималистичный дизайн дополняет любой стиль интерьера.",
        category: "Освещение",
        material: "Латунь",
        color: "Золото, Черный",
        style: "Современный",
        dimensions: "Ш: 35см | Г: 45см | В: 160см",
        care: "Регулярно протирайте латунь мягкой тканью. Светодиодная лампочка в комплекте. Избегайте контакта с водой.",
      },
      uz: {
        title: "Luce Chiroq",
        shortDescription: "Zamonaviy brass pol chiroqi iliq nur bilan",
        description:
          "Luce - bu amal qilish svetski fiksturasi bo'lib, har qandayy xonani iliq, tarqoq nur bilan o'zgartiradi. Siliq brass konstruktsiyasining xususiyatini ko'rsatuvchi, bu pol chiroqi zamonaviy estetikani funksional yoritish bilan birlashtiradi. Reglanuvchan bosh tomanlash uchun yoqing, bu o'qish yoki qulay atmosfera yaratish uchun juda mos. Minimal dizayn har qandayy ichki usluba uchun to'q deb baholandi.",
        category: "Yoritish",
        material: "Latun",
        color: "Oltin, Qora",
        style: "Zamonaviy",
        dimensions: "K: 35cm | C: 45cm | B: 160cm",
        care: "Muntazam yumshoq matoga latunni chang. LED lampochka birga kiritilgan. Suv kontakti bilan ijrodan saqlanish.",
      },
    },
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    slug: "ottoman-harmony",
    image: armchairImage,
    images: [armchairImage],
    basePrice: 1250,
    stock: 18,
    variants: [
      {
        id: "4-grey",
        color: "Grey",
        price: 1250,
        stock: 10,
      },
      {
        id: "4-cream",
        color: "Cream",
        price: 1250,
        stock: 8,
      },
    ],
    discount: 10,
    isFeatured: false,
    sku: "OTTO-004",
    translations: {
      en: {
        title: "Harmony Ottoman",
        shortDescription: "Soft upholstered ottoman for versatile comfort",
        description:
          "The Harmony Ottoman is the perfect complement to any seating arrangement. Upholstered in premium linen fabric, this piece serves as both a footrest and additional seating. Its cube-like design fits seamlessly into modern interiors, while its soft structure provides comfortable support.",
        category: "Seating",
        material: "Linen Fabric",
        color: "Grey, Cream",
        style: "Modern",
        dimensions: "W: 60cm | D: 60cm | H: 45cm",
        care: "Vacuum regularly. Spot clean with damp cloth. Air dry.",
      },
      ru: {
        title: "Пуф Harmony",
        shortDescription: "Мягкий пуф для комфорта и универсальности",
        description:
          "Пуф Harmony - идеальное дополнение к любой зоне отдыха. Обитый премиум-льняной тканью, этот предмет служит как подставкой для ног, так и дополнительным сиденьем. Его кубический дизайн легко вписывается в современные интерьеры, а мягкая конструкция обеспечивает комфортную поддержку.",
        category: "Мебель для сидения",
        material: "Льняная ткань",
        color: "Серый, Кремовый",
        style: "Современный",
        dimensions: "Ш: 60см | Г: 60см | В: 45см",
        care: "Регулярно пылесосьте. Протирайте влажной тканью. Пусть высыхает на воздухе.",
      },
      uz: {
        title: "Harmony Ottoman",
        shortDescription: "Yumshoq o'tirish o'tagi o'zgaruvchan qulaylik uchun",
        description:
          "Harmony Ottoman har qandayy o'tirish tartibiga to'q rasm. Premium linen tkanicha o'ralgan, bu mahsulot oyoq o'rnatish va qo'shimcha o'tirish sifatida xizmat qiladi. Uning kub-kabi dizayni zamonaviy interyer uchun muvozanatli ravishda joylashadi, uning yumshoq strukturasi qulay qo'llab-quvvatlashni ta'minlaydi.",
        category: "O'tirish mebeli",
        material: "Linen tkanin",
        color: "Kulrang, Krim",
        style: "Zamonaviy",
        dimensions: "K: 60cm | C: 60cm | B: 45cm",
        care: "Muntazam asos. Bo'z matoga no'qta tozalash. Hava quritish.",
      },
    },
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
];

/**
 * Get product by ID
 */
export function getProductById(productId: string): CatalogProduct | undefined {
  return catalogData.find((product) => product.id === productId);
}

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return catalogData.find((product) => product.slug === slug);
}

/**
 * Get all featured products
 */
export function getFeaturedProducts(): CatalogProduct[] {
  return catalogData.filter((product) => product.isFeatured);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): CatalogProduct[] {
  return catalogData.filter(
    (product) =>
      product.translations.en.category.toLowerCase() ===
      category.toLowerCase()
  );
}

/**
 * Reduce stock for a product variant
 * @param productId - The product ID
 * @param variantId - The specific variant ID
 * @param quantity - The quantity to deduct
 * @returns true if successful, false if insufficient stock
 */
export function reduceStock(
  productId: string,
  variantId?: string,
  quantity: number = 1
): boolean {
  const product = catalogData.find((p) => p.id === productId);
  if (!product) return false;

  if (variantId) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant || variant.stock < quantity) return false;
    variant.stock -= quantity;
  } else {
    if (product.stock < quantity) return false;
    product.stock -= quantity;
  }

  // Update the product's updatedAt timestamp
  product.updatedAt = new Date();

  return true;
}

/**
 * Increase stock for a product variant (for returns/cancellations)
 */
export function increaseStock(
  productId: string,
  variantId?: string,
  quantity: number = 1
): boolean {
  const product = catalogData.find((p) => p.id === productId);
  if (!product) return false;

  if (variantId) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return false;
    variant.stock += quantity;
  } else {
    product.stock += quantity;
  }

  product.updatedAt = new Date();
  return true;
}

/**
 * Check if product/variant is in stock
 */
export function isInStock(productId: string, variantId?: string): boolean {
  const product = catalogData.find((p) => p.id === productId);
  if (!product) return false;

  if (variantId) {
    const variant = product.variants.find((v) => v.id === variantId);
    return variant ? variant.stock > 0 : false;
  }

  return product.stock > 0;
}

/**
 * Get discounted price
 */
export function getDiscountedPrice(
  basePrice: number,
  discount?: number
): number {
  if (!discount || discount <= 0) return basePrice;
  return Math.round(basePrice * (1 - discount / 100));
}

/**
 * Search products by title (case-insensitive)
 */
export function searchProducts(query: string, language: Language = "en"): CatalogProduct[] {
  const lowerQuery = query.toLowerCase();
  return catalogData.filter((product) =>
    product.translations[language].title.toLowerCase().includes(lowerQuery)
  );
}
