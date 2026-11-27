const mongoose = require("mongoose");

const sellRentListingSchema = new mongoose.Schema(
  {
    listingType: {
      type: String,
      enum: ["sell", "rent"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    propertyType: {
      type: String,
      trim: true,
      default: "Apartment",
    },
    category: {
      type: String,
      trim: true,
      default: "Residential",
    },
    area: {
      type: String,
      trim: true,
      default: "",
    },
    bedrooms: {
      type: String,
      trim: true,
      default: "",
    },
    bathrooms: {
      type: String,
      trim: true,
      default: "",
    },
    facing: {
      type: String,
      trim: true,
      default: "",
    },
    furnishing: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    rent: {
      type: Number,
      default: 0,
    },
    psf: {
      type: Number,
      default: 0,
    },
    rera: {
      type: String,
      trim: true,
      default: "",
    },
    availability: {
      type: String,
      trim: true,
      default: "",
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
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
    tenant: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      trim: true,
      default: "New",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellRentListing", sellRentListingSchema);
