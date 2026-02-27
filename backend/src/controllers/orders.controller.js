import Order from "../models/order.model.js";

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product")
      .lean();

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};