// backend/src/controllers/collection.controller.js
import Collection from "../models/collection.model.js";

/* ===========================
   GET ALL COLLECTIONS
=========================== */
export const getAllCollections = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active === "true") filter.isActive = true;

    const collections = await Collection.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching collections",
      error: error.message,
    });
  }
};

/* ===========================
   GET COLLECTION BY ID
=========================== */
export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching collection",
      error: error.message,
    });
  }
};

/* ===========================
   CREATE COLLECTION
=========================== */
export const createCollection = async (req, res) => {
  try {
    const { name, displayName, description, image, order, isActive } = req.body;

    if (!name || !displayName) {
      return res.status(400).json({
        success: false,
        message: "Name and displayName are required",
      });
    }

    const existing = await Collection.findOne({ name: name.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A collection with this name already exists",
      });
    }

    const collection = await Collection.create({
      name: name.toLowerCase(),
      displayName,
      description,
      image,
      order: order ?? 0,
      isActive: isActive !== false,
    });

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: collection,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating collection",
      error: error.message,
    });
  }
};

/* ===========================
   UPDATE COLLECTION
=========================== */
export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If name is being changed, check uniqueness
    if (updates.name) {
      const existing = await Collection.findOne({
        name: updates.name.toLowerCase(),
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "A collection with this name already exists",
        });
      }
      updates.name = updates.name.toLowerCase();
    }

    const collection = await Collection.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      data: collection,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating collection",
      error: error.message,
    });
  }
};

/* ===========================
   DELETE COLLECTION
=========================== */
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByIdAndDelete(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting collection",
      error: error.message,
    });
  }
};
