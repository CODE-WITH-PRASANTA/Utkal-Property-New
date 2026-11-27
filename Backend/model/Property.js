const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "Untitled Property" },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    builderName: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },

    category: {
      type: String,
      default: "Residential",
      trim: true,
    },
    propertyType: {
      type: String,
      default: "Apartment",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending", "Draft", "Under Construction", "Sold", "Ready to Move", "Upcoming"],
      default: "Active",
    },

    price: { type: Number },
    pricePerSqft: { type: Number },
    bookingAmount: { type: Number },
    rera: { type: String, trim: true, default: "" },
    projectArea: { type: String, default: "" },
    superArea: { type: String, default: "" },
    houses: { type: Number },
    floors: { type: String, default: "" },
    bedrooms: { type: String, default: "" },
    bathrooms: { type: String, default: "" },
    parking: { type: String, default: "" },
    facing: { type: String, default: "" },
    overlooking: { type: String, default: "" },
    maintenance: { type: Number },
    rental: { type: Number },
    possession: { type: Date },

    amenities: [{ type: String }],
    images: [{ type: String }],
    youtubeUrl: { type: String, trim: true, default: "" },
    brochurePdf: { type: String, default: "" },
    floorPlans: [{ type: String }],
    nearbyPlaces: [
      {
        name: { type: String, default: "" },
        distance: { type: String, default: "" },
      },
    ],

    metaTitle: { type: String, maxlength: 120, default: "" },
    metaDescription: { type: String, maxlength: 300, default: "" },

    isFeatured: { type: Boolean, default: false },
    isBestProperty: { type: Boolean, default: false },

    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
