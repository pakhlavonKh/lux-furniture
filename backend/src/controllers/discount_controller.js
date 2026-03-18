// backend/src/controllers/discount_controller.js
import Discount from "../models/discount.model.js";

/* ===========================
   GET ALL DISCOUNTS
=========================== */
export const getAllDiscounts = async (req, res) => {
  try {
    const activeOnly = req.query.active === "true";
    
    const filter = activeOnly ? { isActive: true } : {};
    const discounts = await Discount.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: discounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching discounts",
      error: error.message,
    });
  }
};

/* ===========================
   GET SINGLE DISCOUNT
=========================== */
export const getDiscountById = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findById(id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found",
      });
    }

    res.status(200).json({
      success: true,
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching discount",
      error: error.message,
    });
  }
};

/* ===========================
   CREATE DISCOUNT
=========================== */
export const createDiscount = async (req, res) => {
  try {
    const { title, description, percentage, productIds, image, isActive, startDate, endDate, order } = req.body;

    if (!title?.en || !title?.ru || !title?.uz) {
      return res.status(400).json({
        success: false,
        message: "Title is required in all 3 languages (en, ru, uz)",
      });
    }
    if (!description?.en || !description?.ru || !description?.uz) {
      return res.status(400).json({
        success: false,
        message: "Description is required in all 3 languages (en, ru, uz)",
      });
    }
    if (percentage === undefined) {
      return res.status(400).json({
        success: false,
        message: "Discount percentage is required",
      });
    }

    if (!productIds || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product ID is required",
      });
    }

    const discount = new Discount({
      title,
      description,
      percentage,
      productIds,
      image,
      isActive,
      startDate,
      endDate,
      order,
    });

    await discount.save();

    res.status(201).json({
      success: true,
      message: "Discount created successfully",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating discount",
      error: error.message,
    });
  }
};

/* ===========================
   UPDATE DISCOUNT
=========================== */
export const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const discount = await Discount.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Discount updated successfully",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating discount",
      error: error.message,
    });
  }
};

/* ===========================
   DELETE DISCOUNT
=========================== */
/* ===========================
   GET DISCOUNT FOR PRODUCT
=========================== */
export const getDiscountForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const now = new Date();

    const discount = await Discount.findOne({
      productIds: productId,
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: now } },
      ],
    })
      .sort({ percentage: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: discount || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching discount for product",
      error: error.message,
    });
  }
};

/* ===========================
   DELETE DISCOUNT
=========================== */
export const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const discount = await Discount.findByIdAndDelete(id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Discount deleted successfully",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting discount",
      error: error.message,
    });
  }
};
