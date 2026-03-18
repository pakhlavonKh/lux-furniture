import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { VariantEditor, type VariantRow } from "./VariantEditor";
import { MultiLangInput } from "./MultiLangInput";
import {
  type ProductData,
  type ProductImage,
  type LocalizedString,
  createApiProduct,
  updateApiProduct,
  getApiProductById,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  productId?: string | null;
  onClose: () => void;
  onSaved: () => void;
}

const inputCls =
  "w-full px-4 py-2 border border-border bg-transparent text-sm rounded focus:border-foreground focus:outline-none transition-colors";

const CATEGORIES = [
  "storage", "kitchen", "garden", "office", "children", "industrial", "accessories",
];

const COLLECTIONS = [
  "artVision", "drive", "genesis", "alto", "metar", "negoziatore", "vesta", "altagama", "goliath",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface FormErrors {
  [key: string]: string;
}

const emptyLocalized = (): LocalizedString => ({ en: "", ru: "", uz: "" });

export function ProductForm({ productId, onClose, onSaved }: ProductFormProps) {
  const { toast } = useToast();
  const isEditing = !!productId;

  // Form state
  const [name, setName] = useState<LocalizedString>(emptyLocalized());
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState<LocalizedString>(emptyLocalized());
  const [shortDescription, setShortDescription] = useState<LocalizedString>(emptyLocalized());
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [collections, setCollections] = useState<string[]>([]);
  const [basePrice, setBasePrice] = useState(0);
  const [vatPercent, setVatPercent] = useState(12);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);

  // Physical
  const [materialFrame, setMaterialFrame] = useState("");
  const [materialUpholstery, setMaterialUpholstery] = useState("");
  const [materialLegs, setMaterialLegs] = useState("");
  const [dimWidth, setDimWidth] = useState<number | "">("");
  const [dimHeight, setDimHeight] = useState<number | "">("");
  const [dimDepth, setDimDepth] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");

  // Production
  const [productionTimeDays, setProductionTimeDays] = useState<number | "">("");
  const [warrantyMonths, setWarrantyMonths] = useState<number | "">("");
  const [assemblyAvailable, setAssemblyAvailable] = useState(false);
  const [assemblyPrice, setAssemblyPrice] = useState(0);

  // Flags
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // UI state
  const [saving, setSaving] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Auto-slug from name
  useEffect(() => {
    if (!slugManual && !isEditing) {
      setSlug(slugify(name.en));
    }
  }, [name.en, slugManual, isEditing]);

  // Load product data when editing
  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    setLoadingProduct(true);

    getApiProductById(productId)
      .then((p) => {
        if (cancelled) return;
        setName(p.name || emptyLocalized());
        setSlug(p.slug);
        setSlugManual(true);
        setDescription(p.description || emptyLocalized());
        setShortDescription(p.shortDescription || emptyLocalized());
        setCategory(p.category);
        setCollections(p.collections || []);
        setBasePrice(p.basePrice);
        setVatPercent(p.vatPercent ?? 12);
        setImages(p.images || []);
        setVariants(
          (p.variants || []).map((v) => ({
            ...v,
            _tempId: crypto.randomUUID(),
            _image: null,
          }))
        );
        setMaterialFrame(p.materials?.frame || "");
        setMaterialUpholstery(p.materials?.upholstery || "");
        setMaterialLegs(p.materials?.legs || "");
        setDimWidth(p.dimensions?.width ?? "");
        setDimHeight(p.dimensions?.height ?? "");
        setDimDepth(p.dimensions?.depth ?? "");
        setWeight(p.weight ?? "");
        setProductionTimeDays(p.productionTimeDays ?? "");
        setWarrantyMonths(p.warrantyMonths ?? "");
        setAssemblyAvailable(p.assemblyAvailable ?? false);
        setAssemblyPrice(p.assemblyPrice ?? 0);
        setIsFeatured(p.isFeatured ?? false);
        setIsActive(p.isActive ?? true);
      })
      .catch((err) => {
        if (!cancelled) {
          toast({
            title: "Error",
            description: err.message || "Failed to load product",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProduct(false);
      });

    return () => { cancelled = true; };
  }, [productId, toast]);

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    if (!name.en.trim() || !name.ru.trim() || !name.uz.trim()) errs.name = "Name is required in all 3 languages";
    if (!slug.trim()) errs.slug = "Slug is required";
    if (!category) errs.category = "Category is required";
    if (basePrice <= 0) errs.basePrice = "Base price must be greater than 0";
    if (images.length === 0) errs.images = "At least one image is required";
    if (variants.length === 0) errs.variants = "At least one variant is required";

    // Validate each variant
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.sku.trim()) errs[`variant_${i}_sku`] = `Variant #${i + 1}: SKU is required`;
      if (v.price <= 0) errs[`variant_${i}_price`] = `Variant #${i + 1}: Price must be > 0`;
    }

    // Check duplicate SKUs
    const skus = variants.map((v) => v.sku.trim()).filter(Boolean);
    const dupes = skus.filter((s, i) => skus.indexOf(s) !== i);
    if (dupes.length > 0) errs.variants_dup = `Duplicate SKU: ${dupes[0]}`;

    return errs;
  }, [name, slug, category, basePrice, images, variants]);

  const buildPayload = useCallback((): Omit<ProductData, "_id"> => {
    const trimLocalized = (v: LocalizedString): LocalizedString => ({
      en: v.en.trim(),
      ru: v.ru.trim(),
      uz: v.uz.trim(),
    });
    const hasLocalized = (v: LocalizedString) => v.en.trim() || v.ru.trim() || v.uz.trim();
    return {
      name: trimLocalized(name),
      slug: slug.trim(),
      description: hasLocalized(description) ? trimLocalized(description) : undefined,
      shortDescription: hasLocalized(shortDescription) ? trimLocalized(shortDescription) : undefined,
      category,
      collections: collections.length > 0 ? collections : undefined,
      basePrice,
      vatPercent,
      images,
      variants: variants.map((v) => ({
        sku: v.sku.trim(),
        color: v.color?.trim() || undefined,
        size: v.size?.trim() || undefined,
        material: v.material?.trim() || undefined,
        price: v.price,
        stock: v.stock,
        isActive: v.isActive !== false,
      })),
      materials:
        materialFrame || materialUpholstery || materialLegs
          ? {
              frame: materialFrame || undefined,
              upholstery: materialUpholstery || undefined,
              legs: materialLegs || undefined,
            }
          : undefined,
      dimensions:
        dimWidth || dimHeight || dimDepth
          ? {
              width: dimWidth || undefined,
              height: dimHeight || undefined,
              depth: dimDepth || undefined,
            }
          : undefined,
      weight: weight || undefined,
      productionTimeDays: productionTimeDays || undefined,
      warrantyMonths: warrantyMonths || undefined,
      assemblyAvailable,
      assemblyPrice: assemblyAvailable ? assemblyPrice : undefined,
      isFeatured,
      isActive,
    };
  }, [
    name, slug, description, shortDescription, category, collections,
    basePrice, vatPercent, images, variants,
    materialFrame, materialUpholstery, materialLegs,
    dimWidth, dimHeight, dimDepth, weight,
    productionTimeDays, warrantyMonths, assemblyAvailable, assemblyPrice,
    isFeatured, isActive,
  ]);

  const handleSubmit = useCallback(async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast({
        title: "Validation Error",
        description: Object.values(errs)[0],
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEditing && productId) {
        await updateApiProduct(productId, payload);
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        await createApiProduct(payload);
        toast({ title: "Success", description: "Product created successfully" });
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save product";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [validate, buildPayload, isEditing, productId, toast, onSaved, onClose]);

  if (loadingProduct) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const fieldError = (key: string) =>
    errors[key] ? <p className="text-xs text-red-500 mt-1">{errors[key]}</p> : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="heading-card mb-0.5">
              {isEditing ? "Edit Product" : "Create New Product"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isEditing ? "Update product details and variants" : "Fill in product details, images, and variants"}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="btn-luxury flex items-center gap-2 text-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </motion.button>
      </div>

      <div className="space-y-8">
        {/* ===== BASIC INFO ===== */}
        <section>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <MultiLangInput
                value={name}
                onChange={setName}
                label="Name"
                required
                placeholder="e.g. Aria Lounge Chair"
              />
              {fieldError("name")}
            </div>
            <div>
              <label className="text-caption mb-2 block font-medium">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManual(true);
                }}
                className={inputCls}
                placeholder="auto-generated-from-name"
              />
              {fieldError("slug")}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <MultiLangInput
                value={shortDescription}
                onChange={setShortDescription}
                label="Short Description"
                placeholder="Brief product tagline"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-caption mb-2 block font-medium">Base Price (UZS) *</label>
                <input
                  type="number"
                  min="0"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
                  className={inputCls}
                />
                {fieldError("basePrice")}
              </div>
              <div>
                <label className="text-caption mb-2 block font-medium">VAT %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={vatPercent}
                  onChange={(e) => setVatPercent(Number(e.target.value) || 0)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <MultiLangInput
              value={description}
              onChange={setDescription}
              label="Description"
              multiline
              rows={4}
              placeholder="Detailed product description"
            />
          </div>
        </section>

        {/* ===== CLASSIFICATION ===== */}
        <section>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
            Classification
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-caption mb-2 block font-medium">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              {fieldError("category")}
            </div>
          </div>
          <div className="mt-4">
            <label className="text-caption mb-2 block font-medium">Collections</label>
            <div className="flex flex-wrap gap-2">
              {COLLECTIONS.map((c) => (
                <label
                  key={c}
                  className={`flex items-center gap-1.5 text-sm px-3 py-1.5 border rounded cursor-pointer transition-colors ${
                    collections.includes(c)
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={collections.includes(c)}
                    onChange={(e) => {
                      setCollections(
                        e.target.checked
                          ? [...collections, c]
                          : collections.filter((x) => x !== c)
                      );
                    }}
                    className="sr-only"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* ===== IMAGES ===== */}
        <section>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
            Product Images
          </h4>
          <ImageUploader images={images} onChange={setImages} label="Upload product images *" />
          {fieldError("images")}
        </section>

        {/* ===== VARIANTS ===== */}
        <section>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
            Variants & Stock
          </h4>
          <VariantEditor variants={variants} onChange={setVariants} basePrice={basePrice} />
          {fieldError("variants")}
          {fieldError("variants_dup")}
          {/* Show individual variant errors */}
          {Object.entries(errors)
            .filter(([k]) => k.startsWith("variant_"))
            .map(([k, v]) => (
              <p key={k} className="text-xs text-red-500 mt-1">{v}</p>
            ))}
        </section>

        {/* ===== PHYSICAL & PRODUCTION ===== */}
        <section>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
            Physical Properties & Production
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Frame Material</label>
              <input
                type="text"
                value={materialFrame}
                onChange={(e) => setMaterialFrame(e.target.value)}
                className={inputCls}
                placeholder="e.g. Steel"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Upholstery</label>
              <input
                type="text"
                value={materialUpholstery}
                onChange={(e) => setMaterialUpholstery(e.target.value)}
                className={inputCls}
                placeholder="e.g. Leather"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Legs Material</label>
              <input
                type="text"
                value={materialLegs}
                onChange={(e) => setMaterialLegs(e.target.value)}
                className={inputCls}
                placeholder="e.g. Wood"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
              <input
                type="number"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Width (cm)</label>
              <input
                type="number"
                min="0"
                value={dimWidth}
                onChange={(e) => setDimWidth(e.target.value ? Number(e.target.value) : "")}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Height (cm)</label>
              <input
                type="number"
                min="0"
                value={dimHeight}
                onChange={(e) => setDimHeight(e.target.value ? Number(e.target.value) : "")}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Depth (cm)</label>
              <input
                type="number"
                min="0"
                value={dimDepth}
                onChange={(e) => setDimDepth(e.target.value ? Number(e.target.value) : "")}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Production (days)</label>
              <input
                type="number"
                min="0"
                value={productionTimeDays}
                onChange={(e) => setProductionTimeDays(e.target.value ? Number(e.target.value) : "")}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Warranty (months)</label>
              <input
                type="number"
                min="0"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value ? Number(e.target.value) : "")}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={assemblyAvailable}
                onChange={(e) => setAssemblyAvailable(e.target.checked)}
                className="w-4 h-4 border border-border rounded cursor-pointer"
              />
              <span className="text-sm">Assembly Available</span>
            </label>
            {assemblyAvailable && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Assembly Price:</label>
                <input
                  type="number"
                  min="0"
                  value={assemblyPrice}
                  onChange={(e) => setAssemblyPrice(Number(e.target.value) || 0)}
                  className="w-32 px-3 py-1.5 border border-border bg-transparent text-sm rounded focus:border-foreground focus:outline-none"
                />
              </div>
            )}
          </div>
        </section>

        {/* ===== STATUS FLAGS ===== */}
        <section>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
            Status
          </h4>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 border border-border rounded cursor-pointer"
              />
              <span className="text-sm">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 border border-border rounded cursor-pointer"
              />
              <span className="text-sm">Active (visible to customers)</span>
            </label>
          </div>
        </section>

        {/* Bottom save */}
        <div className="pt-6 border-t border-border flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="btn-luxury flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
          </motion.button>
          <button
            type="button"
            onClick={onClose}
            className="btn-outline-luxury flex-1 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
