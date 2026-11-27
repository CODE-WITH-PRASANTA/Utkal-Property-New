const fs = require("fs");
const path = require("path");
const SellRentListing = require("../model/SellRentListing");

const parseJSON = (val, fallback) => {
  if (Array.isArray(val)) return val;
  if (!val) return fallback;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return typeof val === "string" ? [val] : fallback;
  }
};

const parseNum = (val) => {
  if (val === undefined || val === null || val === "") return 0;
  const n = Number(String(val).replace(/,/g, "").trim());
  return isNaN(n) ? 0 : n;
};

const deleteFile = (url) => {
  if (!url) return;
  try {
    const filePath = path.join(__dirname, "..", url.replace(/^\//, ""));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.error("Failed to delete file:", url, e.message);
  }
};

// @desc    Create sell or rent property request
// @route   POST /api/sell-rent
const createListing = async (req, res) => {
  try {
    const listingType = req.body.listingType === "rent" ? "rent" : "sell";
    const title = (req.body.title || "").trim();
    const ownerName = (req.body.ownerName || req.body.owner || req.body.name || "").trim();
    const phone = (req.body.phone || req.body.mobile || "").trim();

    if (!title) {
      return res.status(400).json({ success: false, message: "Property title is required" });
    }
    if (!ownerName) {
      return res.status(400).json({ success: false, message: "Owner name is required" });
    }
    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const defaultStatus = listingType === "rent" ? "Request" : "New";

    const doc = await SellRentListing.create({
      listingType,
      title,
      location: (req.body.location || "").trim(),
      description: (req.body.description || "").trim(),
      propertyType: req.body.propertyType || req.body.type || "Apartment",
      category: req.body.category || "Residential",
      area: req.body.area || "",
      bedrooms: req.body.bedrooms || "",
      bathrooms: req.body.bathrooms || "",
      facing: req.body.facing || "",
      furnishing: req.body.furnishing || "",
      price: parseNum(req.body.price),
      rent: parseNum(req.body.rent),
      psf: parseNum(req.body.psf),
      rera: (req.body.rera || "").trim(),
      availability: req.body.availability || req.body.date || "",
      amenities: parseJSON(req.body.amenities, []),
      images: req.imageUrls || [],
      ownerName,
      phone,
      email: (req.body.email || "").trim().toLowerCase(),
      tenant: (req.body.tenant || "").trim(),
      status: req.body.status || defaultStatus,
      notes: (req.body.notes || "").trim(),
    });

    return res.status(201).json({
      success: true,
      message: `${listingType === "rent" ? "Rent" : "Sell"} property submitted successfully`,
      data: doc,
    });
  } catch (error) {
    console.error("Error creating sell/rent listing:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to submit listing" });
  }
};

// @desc    Get sell or rent listings
// @route   GET /api/sell-rent
const getListings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.listingType && ["sell", "rent"].includes(req.query.listingType)) {
      filter.listingType = req.query.listingType;
    }
    const list = await SellRentListing.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      total: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Error fetching sell/rent listings:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch listings" });
  }
};

// @desc    Update sell or rent listing
// @route   PUT /api/sell-rent/:id
const updateListing = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.body.owner && !req.body.ownerName) updates.ownerName = req.body.owner;
    if (req.body.type && !req.body.propertyType) updates.propertyType = req.body.type;
    if (req.body.date && !req.body.availability) updates.availability = req.body.date;
    if (req.body.price !== undefined) updates.price = parseNum(req.body.price);
    if (req.body.rent !== undefined) updates.rent = parseNum(req.body.rent);

    const doc = await SellRentListing.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      data: doc,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update listing" });
  }
};

// @desc    Bulk update or delete sell/rent listings
// @route   PATCH /api/sell-rent/bulk
const bulkUpdateListings = async (req, res) => {
  try {
    const { ids, action, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No listing IDs provided" });
    }
    if (action === "delete") {
      const docs = await SellRentListing.find({ _id: { $in: ids } });
      docs.forEach((d) => (d.images || []).forEach(deleteFile));
      await SellRentListing.deleteMany({ _id: { $in: ids } });
      return res.status(200).json({ success: true, message: `${ids.length} listing(s) deleted` });
    }
    if (status) {
      await SellRentListing.updateMany({ _id: { $in: ids } }, { $set: { status } });
      return res.status(200).json({ success: true, message: `${ids.length} listing(s) updated` });
    }
    return res.status(400).json({ success: false, message: "Invalid bulk action" });
  } catch (error) {
    console.error("Error in bulk sell/rent action:", error);
    return res.status(500).json({ success: false, message: error.message || "Bulk action failed" });
  }
};

// @desc    Delete sell or rent listing
// @route   DELETE /api/sell-rent/:id
const deleteListing = async (req, res) => {
  try {
    const doc = await SellRentListing.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    (doc.images || []).forEach(deleteFile);
    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to delete listing" });
  }
};

module.exports = {
  createListing,
  getListings,
  updateListing,
  bulkUpdateListings,
  deleteListing,
};
