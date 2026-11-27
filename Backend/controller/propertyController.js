const fs = require("fs");
const path = require("path");
const Property = require("../model/Property");

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Parse JSON safely from string or return fallback
const parseJSON = (value, fallback) => {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return typeof value === "string" ? [value] : fallback;
  }
};

const parseNumber = (val) => {
  if (val === undefined || val === null || val === "") return undefined;
  const num = Number(String(val).replace(/,/g, "").trim());
  return isNaN(num) ? undefined : num;
};

const parseDate = (val) => {
  if (!val || val === "") return undefined;
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

const deleteFile = (url) => {
  if (!url) return;
  try {
    const filePath = path.join(__dirname, "..", url.replace(/^\//, ""));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Failed to delete file:", url, err.message);
  }
};

// @desc    Create property
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const { title, slug } = req.body;

    const isDraft =
      req.body.isDraft === "true" ||
      req.body.isDraft === true ||
      req.body.saveAs === "draft" ||
      req.body.status === "Draft";

    let finalTitle = (title || "").trim();
    if (!finalTitle) {
      finalTitle = isDraft
        ? `Untitled Draft - ${new Date().toLocaleDateString("en-IN")}`
        : `Untitled Property - ${new Date().toLocaleDateString("en-IN")}`;
    }

    let finalSlug = slugify(slug || finalTitle);
    if (!finalSlug) finalSlug = `property-${Date.now()}`;

    const existingProperty = await Property.findOne({ slug: finalSlug });
    if (existingProperty) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const propertyPayload = {
      title: finalTitle,
      slug: finalSlug,
      builderName: req.body.builderName ? req.body.builderName.trim() : "",
      location: req.body.location ? req.body.location.trim() : "",
      description: req.body.description || req.body.descriptionText || "",

      category: req.body.category || "Residential",
      propertyType: req.body.propertyType || "Apartment",
      status: req.body.status || (isDraft ? "Draft" : "Active"),

      price: parseNumber(req.body.price),
      pricePerSqft: parseNumber(req.body.pricePerSqft),
      bookingAmount: parseNumber(req.body.bookingAmount),
      rera: req.body.rera ? req.body.rera.trim() : "",
      projectArea: req.body.projectArea ? String(req.body.projectArea).trim() : "",
      superArea: req.body.superArea ? String(req.body.superArea).trim() : "",
      houses: parseNumber(req.body.houses),
      floors: req.body.floors ? String(req.body.floors).trim() : "",
      bedrooms: req.body.bedrooms || "",
      bathrooms: req.body.bathrooms || "",
      parking: req.body.parking || "",
      facing: req.body.facing || "",
      overlooking: req.body.overlooking || "",
      maintenance: parseNumber(req.body.maintenance),
      rental: parseNumber(req.body.rental),
      possession: parseDate(req.body.possession),

      amenities: parseJSON(req.body.amenities, []),
      nearbyPlaces: parseJSON(req.body.nearbyPlaces, []),

      metaTitle: req.body.metaTitle ? req.body.metaTitle.trim() : "",
      metaDescription: req.body.metaDescription ? req.body.metaDescription.trim() : "",

      isDraft: Boolean(isDraft),
      isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,
      isBestProperty: req.body.isBestProperty === "true" || req.body.isBestProperty === true,
      images: req.imageUrls || [],
      youtubeUrl: req.body.youtubeUrl ? req.body.youtubeUrl.trim() : "",
      brochurePdf: req.brochureUrl || "",
      floorPlans: req.planUrls || [],
    };

    const property = await Property.create(propertyPayload);

    return res.status(201).json({
      success: true,
      message: isDraft
        ? "Property saved as draft successfully"
        : "Property created and published successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create property" });
  }
};

// @desc    Get all properties (with filters & search)
// @route   GET /api/properties
const getProperties = async (req, res) => {
  try {
    const { search, category, propertyType, status, isDraft, isFeatured, isBestProperty, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (isDraft !== undefined) {
      filter.isDraft = isDraft === "true";
    }
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true" || isFeatured === true;
    }
    if (isBestProperty !== undefined) {
      filter.isBestProperty = isBestProperty === "true" || isBestProperty === true;
    }
    if (category && category !== "All Category") {
      filter.category = category;
    }
    if (propertyType && propertyType !== "All Type") {
      filter.propertyType = propertyType;
    }
    if (status && status !== "All Status") {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { rera: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
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

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error("Error getting single property:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download property brochure PDF
// @route   GET /api/properties/:idOrSlug/brochure
const downloadBrochure = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = /^[a-f\d]{24}$/i.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const property = await Property.findOne(query);

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    let pdfRelativePath = property.brochurePdf;
    if (!pdfRelativePath && Array.isArray(property.floorPlans)) {
      pdfRelativePath = property.floorPlans.find((fp) => String(fp).toLowerCase().endsWith(".pdf")) || "";
    }

    if (!pdfRelativePath) {
      return res.status(404).json({ success: false, message: "Brochure PDF not uploaded for this property" });
    }

    const filePath = path.join(__dirname, "..", pdfRelativePath.replace(/^\//, ""));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Brochure file not found on server" });
    }

    const safeName = `${(property.slug || "property")}-brochure.pdf`;
    return res.download(filePath, safeName);
  } catch (error) {
    console.error("Error downloading brochure:", error);
    return res.status(500).json({ success: false, message: "Failed to download brochure" });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const updates = { ...req.body };
    if (req.body.title) updates.title = req.body.title.trim();
    if (req.body.builderName !== undefined) updates.builderName = req.body.builderName.trim();
    if (req.body.location !== undefined) updates.location = req.body.location.trim();
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.propertyType !== undefined) updates.propertyType = req.body.propertyType;
    if (req.body.status !== undefined) updates.status = req.body.status;

    if (req.body.price !== undefined) updates.price = parseNumber(req.body.price);
    if (req.body.pricePerSqft !== undefined) updates.pricePerSqft = parseNumber(req.body.pricePerSqft);
    if (req.body.bookingAmount !== undefined) updates.bookingAmount = parseNumber(req.body.bookingAmount);
    if (req.body.youtubeUrl !== undefined) updates.youtubeUrl = req.body.youtubeUrl.trim();
    if (req.body.rera !== undefined) updates.rera = req.body.rera.trim();
    if (req.body.projectArea !== undefined) updates.projectArea = req.body.projectArea;
    if (req.body.superArea !== undefined) updates.superArea = req.body.superArea;
    if (req.body.houses !== undefined) updates.houses = parseNumber(req.body.houses);
    if (req.body.floors !== undefined) updates.floors = req.body.floors;
    if (req.body.bedrooms !== undefined) updates.bedrooms = req.body.bedrooms;
    if (req.body.bathrooms !== undefined) updates.bathrooms = req.body.bathrooms;
    if (req.body.parking !== undefined) updates.parking = req.body.parking;
    if (req.body.facing !== undefined) updates.facing = req.body.facing;
    if (req.body.overlooking !== undefined) updates.overlooking = req.body.overlooking;
    if (req.body.maintenance !== undefined) updates.maintenance = parseNumber(req.body.maintenance);
    if (req.body.rental !== undefined) updates.rental = parseNumber(req.body.rental);
    if (req.body.possession !== undefined) updates.possession = parseDate(req.body.possession);

    if (req.body.amenities !== undefined) updates.amenities = parseJSON(req.body.amenities, property.amenities);
    if (req.body.nearbyPlaces !== undefined) updates.nearbyPlaces = parseJSON(req.body.nearbyPlaces, property.nearbyPlaces);
    if (req.body.metaTitle !== undefined) updates.metaTitle = req.body.metaTitle.trim();
    if (req.body.metaDescription !== undefined) updates.metaDescription = req.body.metaDescription.trim();
    if (req.body.isDraft !== undefined) updates.isDraft = req.body.isDraft === "true" || req.body.isDraft === true;
    if (req.body.saveAs) updates.isDraft = req.body.saveAs === "draft";

    if (req.body.isFeatured !== undefined) updates.isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;
    if (req.body.isBestProperty !== undefined) updates.isBestProperty = req.body.isBestProperty === "true" || req.body.isBestProperty === true;

    // Handle existing vs removed images
    if (req.body.existingImages !== undefined) {
      const keptImages = parseJSON(req.body.existingImages, []);
      const removedImages = property.images.filter((img) => !keptImages.includes(img));
      removedImages.forEach(deleteFile);
      updates.images = [...keptImages, ...(req.imageUrls || [])];
    } else if (req.imageUrls && req.imageUrls.length > 0) {
      updates.images = [...property.images, ...req.imageUrls];
    }

    // Handle existing vs removed floor plans
    if (req.body.existingFloorPlans !== undefined) {
      const keptPlans = parseJSON(req.body.existingFloorPlans, []);
      const removedPlans = property.floorPlans.filter((p) => !keptPlans.includes(p));
      removedPlans.forEach(deleteFile);
      updates.floorPlans = [...keptPlans, ...(req.planUrls || [])];
    } else if (req.planUrls && req.planUrls.length > 0) {
      updates.floorPlans = [...property.floorPlans, ...req.planUrls];
    }

    // Handle brochure PDF upload / removal
    if (req.brochureUrl) {
      if (property.brochurePdf) deleteFile(property.brochurePdf);
      updates.brochurePdf = req.brochureUrl;
    } else if (req.body.existingBrochurePdf === "") {
      if (property.brochurePdf) deleteFile(property.brochurePdf);
      updates.brochurePdf = "";
    }

    if (req.body.slug && req.body.slug.trim()) {
      const newSlug = slugify(req.body.slug);
      const existingSlug = await Property.findOne({ slug: newSlug, _id: { $ne: property._id } });
      if (!existingSlug) {
        updates.slug = newSlug;
      }
    } else {
      delete updates.slug;
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "Property updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating property:", error);
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
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, message: "Status updated successfully", data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    [...property.images, ...property.floorPlans].forEach(deleteFile);
    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle featured or best property flag
// @route   PATCH /api/properties/:id/toggle
const togglePropertyFlag = async (req, res) => {
  try {
    const { field, value } = req.body;
    if (!["isFeatured", "isBestProperty"].includes(field)) {
      return res.status(400).json({ success: false, message: "Invalid flag field" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const nextValue = value !== undefined ? Boolean(value) : !property[field];
    property[field] = nextValue;
    await property.save();

    res.status(200).json({
      success: true,
      message: `${field === "isFeatured" ? "Featured" : "Best Property"} status updated successfully`,
      data: property,
    });
  } catch (error) {
    console.error("Error toggling property flag:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getProperty,
  downloadBrochure,
  updateProperty,
  updateStatus,
  togglePropertyFlag,
  deleteProperty,
};
