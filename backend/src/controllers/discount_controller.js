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

    console.log("📦 GET ALL DISCOUNTS DEBUG:");
    console.log("  - Active only:", activeOnly);
    console.log("  - Total discounts:", discounts.length);
    discounts.forEach((d, i) => {
      console.log(`  - Discount ${i}: "${d.title?.en}" - productIds:`, d.productIds);
    });

    res.status(200).json({
      success: true,
      data: discounts,
    });
  } catch (error) {
    console.error("❌ GET DISCOUNTS ERROR:", error.message);
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

    console.log("🔍 CREATE DISCOUNT - RECEIVED DATA:");
    console.log("  - Full body:", JSON.stringify(req.body, null, 2));
    console.log("  - Percentage:", percentage, "Type:", typeof percentage);
    console.log("  - ProductIds:", productIds, "Type:", typeof productIds, "Is Array:", Array.isArray(productIds));
    console.log("  - IsActive:", isActive, "Type:", typeof isActive);

    // Validation
    if (percentage === undefined || percentage === null) {
      console.log("❌ Validation failed: percentage is undefined/null");
      return res.status(400).json({
        success: false,
        message: "Discount percentage is required",
      });
    }

    const percentageNum = Number(percentage);
    if (isNaN(percentageNum) || percentageNum <= 0 || percentageNum > 100) {
      console.log("❌ Validation failed: percentage out of range:", percentageNum);
      return res.status(400).json({
        success: false,
        message: "Discount percentage must be between 1 and 100",
      });
    }

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      console.log("❌ Validation failed: productIds invalid:", productIds);
      return res.status(400).json({
        success: false,
        message: "At least one product ID is required",
      });
    }

    const discount = new Discount({
      title: title || { en: "", ru: "", uz: "" },
      description: description || { en: "", ru: "", uz: "" },
      percentage: percentageNum,
      productIds,
      image,
      isActive: isActive !== false,
      startDate,
      endDate,
      order,
    });

    await discount.save();

    console.log("✅ DISCOUNT SAVED:", discount._id);

    res.status(201).json({
      success: true,
      message: "Discount created successfully",
      data: discount,
    });
  } catch (error) {
    console.error("❌ CREATE DISCOUNT ERROR:", error.message);
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
