const mongoose = require("mongoose");

const propertyReviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: false,
    },
    propertySlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    propertyTitle: {
      type: String,
      default: "",
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["Review", "Brochure"],
      default: "Review",
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Rejected"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

// Compound index for fast duplicacy check
propertyReviewSchema.index({ propertySlug: 1, email: 1 });

module.exports = mongoose.model("PropertyReview", propertyReviewSchema);
