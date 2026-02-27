// order_calculation.service.js
import Product from "../models/product.model.js";

export const calculateOrder = async (cart) => {
  if (!cart || !cart.items.length) {
    throw new Error("Cart is empty");
  }

  let subtotal = 0;
  let assemblyTotal = 0;
  let vatTotal = 0;

  const calculatedItems = [];

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.product);

    if (!product || !product.isActive) {
      throw new Error("Product not available");
    }

    let price = product.basePrice;
    let variantData = null;

    if (cartItem.variantSku) {
      const variant = product.variants.find(
        v => v.sku === cartItem.variantSku && v.isActive
      );

      if (!variant) {
        throw new Error("Variant not found");
      }

      if (variant.stock < cartItem.quantity) {
        throw new Error("Insufficient stock");
      }

      price = variant.price;
      variantData = {
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
      };
    } else {
      if (product.totalStock < cartItem.quantity) {
        throw new Error("Insufficient stock");
      }
    }

    const itemSubtotal = price * cartItem.quantity;

    // Assembly
    let assemblyCost = 0;
    if (cartItem.assemblySelected && product.assemblyAvailable) {
      assemblyCost = (product.assemblyPrice || 0) * cartItem.quantity;
      assemblyTotal += assemblyCost;
    }

    // VAT
    const vatAmount =
      ((itemSubtotal + assemblyCost) * product.vatPercent) / 100;

    vatTotal += vatAmount;
    subtotal += itemSubtotal;

    calculatedItems.push({
      productId: product._id,
      nameSnapshot: product.name,
      priceSnapshot: price,
      variantSnapshot: variantData,
      quantity: cartItem.quantity,
      assemblySelected: cartItem.assemblySelected,
      assemblyPriceSnapshot: assemblyCost,
      totalItemPrice: itemSubtotal + assemblyCost + vatAmount,
    });
  }

  // Простая логика доставки (можно усложнить позже)
  const deliveryPrice = subtotal > 10000000 ? 0 : 50000;

  const grandTotal =
    subtotal + assemblyTotal + vatTotal + deliveryPrice;

  return {
    items: calculatedItems,
    subtotal,
    assemblyTotal,
    vatTotal,
    deliveryPrice,
    grandTotal,
    currency: "UZS",
  };
};