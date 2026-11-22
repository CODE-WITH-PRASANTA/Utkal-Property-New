const fs = require("fs");
const path = require("path");
const Property = require("../model/Property");

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// amenities / nearbyPlaces come as JSON strings from FormData
const parseJSON = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const deleteFile = (url) => {
  if (!url) return;
  const filePath = path.join(__dirname, "..", url);
  fs.unlink(filePath, () => {});
};

// @desc    Create property
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const { title, slug } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    let finalSlug = slugify(slug || title);
    if (await Property.findOne({ slug: finalSlug })) finalSlug = `${finalSlug}-${Date.now()}`;

    const property = await Property.create({
      ...req.body,
      slug: finalSlug,
      amenities: parseJSON(req.body.amenities, []),
      nearbyPlaces: parseJSON(req.body.nearbyPlaces, []),
      isDraft: req.body.saveAs === "draft",
      images: req.imageUrls || [],
      floorPlans: req.planUrls || [],
    });

    res.status(201).json({ success: true, message: "Property created", data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all properties (with simple filters)
// @route   GET /api/properties
const getProperties = async (req, res) => {
  try {
    const { search, category, propertyType, status, page = 1, limit = 12 } = req.query;

    const filter = { isDraft: false };
    if (category) filter.category = category;
    if (propertyType) filter.propertyType = propertyType;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" };

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property by id or slug
// @route   GET /api/properties/:idOrSlug
const getProperty = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = /^[a-f\d]{24}$/i.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const property = await Property.findOne(query);

    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    // old files to remove (array of urls sent from frontend)
    const removeImages = parseJSON(req.body.removeImages, []);
    const removePlans = parseJSON(req.body.removeFloorPlans, []);
    removeImages.forEach(deleteFile);
    removePlans.forEach(deleteFile);

    const updates = { ...req.body };
    if (req.body.amenities) updates.amenities = parseJSON(req.body.amenities, []);
    if (req.body.nearbyPlaces) updates.nearbyPlaces = parseJSON(req.body.nearbyPlaces, []);
    if (req.body.saveAs) updates.isDraft = req.body.saveAs === "draft";
    updates.images = [...property.images.filter((i) => !removeImages.includes(i)), ...(req.imageUrls || [])];
    updates.floorPlans = [...property.floorPlans.filter((p) => !removePlans.includes(p)), ...(req.planUrls || [])];
    delete updates.slug; // keep url stable

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Property updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update status only
// @route   PATCH /api/properties/:id/status
const updateStatus = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.status(200).json({ success: true, message: "Status updated", data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    [...property.images, ...property.floorPlans].forEach(deleteFile);
    res.status(200).json({ success: true, message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  updateStatus,
  deleteProperty,
};