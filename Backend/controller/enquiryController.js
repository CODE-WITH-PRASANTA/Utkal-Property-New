const Enquiry = require("../model/Enquiry");

// @desc    Create a new enquiry
// @route   POST /api/enquiry
const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, location, interest, service, message, status, source } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const finalService = service || interest || "Residential Properties";

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location ? location.trim() : "",
      interest: interest ? interest.trim() : finalService,
      service: finalService,
      message: message ? message.trim() : "",
      status: status || "New",
      source: source || "Website Popup",
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to submit enquiry" });
  }
};

// @desc    Get all enquiries with filters & search
// @route   GET /api/enquiry
const getEnquiries = async (req, res) => {
  try {
    const { search, status, service, page, limit } = req.query;

    const filter = {};
    if (status && status !== "All") {
      filter.status = status;
    }
    if (service && service !== "All") {
      filter.$or = [
        { service: { $regex: service, $options: "i" } },
        { interest: { $regex: service, $options: "i" } },
      ];
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    let query = Enquiry.find(filter).sort({ createdAt: -1 });

    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit);
      query = query.skip(skip).limit(Number(limit));
    }

    const total = await Enquiry.countDocuments(filter);
    const enquiries = await query;

    res.status(200).json({
      success: true,
      total,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Error getting enquiries:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch enquiries" });
  }
};

// @desc    Get single enquiry
// @route   GET /api/enquiry/:id
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update enquiry
// @route   PUT /api/enquiry/:id
const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    if (req.body.name) enquiry.name = req.body.name.trim();
    if (req.body.email) enquiry.email = req.body.email.trim();
    if (req.body.phone) enquiry.phone = req.body.phone.trim();
    if (req.body.location !== undefined) enquiry.location = req.body.location.trim();
    if (req.body.interest !== undefined) enquiry.interest = req.body.interest.trim();
    if (req.body.service !== undefined) enquiry.service = req.body.service.trim();
    if (req.body.message !== undefined) enquiry.message = req.body.message.trim();
    if (req.body.status !== undefined) enquiry.status = req.body.status;

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PATCH /api/enquiry/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["New", "In Progress", "Closed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiry/:id
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  updateStatus,
  deleteEnquiry,
};
