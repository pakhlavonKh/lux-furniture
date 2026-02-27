import Product from "../models/product.model.js";

/**
 * Reserve stock
 */
export const reserveStock = async (cart, session) => {
  for (const item of cart.items) {
    const product = await Product.findById(item.product).session(session);

    if (!product || !product.isActive) {
      throw new Error("Product not available");
    }

    if (!item.variantSku) {
      throw new Error("Variant required for stock control");
    }

    const variant = product.variants.find(
      v => v.sku === item.variantSku && v.isActive
    );

    if (!variant) {
      throw new Error("Variant not found");
    }

    if (variant.stock < item.quantity) {
      throw new Error("Insufficient stock");
    }

    variant.stock -= item.quantity;

    await product.save({ session });
  }
};

/**
 * Release stock (cancel order)
 */
export const releaseStock = async (order, session) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product).session(session);

    if (!product) continue;

    const sku = item.variantSnapshot?.sku;

    if (!sku) continue;

    const variant = product.variants.find(v => v.sku === sku);

    if (variant) {
      variant.stock += item.quantity;
    }

    await product.save({ session });
  }
};