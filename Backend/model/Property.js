const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, trim: true },
    description: { type: String, default: "" },

    category: { type: String, enum: ["Residential", "Commercial", "Rental"], default: "Residential" },
    propertyType: {
      type: String,
      enum: ["Duplex / Independent House", "Plot / Land", "Apartment", "Villa", "Flat"],
      default: "Apartment",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending", "Under Construction", "Sold", "Ready to Move", "Upcoming"],
      default: "Active",
    },

    price: { type: Number },
    pricePerSqft: { type: Number },
    rera: { type: String, trim: true },
    projectArea: { type: String },
    superArea: { type: String },
    houses: { type: Number },
    floors: { type: String },
    bedrooms: { type: String },
    bathrooms: { type: String },
    parking: { type: String },
    facing: { type: String },
    overlooking: { type: String },
    maintenance: { type: Number },
    rental: { type: Number },
    possession: { type: Date },

    amenities: [{ type: String }],
    images: [{ type: String }],
    floorPlans: [{ type: String }],
    nearbyPlaces: [{ name: String, distance: String }],

    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },

    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);