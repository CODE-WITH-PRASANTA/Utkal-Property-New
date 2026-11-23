const PropertyReview = require("../model/PropertyReview");
const Property = require("../model/Property");

// @desc    Create a new property review (initial status: Draft, prevent duplicacy)
// @route   POST /api/property-reviews
const createReview = async (req, res) => {
  try {
    const { propertyId, propertySlug, propertyTitle, name, email, phone, rating, comment } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please provide your name" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Please provide your email address" });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Please write a review comment" });
    }
    if (!propertySlug && !propertyId) {
      return res.status(400).json({ success: false, message: "Property identification is missing" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanSlug = (propertySlug || "").toLowerCase().trim();

    // Check for existing property to resolve both ID and slug
    let propDoc = null;
    if (propertyId && /^[a-f\d]{24}$/i.test(propertyId)) {
      propDoc = await Property.findById(propertyId);
    }
    if (!propDoc && cleanSlug) {
      propDoc = await Property.findOne({ slug: cleanSlug });
    }

    const finalSlug = propDoc ? propDoc.slug : cleanSlug;
    const finalPropId = propDoc ? propDoc._id : (propertyId && /^[a-f\d]{24}$/i.test(propertyId) ? propertyId : undefined);
    const finalTitle = propertyTitle || (propDoc ? propDoc.title : "Property");

    // Prevent duplicacy: Check if this user (email) has already submitted a review for this property
    const query = {
      email: cleanEmail,
      $or: [
        { propertySlug: finalSlug },
        ...(finalPropId ? [{ property: finalPropId }] : []),
      ],
    };

    const existing = await PropertyReview.findOne(query);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this property.",
      });
    }

    // Create review with Draft status
    const review = await PropertyReview.create({
      property: finalPropId,
      propertySlug: finalSlug,
      propertyTitle: finalTitle,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : "",
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      comment: comment.trim(),
      status: "Draft", // Always goes to draft first
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Your review has been submitted and is currently pending admin verification.",
      data: review,
    });
  } catch (error) {
    console.error("Error creating property review:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to submit review" });
  }
};

// @desc    Get reviews with optional filters (propertySlug, status, search)
// @route   GET /api/property-reviews
const getReviews = async (req, res) => {
  try {
    const { propertySlug, propertyId, status, search, page, limit } = req.query;

    const filter = {};
    if (status && status !== "All") {
      filter.status = status;
    }
    if (propertySlug) {
      filter.propertySlug = propertySlug.toLowerCase().trim();
    }
    if (propertyId && /^[a-f\d]{24}$/i.test(propertyId)) {
      filter.property = propertyId;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { propertyTitle: { $regex: search, $options: "i" } },
        { propertySlug: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
      ];
    }

    let query = PropertyReview.find(filter).sort({ createdAt: -1 });

    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit);
      query = query.skip(skip).limit(Number(limit));
    }

    const total = await PropertyReview.countDocuments(filter);
    const reviews = await query;

    res.status(200).json({
      success: true,
      total,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch reviews" });
  }
};

// @desc    Toggle or update review status (e.g. Published / Draft)
// @route   PATCH /api/property-reviews/:id/status
const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let newStatus = status;

    const review = await PropertyReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // If status not passed, toggle between Draft and Published
    if (!newStatus) {
      newStatus = review.status === "Published" ? "Draft" : "Published";
    }

    if (!["Draft", "Published", "Rejected"].includes(newStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    review.status = newStatus;
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review ${newStatus === "Published" ? "published" : "moved to draft"} successfully`,
      data: review,
    });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/property-reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await PropertyReview.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getReviews,
  updateReviewStatus,
  deleteReview,
};
