// backend/src/controllers/news_controller.js
import News from "../models/news.model.js";

/* ===========================
   GET ALL NEWS
=========================== */
export const getAllNews = async (req, res) => {
  try {
    const activeOnly = req.query.active === "true";
    
    const filter = activeOnly ? { isActive: true } : {};
    const news = await News.find(filter)
      .sort({ order: 1, publishedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching news",
      error: error.message,
    });
  }
};

/* ===========================
   GET SINGLE NEWS
=========================== */
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching news",
      error: error.message,
    });
  }
};

/* ===========================
   CREATE NEWS
=========================== */
export const createNews = async (req, res) => {
  try {
    const { title, description, content, image, isActive, order } = req.body;

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

    const news = new News({
      title,
      description,
      content,
      image,
      isActive,
      order,
    });

    await news.save();

    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating news",
      error: error.message,
    });
  }
};

/* ===========================
   UPDATE NEWS
=========================== */
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const news = await News.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating news",
      error: error.message,
    });
  }
};

/* ===========================
   DELETE NEWS
=========================== */
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News deleted successfully",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting news",
      error: error.message,
    });
  }
};
