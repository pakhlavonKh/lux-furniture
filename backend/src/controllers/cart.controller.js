import Product from "../models/product.model.js";

/**
 * GET CART
 */
export const getCart = async (req, res, next) => {
  try {
    await req.cart.populate("items.product");

    res.json({
      success: true,
      cart: req.cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADD TO CART
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, variantSku, quantity = 1, assemblySelected } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found or inactive",
      });
    }

    let availableStock = 0;

    if (variantSku) {
      const variant = product.variants.find(v => v.sku === variantSku);

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: "Variant not found",
        });
      }

      availableStock = variant.stock;
    } else {
      availableStock = product.stock || 0;
    }

    const existingItem = req.cart.items.find(
      item =>
        item.product.toString() === productId &&
        item.variantSku === variantSku
    );

    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (newQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
      existingItem.assemblySelected = !!assemblySelected;
    } else {
      req.cart.items.push({
        product: productId,
        variantSku,
        quantity,
        assemblySelected: !!assemblySelected,
      });
    }

    await req.cart.save();
    await req.cart.populate("items.product");

    res.json({
      success: true,
      cart: req.cart,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE CART ITEM QUANTITY
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, variantSku, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    const item = req.cart.items.find(
      i =>
        i.product.toString() === productId &&
        i.variantSku === variantSku
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let availableStock = 0;

    if (variantSku) {
      const variant = product.variants.find(v => v.sku === variantSku);
      if (!variant) {
        return res.status(400).json({
          success: false,
          message: "Variant not found",
        });
      }
      availableStock = variant.stock;
    }

    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    item.quantity = quantity;

    await req.cart.save();
    await req.cart.populate("items.product");

    res.json({
      success: true,
      cart: req.cart,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * REMOVE ITEM FROM CART
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, variantSku } = req.body;

    req.cart.items = req.cart.items.filter(
      item =>
        !(
          item.product.toString() === productId &&
          item.variantSku === variantSku
        )
    );

    await req.cart.save();
    await req.cart.populate("items.product");

    res.json({
      success: true,
      cart: req.cart,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * CLEAR CART
 */
export const clearCart = async (req, res, next) => {
  try {
    req.cart.items = [];
    await req.cart.save();

    res.json({
      success: true,
      message: "Cart cleared",
    });

  } catch (error) {
    next(error);
  }
};