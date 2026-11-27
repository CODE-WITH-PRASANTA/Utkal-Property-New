const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    source: {
      type: String,
      trim: true,
      default: "Website",
    },
    type: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Warm",
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Follow-up", "Not Interested", "Converted"],
      default: "New",
    },
    enquiry: {
      type: String,
      trim: true,
      default: "General Enquiry",
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: false,
    },
    propertySlug: {
      type: String,
      trim: true,
      default: "",
    },
    propertyTitle: {
      type: String,
      trim: true,
      default: "",
    },
    assignedTo: {
      type: String,
      trim: true,
      default: "Unassigned",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
