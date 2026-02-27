// cart_merge.js
import Cart from "../models/cart.model.js";

export const mergeCarts = async (guestId, userId) => {
  const guestCart = await Cart.findOne({ guestId });
  if (!guestCart) return;

  let userCart = await Cart.findOne({ user: userId });

  if (!userCart) {
    guestCart.user = userId;
    guestCart.guestId = undefined;
    await guestCart.save();
    return;
  }

  guestCart.items.forEach(guestItem => {
    const existing = userCart.items.find(
      item =>
        item.product.toString() === guestItem.product.toString() &&
        item.variantSku === guestItem.variantSku
    );

    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      userCart.items.push(guestItem);
    }
  });

  await userCart.save();
  await Cart.deleteOne({ _id: guestCart._id });
};