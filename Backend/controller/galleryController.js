const fs = require("fs");
const path = require("path");
const Gallery = require("../model/Gallery");

const deleteFile = (url) => {
  if (!url) return;
  try {
    const filePath = path.join(__dirname, "..", url.replace(/^\//, ""));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Failed to delete gallery image file:", url, err.message);
  }
};

const parseJSON = (value, fallback) => {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    return typeof value === "string" ? [value] : fallback;
  }
};

// @desc    Create a new gallery
// @route   POST /api/galleries
const createGallery = async (req, res) => {
  try {
    const { title, category, location, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Gallery title is required" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: "Property category is required" });
    }

    const uploadedImages = req.imageUrls || [];
    const directImages = req.body.images ? parseJSON(req.body.images, []) : [];
    const finalImages = [...uploadedImages, ...directImages];

    if (!finalImages.length) {
      return res.status(400).json({ success: false, message: "At least one gallery image is required" });
    }

    const gallery = await Gallery.create({
      title: title.trim(),
      category: category.trim(),
      location: location ? location.trim() : "",
      description: description ? description.trim() : "",
      status: status || "Published",
      images: finalImages,
    });

    res.status(201).json({
      success: true,
      message: "Property gallery created and saved into database successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Error creating gallery:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create gallery" });
  }
};

// @desc    Get all galleries
// @route   GET /api/galleries
const getGalleries = async (req, res) => {
  try {
    const { search, category, location, status } = req.query;
    const filter = {};

    if (category && category !== "All Property Categories") {
      filter.category = category;
    }
    if (location && location !== "All Locations") {
      filter.location = { $regex: new RegExp(`^${location}$`, "i") };
    }
    if (status && status !== "All Status") {
      filter.status = status;
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    const galleries = await Gallery.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    console.error("Error fetching galleries:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch galleries" });
  }
};

// @desc    Get single gallery by ID
// @route   GET /api/galleries/:id
const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: "Gallery not found" });
    }
    res.status(200).json({ success: true, data: gallery });
  } catch (error) {
    console.error("Error fetching gallery by ID:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to get gallery" });
  }
};

// @desc    Update gallery
// @route   PUT /api/galleries/:id
const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: "Gallery not found" });
    }

    const updates = {};
    if (req.body.title) updates.title = req.body.title.trim();
    if (req.body.category) updates.category = req.body.category.trim();
    if (req.body.location !== undefined) updates.location = req.body.location.trim();
    if (req.body.description !== undefined) updates.description = req.body.description.trim();
    if (req.body.status) updates.status = req.body.status;

    // Handle existing vs removed images
    if (req.body.existingImages !== undefined) {
      const keptImages = parseJSON(req.body.existingImages, []);
      const removedImages = gallery.images.filter((img) => !keptImages.includes(img));
      removedImages.forEach(deleteFile);
      updates.images = [...keptImages, ...(req.imageUrls || [])];
    } else if (req.imageUrls && req.imageUrls.length > 0) {
      updates.images = [...gallery.images, ...req.imageUrls];
    }

    if (updates.images && updates.images.length === 0) {
      return res.status(400).json({ success: false, message: "Gallery must have at least one image" });
    }

    const updated = await Gallery.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Gallery updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update gallery" });
  }
};

// @desc    Delete single gallery
// @route   DELETE /api/galleries/:id
const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: "Gallery not found" });
    }

    if (Array.isArray(gallery.images)) {
      gallery.images.forEach(deleteFile);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Gallery and its photos deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete gallery" });
  }
};

// @desc    Bulk delete galleries
// @route   POST /api/galleries/bulk-delete
const bulkDeleteGalleries = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ success: false, message: "No gallery IDs provided" });
    }

    const galleries = await Gallery.find({ _id: { $in: ids } });
    for (const g of galleries) {
      if (Array.isArray(g.images)) {
        g.images.forEach(deleteFile);
      }
    }

    await Gallery.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${galleries.length} galleries deleted successfully`,
    });
  } catch (error) {
    console.error("Error in bulk delete galleries:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete galleries" });
  }
};

// @desc    Update gallery status
// @route   PATCH /api/galleries/:id/status
const updateGalleryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Published", "Draft", "Unpublished"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!gallery) {
      return res.status(404).json({ success: false, message: "Gallery not found" });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: gallery,
    });
  } catch (error) {
    console.error("Error updating gallery status:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update status" });
  }
};

module.exports = {
  createGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
  bulkDeleteGalleries,
  updateGalleryStatus,
};
