const mongoose = require("mongoose");
const Property = require("./model/Property");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/utkal_property";

const properties = [
  {
    title: "Royal Presidency",
    slug: "royal-presidency",
    location: "Nandankanan Road, Raghunathpur, Patia, Bhubaneswar",
    description: "Welcome to Royal Presidency, a premium residential destination thoughtfully crafted for modern families seeking elegance, comfort, and a refined lifestyle. Designed with contemporary architecture, spacious planning, and premium amenities, the project offers the perfect balance of luxury and convenience.",
    category: "Residential",
    propertyType: "Apartment",
    status: "Under Construction",
    price: 21500000,
    pricePerSqft: 8450,
    rera: "RP/19/2025/01392",
    projectArea: "1.3 Acre",
    superArea: "2547 - 3245",
    houses: 108,
    floors: "2B+S+27",
    bedrooms: "3-4",
    bathrooms: "3-4",
    parking: "1",
    facing: "West, East",
    overlooking: "Pool, Road, Club, Garden, Park",
    maintenance: 0,
    rental: 100000,
    amenities: [
      "Swimming Pool", "Modular Kitchen", "Children Play Area", "Conference Rooms",
      "Coworking Space", "Lift", "Temple", "Kids' Play Area", "Kids' Pool",
      "Reserved Parking", "Intercom", "EV Charging", "Multipurpose Hall",
      "Club House", "Grand Entrance", "High Speed Lift", "Earthquake-Resistant",
      "Park", "Society Office", "Sky Lounge", "Rainwater Harvesting",
      "Sewage Treatment Plant", "Gym", "Banquet Hall"
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=85"
    ],
    floorPlans: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=85"
    ],
    nearbyPlaces: [
      { name: "Airport", distance: "18 Km" },
      { name: "Bank", distance: "100 Meter" },
      { name: "Bus Stop", distance: "0 Meter" },
      { name: "Railway Station", distance: "15 Km" },
      { name: "ATM", distance: "100 Meter" },
      { name: "School", distance: "3 Km" },
      { name: "Shopping Mall", distance: "3 Km" },
      { name: "Hospital", distance: "5 Km" }
    ],
    metaTitle: "Air View Living in Patia Raghunathpur | Bali Inspired Luxury Apartments",
    metaDescription: "Air View Living in Patia Raghunathpur. 3 & 4 BHK Luxury Apartments with 24+ world-class amenities.",
    isFeatured: true,
    isBestProperty: true,
    isDraft: false
  },
  {
    title: "Utkal Heights",
    slug: "utkal-heights",
    location: "Infocity Road, Patia, Bhubaneswar",
    description: "Utkal Heights offers luxury living spaces situated in the tech heart of Bhubaneswar. Featuring state-of-the-art facilities, infinity rooftop swimming pool, and round-the-clock modern security.",
    category: "Residential",
    propertyType: "Apartment",
    status: "Ready to Move",
    price: 18500000,
    pricePerSqft: 7900,
    rera: "RP/19/2024/00845",
    projectArea: "2.1 Acre",
    superArea: "1850 - 2400",
    houses: 160,
    floors: "G+18",
    bedrooms: "3",
    bathrooms: "3",
    parking: "1",
    facing: "North-East",
    overlooking: "Green Valley & City Skyline",
    maintenance: 2500,
    rental: 65000,
    amenities: [
      "Swimming Pool", "Club House", "Gym", "Kids' Play Area", "EV Charging",
      "Power Backup", "24x7 Security", "Vastu Compliant"
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=85"
    ],
    floorPlans: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85"
    ],
    nearbyPlaces: [
      { name: "Infocity Hub", distance: "500 Meter" },
      { name: "KIIT University", distance: "1 Km" },
      { name: "Airport", distance: "14 Km" }
    ],
    metaTitle: "Utkal Heights - 3 BHK Premium Apartments in Patia",
    metaDescription: "Ready to move luxury apartments in Patia Bhubaneswar with modern amenities.",
    isFeatured: true,
    isBestProperty: false,
    isDraft: false
  },
  {
    title: "Grand Horizon Villas",
    slug: "grand-horizon-villas",
    location: "Kalarahanga, Near Nandan Kanan, Bhubaneswar",
    description: "Experience ultra-spacious duplex and triplex independent villas surrounded by lush botanical serenity. Exclusive private gardens, individual terraces, and gated community security.",
    category: "Residential",
    propertyType: "Villa",
    status: "Active",
    price: 31000000,
    pricePerSqft: 9200,
    rera: "RP/19/2025/01540",
    projectArea: "5.5 Acre",
    superArea: "3200 - 4100",
    houses: 45,
    floors: "G+2",
    bedrooms: "4",
    bathrooms: "4",
    parking: "2",
    facing: "East",
    overlooking: "Botanical Garden & Private Lawn",
    maintenance: 4000,
    rental: 120000,
    amenities: [
      "Private Garden", "Club House", "Gym", "Swimming Pool", "Tennis Court",
      "Solar Lighting", "Intercom", "EV Charging", "Grand Entrance"
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=85"
    ],
    floorPlans: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=85"
    ],
    nearbyPlaces: [
      { name: "Nandan Kanan", distance: "2 Km" },
      { name: "Trisulia Bridge", distance: "6 Km" },
      { name: "Care Hospital", distance: "7 Km" }
    ],
    metaTitle: "Grand Horizon Villas - Luxury Duplex Villas in Bhubaneswar",
    metaDescription: "Exclusive 4 BHK gated community villas in Kalarahanga, Bhubaneswar.",
    isFeatured: true,
    isBestProperty: true,
    isDraft: false
  },
  {
    title: "Prestige Lakeside Villa",
    slug: "prestige-lakeside-villa",
    location: "Hanspal, Cuttack-Puri Bypass, Bhubaneswar",
    description: "Lakeside residential sanctuary offering panoramic waterfront vistas. Contemporary design with wide sundecks, imported marble flooring, and world-class clubhouse amenities.",
    category: "Residential",
    propertyType: "Villa",
    status: "Active",
    price: 24500000,
    pricePerSqft: 7650,
    rera: "RP/19/2024/00732",
    projectArea: "3.8 Acre",
    superArea: "2800 - 3500",
    houses: 64,
    floors: "G+2",
    bedrooms: "4",
    bathrooms: "4",
    parking: "2",
    facing: "North",
    overlooking: "Lake View & Promenade",
    maintenance: 3500,
    rental: 85000,
    amenities: [
      "Lake Promenade", "Infinity Pool", "Club House", "Gym", "Jogging Track",
      "Kids' Play Area", "24x7 Security", "Vastu Compliant"
    ],
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85"
    ],
    floorPlans: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85"
    ],
    nearbyPlaces: [
      { name: "Rasulgarh Square", distance: "4 Km" },
      { name: "Utkal Hospital", distance: "5 Km" },
      { name: "Bhubaneswar Railway Station", distance: "8 Km" }
    ],
    metaTitle: "Prestige Lakeside Villa - Waterfront Living in Bhubaneswar",
    metaDescription: "Luxury 4 BHK villas by the water with private lawns and clubhouse.",
    isFeatured: false,
    isBestProperty: true,
    isDraft: false
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    for (const p of properties) {
      await Property.findOneAndUpdate(
        { slug: p.slug },
        { $set: p },
        { upsert: true, new: true }
      );
      console.log(`Upserted property: ${p.title} (${p.slug})`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
