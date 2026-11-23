const fs = require("fs");
const path = require("path");
const Team = require("../model/Team");

const deleteFile = (url) => {
  if (!url) return;
  try {
    const filePath = path.join(__dirname, "..", url.replace(/^\//, ""));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Failed to delete team member image:", url, err.message);
  }
};

const SEED_TEAM = [
  {
    name: "Rohit Kumar",
    role: "Project Manager",
    email: "rohit@utkalproperty.com",
    phone: "+91 98612 34567",
    joined: "2025-01-10",
    status: "Active",
    experience: "10+ Years",
    bio: "Expert in luxury real estate development and project management across Bhubaneswar and Cuttack.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=85",
    facebook: "https://facebook.com",
    twitter: "https://x.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Priya Mohanty",
    role: "Property Consultant",
    email: "priya@utkalproperty.com",
    phone: "+91 93456 78901",
    joined: "2025-01-15",
    status: "Active",
    experience: "8+ Years",
    bio: "Helping families and corporate clients discover prime properties and high-yield investments.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=85",
    facebook: "https://facebook.com",
    twitter: "https://x.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Amit Das",
    role: "Sales Executive",
    email: "amit@utkalproperty.com",
    phone: "+91 91234 56789",
    joined: "2025-01-20",
    status: "Active",
    experience: "5+ Years",
    bio: "Specializing in duplex homes, premium apartments, and commercial leasing.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=85",
    facebook: "https://facebook.com",
    twitter: "https://x.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Anjali Sethi",
    role: "Sales Manager",
    email: "anjali@utkalproperty.com",
    phone: "+91 98531 40762",
    joined: "2025-02-15",
    status: "Active",
    experience: "7+ Years",
    bio: "Driving customer satisfaction and guiding end-to-end property acquisitions.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=85",
    facebook: "https://facebook.com",
    twitter: "https://x.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
];

// @desc    Get all team members
// @route   GET /api/team
const getMembers = async (req, res) => {
  try {
    let count = await Team.countDocuments();
    if (count === 0) {
      await Team.insertMany(SEED_TEAM);
    }

    const { role, status, search } = req.query;
    const filter = {};

    if (role && role !== "all") {
      if (role === "managers") {
        filter.role = { $regex: /manager|admin/i };
      } else {
        filter.role = role;
      }
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
      ];
    }

    const members = await Team.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch team members" });
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
const getMemberById = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    console.error("Error fetching team member by id:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch team member" });
  }
};

// @desc    Create a new team member
// @route   POST /api/team
const createMember = async (req, res) => {
  try {
    const { name, role, email, phone, joined, status, experience, bio, facebook, twitter, instagram, linkedin } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }
    if (!role || !role.trim()) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const image = req.teamImageUrl || req.body.image || "";

    const member = await Team.create({
      name: name.trim(),
      role: role.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      image,
      joined: joined || new Date().toISOString().slice(0, 10),
      status: status || "Active",
      experience: experience ? experience.trim() : "",
      bio: bio ? bio.trim() : "",
      facebook: facebook ? facebook.trim() : "",
      twitter: twitter ? twitter.trim() : "",
      instagram: instagram ? instagram.trim() : "",
      linkedin: linkedin ? linkedin.trim() : "",
    });

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: member,
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create team member" });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
const updateMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    const updates = { ...req.body };
    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.role) updates.role = req.body.role.trim();
    if (req.body.email) updates.email = req.body.email.trim().toLowerCase();
    if (req.body.phone !== undefined) updates.phone = req.body.phone.trim();
    if (req.body.status) updates.status = req.body.status;
    if (req.body.joined) updates.joined = req.body.joined;

    if (req.teamImageUrl) {
      if (member.image && member.image.startsWith("/uploads/")) {
        deleteFile(member.image);
      }
      updates.image = req.teamImageUrl;
    }

    const updated = await Team.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update team member" });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
const deleteMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    if (member.image && member.image.startsWith("/uploads/")) {
      deleteFile(member.image);
    }

    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete team member" });
  }
};

// @desc    Bulk delete team members
// @route   POST /api/team/bulk-delete
const bulkDeleteMembers = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ success: false, message: "No team member IDs provided" });
    }

    const members = await Team.find({ _id: { $in: ids } });
    for (const m of members) {
      if (m.image && m.image.startsWith("/uploads/")) {
        deleteFile(m.image);
      }
    }

    await Team.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${members.length} team members deleted successfully`,
    });
  } catch (error) {
    console.error("Error in bulk delete team members:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete team members" });
  }
};

// @desc    Update team member status
// @route   PATCH /api/team/:id/status
const updateMemberStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const member = await Team.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: member,
    });
  } catch (error) {
    console.error("Error updating team member status:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update status" });
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  bulkDeleteMembers,
  updateMemberStatus,
};
