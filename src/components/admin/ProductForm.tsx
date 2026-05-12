import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { VariantEditor, type VariantRow } from "./VariantEditor";
import { MultiLangInput } from "./MultiLangInput";
import { useLanguage } from "@/contexts/useLanguageHook";
import {
  type ProductData,
  type ProductImage,
  type LocalizedString,
  type Collection,
  createApiProduct,
  updateApiProduct,
  getApiProductById,
  getAllCollections,
  createCollection,
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
  "storage",
  "kitchen",
  "garden",
  "office",
  "children",
  "industrial",
  "accessories",
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
  const { t } = useLanguage();
  const isEditing = !!productId;

  // Form state
  const [name, setName] = useState<LocalizedString>(emptyLocalized());
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] =
    useState<LocalizedString>(emptyLocalized());
  const [shortDescription, setShortDescription] =
    useState<LocalizedString>(emptyLocalized());
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subcategory, setSubcategory] = useState("");
  const [collections, setCollections] = useState<string[]>([]);
  const [ikpu, setIkpu] = useState("");
  const [packageNumber, setPackageNumber] = useState("");
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

  // Collections management
  const [collectionsData, setCollectionsData] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [creatingCollection, setCreatingCollection] = useState(false);

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

  // Fetch collections on mount
  useEffect(() => {
    let cancelled = false;
    getAllCollections()
      .then((data) => {
        if (!cancelled) setCollectionsData(data);
      })
      .catch((error) => {
        if (!cancelled) console.error("Failed to fetch collections:", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
        setSubcategory(p.subcategory || "");
        setCollections(p.collections || []);
        setIkpu(p.ikpu || "");
        setPackageNumber(p.packageNumber || "");
        setBasePrice(p.basePrice);
        setVatPercent(p.vatPercent ?? 12);
        setImages(p.images || []);
        setVariants(
          (p.variants || []).map((v) => ({
            ...v,
            _tempId: crypto.randomUUID(),
            _image: null,
          })),
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

    return () => {
      cancelled = true;
    };
  }, [productId, toast]);

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    if (!name.en.trim()) errs.name_en = "Name (EN) is required";
    if (!name.ru.trim()) errs.name_ru = "Name (RU) is required";
    if (!name.uz.trim()) errs.name_uz = "Name (UZ) is required";
    if (!slug.trim()) errs.slug = "Slug is required";
    if (!category) errs.category = "Category is required";
    if (!ikpu.trim()) errs.ikpu = "IKPU (Product Classification) is required";
    if (!packageNumber.trim()) errs.packageNumber = "Package Number is required";
    if (basePrice <= 0) errs.basePrice = "Base price must be greater than 0";
    if (images.length === 0) errs.images = "At least one image is required";

    // Validate variants only if user added any
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.sku.trim())
        errs[`variant_${i}_sku`] = `Variant #${i + 1}: SKU is required`;
      if (v.price <= 0)
        errs[`variant_${i}_price`] = `Variant #${i + 1}: Price must be > 0`;
    }

    // Check duplicate SKUs
    const skus = variants.map((v) => v.sku.trim()).filter(Boolean);
    const dupes = skus.filter((s, i) => skus.indexOf(s) !== i);
    if (dupes.length > 0) errs.variants_dup = `Duplicate SKU: ${dupes[0]}`;

    return errs;
  }, [name, slug, category, ikpu, packageNumber, basePrice, images, variants]);

  const buildPayload = useCallback((): Omit<ProductData, "_id"> => {
    const trimLocalized = (v: LocalizedString): LocalizedString => ({
      en: v.en.trim(),
      ru: v.ru.trim(),
      uz: v.uz.trim(),
    });
    const hasLocalized = (v: LocalizedString) =>
      v.en.trim() || v.ru.trim() || v.uz.trim();
    return {
      name: trimLocalized(name),
      slug: slug.trim(),
      description: hasLocalized(description)
        ? trimLocalized(description)
        : undefined,
      shortDescription: hasLocalized(shortDescription)
        ? trimLocalized(shortDescription)
        : undefined,
      category,
      subcategory: subcategory.trim() || undefined,
      collections: collections.length > 0 ? collections : undefined,
      ikpu: ikpu.trim(),
      packageNumber: packageNumber.trim(),
      basePrice,
      vatPercent,
      images,
      variants: variants.length > 0
        ? variants.map((v) => ({
            sku: v.sku.trim(),
            color: v.color?.trim() || undefined,
            size: v.size?.trim() || undefined,
            material: v.material?.trim() || undefined,
            price: v.price,
            stock: v.stock,
            isActive: v.isActive !== false,
          }))
        : [{
            sku: slug.trim() || "default",
            price: basePrice,
            stock: 1,
            isActive: true,
          }],
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
    name,
    slug,
    description,
    shortDescription,
    category,
    subcategory,
    collections,
    ikpu,
    packageNumber,
    basePrice,
    vatPercent,
    images,
    variants,
    materialFrame,
    materialUpholstery,
    materialLegs,
    dimWidth,
    dimHeight,
    dimDepth,
    weight,
    productionTimeDays,
    warrantyMonths,
    assemblyAvailable,
    assemblyPrice,
    isFeatured,
    isActive,
  ]);

  const handleCreateCollection = useCallback(async () => {
    if (!newCollectionName.trim()) {
      return; // Optional - just clear and don't create
    }

    setCreatingCollection(true);
    try {
      const newCollection = await createCollection({
        name: newCollectionName.toLowerCase().replace(/\s+/g, "-"),
        displayName: newCollectionName,
      });
      setCollectionsData([...collectionsData, newCollection]);
      setCollections([...collections, newCollection.name]);
      setNewCollectionName("");
      toast({
        title: "Success",
        description: "Collection created successfully",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create collection";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setCreatingCollection(false);
    }
  }, [newCollectionName, collectionsData, collections, toast]);

  const handleSubmit = useCallback(async () => {
    console.log("=== SAVE CLICKED ===");
    const errs = validate();
    console.log("Validation errors:", errs);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const missing = Object.values(errs).join("; ");
      console.log("Validation failed:", missing);
      toast({
        title: "Missing required fields",
        description: missing,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload();
      console.log("Payload:", JSON.stringify(payload, null, 2));
      if (isEditing && productId) {
        console.log("Updating product:", productId);
        await updateApiProduct(productId, payload);
        console.log("Product updated successfully");
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        console.log("Creating new product...");
        const result = await createApiProduct(payload);
        console.log("Product created successfully:", result);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      console.error("Save failed:", err);
      const message =
        err instanceof Error ? err.message : "Failed to save product";
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
    errors[key] ? (
      <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
    ) : null;

  return (
    <motion.div className="product-form">
      {/* HEADER */}
      <div className="product-header">
        <div className="product-header-left">
          <button onClick={onClose} className="product-back">
            <ArrowLeft size={18} />
          </button>

          <div>
            <h3 className="product-title">
              {isEditing ? t("admin.editProduct") : t("admin.createProduct")}
            </h3>
            <p className="product-subtitle">
              {isEditing ? t("admin.updateProduct") : t("admin.createNewProduct")}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="product-btn product-btn-primary"
        >
          {saving ? t("admin.saving") : t("admin.save")}
        </button>
      </div>

      {/* BASIC */}
      <section className="product-section">
        <h4 className="product-section-title">{t("admin.basicInfo")}</h4>

        <div className="product-grid product-grid-2">
          <div>
            <MultiLangInput
              value={name}
              onChange={setName}
              label="Name"
              required
            />
            {errors.name && <p className="product-error">{errors.name}</p>}
          </div>

          <div className="product-field">
            <label>Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="product-input"
            />
          </div>
        </div>

        <div className="product-grid product-grid-2">
          <div>
            <label className="block text-sm font-medium mb-2 color: hsl(200 20% 15%)">
              {t("admin.category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="product-input"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="product-field">
            <label>Subcategory</label>
            <input
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              placeholder="e.g., Leather, Wood"
              className="product-input"
            />
          </div>
        </div>

        <div className="product-grid product-grid-2">
          <div className="product-field">
            <label>IKPU (Product Classification) *</label>
            <input
              value={ikpu}
              onChange={(e) => setIkpu(e.target.value)}
              placeholder="e.g., 94.01"
              className="product-input"
              required
            />
            {errors.ikpu && <p className="product-error">{errors.ikpu}</p>}
          </div>

          <div className="product-field">
            <label>Package Number *</label>
            <input
              value={packageNumber}
              onChange={(e) => setPackageNumber(e.target.value)}
              placeholder="e.g., PKG-001"
              className="product-input"
              required
            />
            {errors.packageNumber && <p className="product-error">{errors.packageNumber}</p>}
          </div>
        </div>
      </section>

      {/* DESCRIPTIONS */}
      <section className="product-section">
        <h4 className="product-section-title">{t("admin.descriptions")}</h4>

        <MultiLangInput
          value={shortDescription}
          onChange={setShortDescription}
          label="Short Description"
          multiline
          rows={2}
        />

        <MultiLangInput
          value={description}
          onChange={setDescription}
          label={t("admin.description")}
          multiline
          rows={4}
        />
      </section>

      {/* PRICING */}
      <section className="product-section">
        <h4 className="product-section-title">{t("admin.pricing")}</h4>

        <div className="product-grid product-grid-2">
          <div className="product-field">
            <label>Base Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="product-input"
            />
          </div>

          <div className="product-field">
            <label>VAT Percent (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={vatPercent}
              onChange={(e) => setVatPercent(Number(e.target.value))}
              className="product-input"
            />
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="product-section">
        <h4 className="product-section-title">{t("admin.collections")}</h4>

        <div className="product-collections">
          {collectionsData.map((col) => (
            <button
              key={col._id}
              type="button"
              className={`product-collection ${
                collections.includes(col.name) ? "active" : ""
              }`}
              onClick={() => {
                if (collections.includes(col.name)) {
                  setCollections(
                    collections.filter((name) => name !== col.name),
                  );
                } else {
                  setCollections([...collections, col.name]);
                }
              }}
            >
              {col.displayName || col.name}
            </button>
          ))}
        </div>

        <div className="product-grid" style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder={t("admin.newCollectionName")}
              className="product-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCollection();
                }
              }}
            />
            <button
              type="button"
              onClick={handleCreateCollection}
              disabled={creatingCollection || !newCollectionName.trim()}
              className="product-btn product-btn-primary"
              style={{ whiteSpace: "nowrap", minWidth: "100px" }}
            >
              {creatingCollection ? "..." : t("admin.addCollection")}
            </button>
          </div>
        </div>
      </section>

      {/* PHYSICAL PROPERTIES */}
      <section className="product-section">
        <h4 className="product-section-title">{t("admin.physicalProperties")}</h4>

        <div className="product-grid product-grid-3">
          <div className="product-field">
            <label>Frame Material</label>
            <input
              value={materialFrame}
              onChange={(e) => setMaterialFrame(e.target.value)}
              placeholder="e.g., Oak, Walnut"
              className="product-input"
            />
          </div>

          <div className="product-field">
            <label>Upholstery</label>
            <input
              value={materialUpholstery}
              onChange={(e) => setMaterialUpholstery(e.target.value)}
              placeholder="e.g., Linen, Leather"
              className="product-input"
            />
          </div>

          <div className="product-field">
            <label>Legs Material</label>
            <input
              value={materialLegs}
              onChange={(e) => setMaterialLegs(e.target.value)}
              placeholder="e.g., Metal, Wood"
              className="product-input"
            />
          </div>
        </div>

        <div className="product-grid product-grid-4">
          <div className="product-field">
            <label>Width (cm)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={dimWidth}
              onChange={(e) =>
                setDimWidth(e.target.value ? Number(e.target.value) : "")
              }
              className="product-input"
            />
          </div>

          <div className="product-field">
            <label>Height (cm)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={dimHeight}
              onChange={(e) =>
                setDimHeight(e.target.value ? Number(e.target.value) : "")
              }
              className="product-input"
            />
          </div>

          <div className="product-field">
            <label>Depth (cm)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={dimDepth}
              onChange={(e) =>
                setDimDepth(e.target.value ? Number(e.target.value) : "")
              }
              className="product-input"
            />
          </div>

          <div className="product-field">
            <label>Weight (kg)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value ? Number(e.target.value) : "")
              }
              className="product-input"
            />
          </div>
        </div>
      </section>

      {/* PRODUCTION & WARRANTY */}
      <section className="product-section">
        <h4 className="product-section-title">{t("admin.productionAndWarranty")}</h4>

        <div className="product-grid product-grid-3">
          <div className="product-field">
            <label>Production Time (days)</label>
            <input
              type="number"
              min="0"
              value={productionTimeDays}
              onChange={(e) =>
                setProductionTimeDays(e.target.value ? Number(e.target.value) : "")
              }
              className="product-input"
            />
          </div>

          <div className="product-field">
            <label>Warranty (months)</label>
            <input
              type="number"
              min="0"
              value={warrantyMonths}
              onChange={(e) =>
                setWarrantyMonths(e.target.value ? Number(e.target.value) : "")
              }
              className="product-input"
            />
          </div>

          <div className="product-field">
            <label>Assembly Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={assemblyPrice}
              onChange={(e) => setAssemblyPrice(Number(e.target.value))}
              disabled={!assemblyAvailable}
              className="product-input"
            />
          </div>
        </div>

        <div>
          <label className="product-checkbox">
            <input
              type="checkbox"
              checked={assemblyAvailable}
              onChange={(e) => setAssemblyAvailable(e.target.checked)}
            />
            <span>Assembly Available</span>
          </label>
        </div>
      </section>

      {/* FLAGS */}
      <section className="product-section">
        <h4 className="product-section-title">{t("admin.statusAndVisibility")}</h4>

        <div className="product-grid">
          <label className="product-checkbox">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>Active</span>
          </label>

          <label className="product-checkbox">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <span>Featured</span>
          </label>
        </div>
      </section>

      {/* IMAGES */}
      <section className="product-section">
        <h4 className="product-section-title">{t("admin.images")}</h4>
        <ImageUploader images={images} onChange={setImages} />
      </section>

      {/* VARIANTS */}
      <section className="product-section">
        <h4 className="product-section-title">{t("admin.variants")}</h4>
        <VariantEditor
          variants={variants}
          onChange={setVariants}
          basePrice={basePrice}
        />
      </section>

      {/* FOOTER */}
      <div className="product-footer">
        <button
          onClick={handleSubmit}
          className="product-btn product-btn-primary"
        >
          {t("admin.save")}
        </button>

        <button onClick={onClose} className="product-btn product-btn-outline">
          {t("admin.cancel")}
        </button>
      </div>
    </motion.div>
  );
}
