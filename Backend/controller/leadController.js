const Lead = require("../model/Lead");

// @desc    Create a new lead
// @route   POST /api/leads
const createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      source,
      type,
      status,
      enquiry,
      propertyId,
      propertySlug,
      propertyTitle,
      assignedTo,
      notes,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const validPropId =
      propertyId && /^[a-f\d]{24}$/i.test(String(propertyId)) ? propertyId : undefined;

    const lead = await Lead.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : "",
      source: source ? source.trim() : "Website",
      type: ["Hot", "Warm", "Cold"].includes(type) ? type : "Warm",
      status: ["New", "In Progress", "Follow-up", "Not Interested", "Converted"].includes(status)
        ? status
        : "New",
      enquiry: enquiry ? enquiry.trim() : "General Enquiry",
      propertyId: validPropId,
      propertySlug: propertySlug ? propertySlug.trim() : "",
      propertyTitle: propertyTitle ? propertyTitle.trim() : "",
      assignedTo: assignedTo ? assignedTo.trim() : "Unassigned",
      notes: notes ? notes.trim() : "",
    });

    return res.status(201).json({
      success: true,
      message: "Lead saved successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create lead" });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      total: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch leads" });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update lead" });
  }
};

// @desc    Bulk update or delete leads
// @route   PATCH /api/leads/bulk
const bulkUpdateLeads = async (req, res) => {
  try {
    const { ids, action, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No lead IDs provided" });
    }
    if (action === "delete") {
      await Lead.deleteMany({ _id: { $in: ids } });
      return res.status(200).json({ success: true, message: `${ids.length} lead(s) deleted` });
    }
    if (status) {
      await Lead.updateMany({ _id: { $in: ids } }, { $set: { status } });
      return res.status(200).json({ success: true, message: `${ids.length} lead(s) updated` });
    }
    return res.status(400).json({ success: false, message: "Invalid bulk action" });
  } catch (error) {
    console.error("Error in bulk lead action:", error);
    return res.status(500).json({ success: false, message: error.message || "Bulk action failed" });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to delete lead" });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  bulkUpdateLeads,
  deleteLead,
};
