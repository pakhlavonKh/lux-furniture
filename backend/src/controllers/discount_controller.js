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
    const { title, description, percentage, productIds, image, isActive, startDate, endDate, code, order } = req.body;

    if (!title || !description || percentage === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and percentage are required",
      });
    }

    const discount = new Discount({
      title,
      description,
      percentage,
      productIds: productIds || [],
      image,
      isActive,
      startDate,
      endDate,
      code,
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
