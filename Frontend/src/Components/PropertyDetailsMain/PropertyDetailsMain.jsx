import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { API_ENDPOINTS, getMediaUrl } from "../../config/api";
import "./PropertyDetailsMain.css";

/* Asset images as fallbacks */
import pImg1 from "../../assets/property-listing-1.jpg";
import pImg2 from "../../assets/property-listing-2.jpg";
import pImg3 from "../../assets/property-listing-3.jpg";
import pImg4 from "../../assets/property-listing-4.jpg";
import feat1 from "../../assets/featured-1.jpg";
import feat2 from "../../assets/featured-2.jpg";
import feat3 from "../../assets/featured-3.jpg";
import feat4 from "../../assets/featured-4.jpg";

/* ==========================================================================
   HELPER: Convert any YouTube URL (watch / youtu.be / shorts) to embed URL
   ========================================================================== */
const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (trimmed.includes("youtube.com/embed/")) return trimmed;
  let videoId = "";
  const watchMatch = trimmed.match(/[?&]v=([^&#]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  } else {
    const shortMatch = trimmed.match(/youtu\.be\/([^?&#]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    } else {
      const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&#]+)/);
      if (shortsMatch) videoId = shortsMatch[1];
    }
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0` : trimmed;
};

/* ==========================================================================
   DEFAULT / SERIAL DATA (Matches all 9 uploaded screenshots precisely)
   ========================================================================== */
const DEFAULT_PROPERTY = {
  id: "royal-presidency",
  title: "Royal Presidency",
  subtitle: "Air View Living in Patia Raghunathpur | Bali Inspired Luxury Apartments",
  location: "Nandankanan Road, Raghunathpur, Patia, Bhubaneswar, Odisha 751024",
  fullAddress: "Nandankanan Road, Raghunathpur, Patia, Okinawa dealer Plot no 1003, infront of Punjab national bank Shabari Sahi, House No 729, 2939, Nandankanan Rd, Raghunathpur, Bhubaneswar, Raghunathpurjali, Odisha 751024, India",
  builder: "SJ Developer",
  priceRange: "₹ 2.15 Cr - ₹ 2.74 Cr",
  pricePerSqft: "₹ 8,450 / Sqft",
  type: "Apartment",
  bookingAmount: "₹ 10.00 Lac",
  furnishing: "Unfurnished",
  sba: "2547 - 3245 sq.ft",
  availableFrom: "03 Jul 2027",
  status: "Under Construction",
  reraNo: "RP/19/2025/01392",
  viewsCount: 24,
  images: [pImg1, pImg2, pImg3, pImg4],

  /* Section 2: Project Overview */
  overview: [
    { label: "Project Area", value: "1.3 Acre", icon: "area" },
    { label: "No. of Towers", value: "1", icon: "tower" },
    { label: "Total Floors", value: "2B+S+27", icon: "floors" },
    { label: "Number of Flats", value: "108", icon: "flats" },
    { label: "Facing", value: "West, East", icon: "facing" },
    { label: "Carpet Area (sq.ft.)", value: "1655-2058", icon: "carpet" },
    { label: "Bedrooms", value: "3-4", icon: "bed" },
    { label: "Bathrooms", value: "3-4", icon: "bath" },
    { label: "Balconies", value: "3-5", icon: "balcony" },
    { label: "Parking", value: "1", icon: "car" },
    { label: "Transaction Type", value: "New property", icon: "key" },
    { label: "Property Overlooking", value: "Pool, Road, Club, Garden, Park", icon: "overlook" },
    { label: "Maintainance Per Month", value: "₹ 0.00", icon: "rupee" },
    { label: "Expected Rental Return", value: "₹ 1.00 Lac", icon: "rental" },
  ],

  /* Section 3: Description & Location */
  description: `Welcome to Royal Presidency, a premium residential destination thoughtfully crafted for modern families seeking elegance, comfort, and a refined lifestyle. Designed with contemporary architecture, spacious planning, and premium amenities, the project offers the perfect balance of luxury and convenience. Located in a fast-growing and well-connected neighborhood, Royal Presidency provides seamless access to schools, hospitals, shopping destinations, and major city landmarks. Every home is designed with ample natural light, ventilation, stylish interiors, and spacious balconies to create a peaceful and sophisticated living experience. With landscaped surroundings, quality construction, and a host of modern lifestyle features, Royal Presidency is more than just a home — it is a prestigious address crafted for elevated living.`,
  locationDetails: `Strategically located in a fast-developing and well-connected neighborhood, Royal Presidency offers the perfect blend of convenience, accessibility, and peaceful living. The project enjoys seamless connectivity to major roads, schools, hospitals, shopping malls, business hubs, and daily lifestyle essentials, making everyday life comfortable and hassle-free. Surrounded by growing infrastructure and urban development, the location ensures excellent future appreciation while still providing a calm and family-friendly environment. Whether it is easy city access, smooth commuting, or proximity to key landmarks, Royal Presidency places you at the center of everything important while allowing you to enjoy a refined and peaceful lifestyle.`,

  /* Section 4: Amenities */
  amenities: [
    { name: "Swimming Pool", icon: "pool" },
    { name: "Modular Kitchen", icon: "kitchen" },
    { name: "Children Play Area", icon: "child" },
    { name: "Conference Rooms", icon: "door" },
    { name: "Coworking Space", icon: "laptop" },
    { name: "Lift", icon: "elevator" },
    { name: "Temple", icon: "temple" },
    { name: "Kids' Play Area", icon: "tennis" },
    { name: "Kids' Pool", icon: "swimmer" },
    { name: "Reserved Parking", icon: "parking" },
    { name: "Intercom", icon: "intercom" },
    { name: "EV Charging", icon: "ev" },
    { name: "Multipurpose Hall", icon: "hall" },
    { name: "Club House", icon: "check" },
    { name: "Grand Entrance", icon: "arch" },
    { name: "High Speed Lift", icon: "elevator" },
    { name: "Earthquake-Resistant", icon: "check" },
    { name: "Park", icon: "check" },
    { name: "Society Office", icon: "check" },
    { name: "Sky Lounge", icon: "cloud" },
    { name: "Rainwater Harvesting", icon: "rain" },
    { name: "Sewage Treatment Plant", icon: "recycle" },
    { name: "Gym", icon: "dumbbell" },
    { name: "Banquet Hall", icon: "gazebo" },
  ],

  /* Section 5: Key Features */
  keyFeatures: [
    "Modular Kitchen",
    "Panoramic View",
    "Low Density Society",
    "3 Side Open",
    "Double-Height Entrance Lobbies",
    "Open Space",
    "Earthquake-Resistant Structure",
    "Mivan Construction Technology",
    "Piling Construction",
    "Advanced Fire Safety",
  ],

  /* Section 5: Floor plans */
  floorPlans: [
    { label: "3BHK", title: "3 BHK Luxury Unit - 1655 Sq.ft", img: pImg1 },
    { label: "3BHK Large", title: "3 BHK Premium Unit - 1850 Sq.ft", img: pImg2 },
    { label: "4BHK", title: "4 BHK Royal Penthouse - 2058 Sq.ft", img: pImg3 },
    { label: "Masterplan", title: "Royal Presidency Master Layout Plan", img: pImg4 },
    { label: "Floorplan", title: "1st Floor Typical Cluster Plan", img: pImg1 },
  ],

  /* Section 6: Walkthrough video */
  videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=0",

  /* Section 7: Explore Neighbourhood */
  neighbourhood: [
    { name: "Airport", dist: "18 Km" },
    { name: "Bank", dist: "100 Meter" },
    { name: "Bus Stop", dist: "0 Meter" },
    { name: "Railway Station", dist: "15 Km" },
    { name: "ATM", dist: "100 Meter" },
    { name: "School", dist: "3 Km" },
    { name: "Shopping Mall", dist: "3 Km" },
    { name: "Hospital", dist: "5 Km" },
    { name: "Restaurant", dist: "1 Km" },
    { name: "Business Hubs", dist: "3 Km" },
    { name: "College", dist: "3 Km" },
  ],

  /* Section 8: Similar Projects */
  similarProjects: [
    { id: 1, title: "Utkal Heights", price: "₹ 1.85 Cr", location: "Patia, Bhubaneswar", image: feat1, tag: "Featured" },
    { id: 2, title: "Royal Crown Residences", price: "₹ 2.40 Cr", location: "Raghunathpur, Bhubaneswar", image: feat2, tag: "Featured" },
    { id: 3, title: "Skyline Green Towers", price: "₹ 1.95 Cr", location: "Infocity, Bhubaneswar", image: feat3, tag: "Featured" },
    { id: 4, title: "Grand Horizon Villas", price: "₹ 3.10 Cr", location: "Kalarahanga, Bhubaneswar", image: feat4, tag: "Featured" },
  ],

  /* Section 9: Customer Reviews */
  reviews: [
    {
      id: 1,
      name: "Bichitra Nayak",
      date: "30th June 2026",
      stars: 5,
      comment: "Utkal Property / Sand2Sky is one of the best property consultants in Bhubaneswar. Their knowledge of luxury apartments and premium properties helped us make the right investment decision. Highly recommended!",
      initial: "B",
    },
    {
      id: 2,
      name: "Devayoni Services",
      date: "1st July 2026",
      stars: 5,
      comment: "Very professional real estate company. They offer excellent options for luxury homes, villas, and premium apartments in Bhubaneswar. The team is responsive, knowledgeable, and customer-focused.",
      initial: "D",
    },
    {
      id: 3,
      name: "Ankita Swain",
      date: "6th July 2026",
      stars: 5,
      comment: "If you're looking for premium properties in Bhubaneswar, this is the right choice. Professional team, transparent advice, and excellent property options. Very satisfied with the guidance provided.",
      initial: "A",
    },
    {
      id: 4,
      name: "Debaraj Sahoo",
      date: "7th July 2026",
      stars: 5,
      comment: "Excellent experience! They helped me find the perfect luxury apartment with transparent pricing and great support throughout the property buying process. Truly reliable property advisors.",
      initial: "D",
    },
  ],
};

/* SVG Icons Helper */
const SvgIcon = ({ name, size = 18 }) => {
  const s = { width: size, height: size };
  switch (name) {
    case "pin":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "phone":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "download":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      );
    case "eye":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "area":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
          <rect x="7" y="7" width="10" height="10" rx="1.5" strokeDasharray="2 2" />
        </svg>
      );
    case "tower":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17" />
          <path d="M10 7h1M13 7h1M10 11h1M13 11h1M10 15h1M13 15h1M10 19h1M13 19h1M3 22h18" />
        </svg>
      );
    case "floors":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2M10 22v-4h4v4" />
        </svg>
      );
    case "flats":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 12 12 17 22 12" />
          <polyline points="2 17 12 22 22 17" />
        </svg>
      );
    case "facing":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4v16a1 1 0 0 0 1 1h5V3H4a1 1 0 0 0-1 1zM21 4v16a1 1 0 0 1-1 1h-5V3h5a1 1 0 0 1 1 1z" />
          <circle cx="7" cy="12" r="1.2" fill="currentColor" />
          <circle cx="17" cy="12" r="1.2" fill="currentColor" />
        </svg>
      );
    case "carpet":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="4" x2="3" y2="20" />
          <line x1="21" y1="4" x2="21" y2="20" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <polyline points="8 8 4 12 8 16" />
          <polyline points="16 8 20 12 16 16" />
        </svg>
      );
    case "bed":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4v16M2 10h20a2 2 0 0 1 2 2v8M2 18h20" />
          <path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
          <circle cx="8.5" cy="7.5" r="1" fill="currentColor" />
          <circle cx="15.5" cy="7.5" r="1" fill="currentColor" />
        </svg>
      );
    case "bath":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16a1 1 0 0 1 1 1v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2a1 1 0 0 1 1-1z" />
          <path d="M6 12V5a2 2 0 0 1 2-2h1M5 20v2M19 20v2" />
        </svg>
      );
    case "balcony":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="1.5" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="7.5" y1="15" x2="7.5" y2="21" />
          <line x1="12" y1="15" x2="12" y2="21" />
          <line x1="16.5" y1="15" x2="16.5" y2="21" />
          <path d="M6 11V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v5" />
        </svg>
      );
    case "car":
    case "parking":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
          <rect x="3" y="11" width="18" height="7" rx="2" />
          <circle cx="7" cy="14.5" r="1.5" fill="currentColor" />
          <circle cx="17" cy="14.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "key":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7.5" cy="15.5" r="4.5" />
          <path d="m11 12 8.5-8.5a1.5 1.5 0 0 1 2 2L20 7l-2-2-2 2 2 2-1.5 1.5" />
          <circle cx="7.5" cy="15.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "overlook":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case "rupee":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
          <path d="M9.5 9h5M9.5 12h5M9.5 15h2.5a2 2 0 0 0 0-4M12 15l2.5 3.5" strokeWidth="1.8" />
        </svg>
      );
    case "rental":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="10" width="7" height="11" rx="1" />
          <path d="M5 13h3M5 17h3" />
          <polyline points="13 11 16 8 21 8" />
          <polyline points="18 5 21 8 18 11" />
          <line x1="13" y1="21" x2="13" y2="15" />
          <line x1="17" y1="21" x2="17" y2="13" />
          <line x1="21" y1="21" x2="21" y2="11" />
        </svg>
      );
    case "star":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "pool":
    case "swimmer":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1M2 16c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1M14 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0zM12 10v4" />
        </svg>
      );
    case "kitchen":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3v18M20 3v18M4 11h16M4 6h16M10 11v10M14 11v10" />
        </svg>
      );
    case "elevator":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="2" width="18" height="20" rx="2" />
          <polyline points="9 9 12 6 15 9" />
          <polyline points="9 15 12 18 15 15" />
        </svg>
      );
    case "temple":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v3M4 9h16M6 9l6-5 6 5M5 9v11h14V9M9 20v-5a3 3 0 0 1 6 0v5" />
        </svg>
      );
    case "child":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2.5" />
          <path d="M6 10h12M12 7.5v8.5M8 21l4-5 4 5" />
        </svg>
      );
    case "laptop":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M2 20h20" />
        </svg>
      );
    case "ev":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case "hall":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6M2 21h20" />
        </svg>
      );
    case "arch":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16M3 7h18M7 21V11a5 5 0 0 1 10 0v10" />
        </svg>
      );
    case "dumbbell":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6.5 6.5 11 11M3 8l3-3M16 21l3-3M2 13l3-3 3 3-3 3zM16 7l3-3 3 3-3 3z" />
        </svg>
      );
    case "cloud":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      );
    case "rain":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v2M8 13v2M12 21v2M12 15v2M16 19v2M16 13v2" />
        </svg>
      );
    case "recycle":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12M14 16l3 3-3 3M8.293 13.596 5.5 9.5 8.5 4.5M15.5 4.5h4.195a1.83 1.83 0 0 1 1.571.88 1.785 1.785 0 0 1 .005 1.785L19 11M11 4.5 8 7.5 5 4.5" />
        </svg>
      );
    case "intercom":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <circle cx="12" cy="7" r="2" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="16" x2="15" y2="16" />
        </svg>
      );
    case "check":
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    default:
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      );
  }
};

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const PropertyDetailsMain = () => {
  const { id, slug } = useParams();
  const [searchParams] = useSearchParams();
  const targetIdOrSlug = id || slug || searchParams.get("id") || searchParams.get("slug");

  const [propData, setPropData] = useState(targetIdOrSlug ? null : DEFAULT_PROPERTY);
  const [loading, setLoading] = useState(Boolean(targetIdOrSlug));

  /* Slider states */
  const [activeSlide, setActiveSlide] = useState(0);

  /* Floorplan active tab */
  const [activePlanTab, setActivePlanTab] = useState(0);

  /* Modals */
  const [lightboxImg, setLightboxImg] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [brochureForm, setBrochureForm] = useState({ name: "", phone: "", email: "" });
  const [brochureSubmitting, setBrochureSubmitting] = useState(false);

  /* Sidebar Lead Form State */
  const [leadForm, setLeadForm] = useState({ name: "", email: "", mobile: "", captchaInput: "" });
  const [captchaCode, setCaptchaCode] = useState("JwmJJP");
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  /* Sidebar Review State */
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", phone: "", text: "", stars: 5 });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [publishedReviews, setPublishedReviews] = useState([]);

  /* Reviews Carousel */
  const [reviewSlide, setReviewSlide] = useState(0);

  /* Generate random captcha */
  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  /* Fetch dynamic property from backend API if an ID or slug is supplied */
  useEffect(() => {
    if (!targetIdOrSlug) return;
    let isMounted = true;
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.PROPERTIES}/${targetIdOrSlug}`);
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          const d = json.data;

          const mapAmenityIcon = (name) => {
            const n = String(name || "").toLowerCase();
            if (n.includes("pool") || n.includes("swim")) return "pool";
            if (n.includes("kitchen")) return "kitchen";
            if (n.includes("gym") || n.includes("fitness")) return "dumbbell";
            if (n.includes("play") || n.includes("child")) return "child";
            if (n.includes("lift") || n.includes("elevator")) return "elevator";
            if (n.includes("park")) return "parking";
            if (n.includes("temple")) return "temple";
            if (n.includes("ev") || n.includes("charg")) return "ev";
            if (n.includes("hall") || n.includes("banquet")) return "hall";
            if (n.includes("intercom")) return "intercom";
            if (n.includes("cowork") || n.includes("work")) return "laptop";
            if (n.includes("rain") || n.includes("water")) return "rain";
            if (n.includes("waste") || n.includes("sewage")) return "recycle";
            if (n.includes("lounge") || n.includes("sky")) return "cloud";
            if (n.includes("gate") || n.includes("entrance")) return "arch";
            return "check";
          };

          const dynamicAmenities = Array.isArray(d.amenities) && d.amenities.length > 0
            ? d.amenities.map((a) => ({ name: a, icon: mapAmenityIcon(a) }))
            : [];

          const dynamicSpecs = [
            d.projectArea && { label: "Project Area", value: d.projectArea, icon: "area" },
            d.floors && { label: "Total Floors", value: d.floors, icon: "floors" },
            d.houses !== undefined && d.houses !== null && d.houses !== "" && { label: "Number of Units", value: String(d.houses), icon: "flats" },
            d.facing && { label: "Facing", value: d.facing, icon: "facing" },
            d.superArea && { label: "Carpet / Super Area (sq.ft.)", value: d.superArea, icon: "carpet" },
            d.bedrooms && { label: "Bedrooms", value: String(d.bedrooms), icon: "bed" },
            d.bathrooms && { label: "Bathrooms", value: String(d.bathrooms), icon: "bath" },
            d.parking && { label: "Parking", value: String(d.parking), icon: "car" },
            d.category && { label: "Category", value: d.category, icon: "key" },
            d.overlooking && { label: "Property Overlooking", value: d.overlooking, icon: "overlook" },
            d.maintenance !== undefined && d.maintenance !== null && d.maintenance !== "" && { label: "Maintenance / Month", value: `₹ ${Number(d.maintenance).toLocaleString("en-IN")}`, icon: "rupee" },
            d.rental !== undefined && d.rental !== null && d.rental !== "" && { label: "Expected Rental Return", value: `₹ ${Number(d.rental).toLocaleString("en-IN")}`, icon: "rental" },
          ].filter(Boolean);

          const dynamicNeighbourhood = Array.isArray(d.nearbyPlaces) && d.nearbyPlaces.length > 0
            ? d.nearbyPlaces.filter((np) => np && np.name).map((np) => ({ name: np.name, dist: np.distance || "" }))
            : [];

          // Fetch similar real properties
          let similarMapped = [];
          try {
            const simRes = await fetch(`${API_ENDPOINTS.PROPERTIES}?isDraft=false&limit=6`);
            const simJson = await simRes.json();
            if (simJson.success && Array.isArray(simJson.data)) {
              const others = simJson.data.filter((p) => p.slug !== targetIdOrSlug && p._id !== targetIdOrSlug);
              if (others.length > 0) {
                similarMapped = others.slice(0, 4).map((op) => ({
                  id: op._id,
                  slug: op.slug,
                  title: op.title,
                  price: op.price
                    ? `₹ ${Number(op.price).toLocaleString("en-IN")}`
                    : "Price on Request",
                  location: op.location || "",
                  image: Array.isArray(op.images) && op.images.length > 0 ? getMediaUrl(op.images[0]) : feat1,
                  tag: op.isFeatured ? "Featured" : op.status || "Residential",
                }));
              }
            }
          } catch (e) {
            console.warn("Could not load similar properties", e);
          }

          setPropData({
            id: d._id || d.slug,
            slug: d.slug || d._id,
            title: d.title || "",
            subtitle: d.metaTitle || "",
            location: d.location || "",
            fullAddress: d.location || "",
            builder: d.builderName || d.builder || "",
            priceRange: d.price
              ? `₹ ${Number(d.price).toLocaleString("en-IN")}`
              : "Price on Request",
            pricePerSqft: d.pricePerSqft ? `₹ ${Number(d.pricePerSqft).toLocaleString("en-IN")} / Sqft` : "",
            bookingAmount: d.bookingAmount
              ? `₹ ${Number(d.bookingAmount).toLocaleString("en-IN")}`
              : "",
            videoUrl: d.youtubeUrl ? getYoutubeEmbedUrl(d.youtubeUrl) : "",
            brochurePdf: d.brochurePdf
              ? getMediaUrl(d.brochurePdf)
              : Array.isArray(d.floorPlans)
              ? getMediaUrl(d.floorPlans.find((fp) => String(fp).toLowerCase().endsWith(".pdf")) || "")
              : "",
            type: d.propertyType || "",
            furnishing: d.furnishing || "",
            sba: d.superArea
              ? (String(d.superArea).toLowerCase().includes("sq") ? d.superArea : `${d.superArea} Sqft`)
              : (d.projectArea || ""),
            availableFrom: d.possession
              ? new Date(d.possession).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
              : "",
            status: d.status || "Active",
            reraNo: d.rera || "",
            viewsCount: d.viewsCount || 0,
            overview: dynamicSpecs,
            amenities: dynamicAmenities,
            keyFeatures: Array.isArray(d.amenities) && d.amenities.length > 0 ? d.amenities.slice(0, 10) : [],
            neighbourhood: dynamicNeighbourhood,
            similarProjects: similarMapped,
            description: d.description || "",
            locationDetails: d.location || "",
            images: Array.isArray(d.images) && d.images.length > 0 ? d.images.map((img) => getMediaUrl(img)) : [pImg1],
            floorPlans: Array.isArray(d.floorPlans) && d.floorPlans.length > 0
              ? d.floorPlans.map((fp, i) => ({ label: `Plan ${i + 1}`, title: `Floor Plan ${i + 1}`, img: getMediaUrl(fp) }))
              : [],
          });
        }
      } catch (err) {
        console.error("Failed to load property details from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProperty();
    return () => {
      isMounted = false;
    };
  }, [targetIdOrSlug]);

  /* Fetch live published reviews for this property */
  useEffect(() => {
    let isMounted = true;
    const fetchPublishedReviews = async () => {
      try {
        const propSlugOrId = slug || targetIdOrSlug || "royal-presidency";
        const res = await fetch(`${API_ENDPOINTS.PROPERTY_REVIEWS}?propertySlug=${propSlugOrId}&status=Published`);
        const json = await res.json();
        if (isMounted && json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((r) => {
            const d = new Date(r.createdAt || Date.now());
            return {
              id: r._id,
              name: r.name,
              stars: r.rating || 5,
              comment: r.comment,
              date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
              initial: r.name ? r.name.charAt(0).toUpperCase() : "U",
            };
          });
          setPublishedReviews(mapped);
        } else if (isMounted) {
          setPublishedReviews([]);
        }
      } catch (err) {
        console.warn("Could not fetch published reviews", err);
      }
    };
    fetchPublishedReviews();
    return () => {
      isMounted = false;
    };
  }, [slug, targetIdOrSlug]);

  const slideCount = propData && Array.isArray(propData.images) ? propData.images.length : 0;
  const nextSlide = () => slideCount > 0 && setActiveSlide((prev) => (prev + 1) % slideCount);
  const prevSlide = () => slideCount > 0 && setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);

  const activeReviews = publishedReviews;
  const avgRating = (
    activeReviews.reduce((sum, r) => sum + (r.stars || 5), 0) / (activeReviews.length || 1)
  ).toFixed(1);

  const nextReviews = () => {
    setReviewSlide((prev) => (prev + 2 < activeReviews.length ? prev + 2 : 0));
  };
  const prevReviews = () => {
    setReviewSlide((prev) => (prev - 2 >= 0 ? prev - 2 : Math.max(0, activeReviews.length - 2)));
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.mobile) return alert("Please fill your Name and Mobile Number");
    if (leadForm.captchaInput.trim() !== captchaCode.trim()) {
      alert("Captcha does not match. Please try again.");
      refreshCaptcha();
      return;
    }

    try {
      await fetch(API_ENDPOINTS.ENQUIRY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          email: leadForm.email ? leadForm.email.trim() : `${leadForm.mobile}@lead.utkalproperty.com`,
          phone: leadForm.mobile.trim(),
          location: propData.location || "Bhubaneswar",
          service: "Residential Properties",
          interest: "View Contact Number",
          message: `Inquired on property: ${propData.title}`,
          source: `Property Details (${propData.title})`,
        }),
      });
    } catch (err) {
      console.warn("Could not save lead enquiry to database:", err);
    }

    setLeadSubmitted(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) {
      return alert("Please enter your Name and Review");
    }
    if (!reviewForm.email) {
      return alert("Please enter your Email address");
    }

    setReviewSubmitting(true);
    setReviewError(null);

    try {
      const res = await fetch(API_ENDPOINTS.PROPERTY_REVIEWS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: propData.id,
          propertySlug: slug || propData.slug || propData.id || "royal-presidency",
          propertyTitle: propData.title,
          name: reviewForm.name.trim(),
          email: reviewForm.email.trim(),
          phone: reviewForm.phone ? reviewForm.phone.trim() : "",
          rating: reviewForm.stars || 5,
          comment: reviewForm.text.trim(),
        }),
      });

      const json = await res.json();
      if (json && json.success) {
        setReviewSubmitted(true);
        setReviewError(null);
        setTimeout(() => {
          setReviewForm({ name: "", email: "", phone: "", text: "", stars: 5 });
          setReviewSubmitted(false);
        }, 4000);
      } else {
        const errorMsg = json.message || "Failed to submit review.";
        setReviewError(errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      console.error("Review submission error:", err);
      setReviewError("Network error. Please try again later.");
      alert("Network error. Please try again later.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pdm-page">
        <div className="pdm-container" style={{ padding: "80px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#475569" }}>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!propData) {
    return (
      <div className="pdm-page">
        <div className="pdm-container" style={{ padding: "80px 20px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "12px", color: "#0f172a" }}>Property Not Found</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            The property you are looking for does not exist or has been removed.
          </p>
          <Link to="/properties" className="pdm-btn pdm-btn-contact" style={{ display: "inline-flex", textDecoration: "none" }}>
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pdm-page">
      <div className="pdm-container">

        {/* =================================================================
            SERIAL 1: TOP HERO SPLIT CARD (Matches Image 1)
           ================================================================= */}
        <section className="pdm-hero-section">
          {/* Left: Image Slider */}
          <div className="pdm-slider-wrap">
            <div className="pdm-slider-main" onClick={() => setLightboxImg(propData.images[activeSlide])}>
              <img
                src={propData.images[activeSlide]}
                alt={propData.title}
                className="pdm-slider-img"
              />
              <button
                type="button"
                className="pdm-nav-btn pdm-nav-prev"
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                className="pdm-nav-btn pdm-nav-next"
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                aria-label="Next image"
              >
                ›
              </button>
              <span className="pdm-slider-count">
                {activeSlide + 1} / {slideCount}
              </span>
            </div>
            {/* Slider Dots/Thumbs */}
            <div className="pdm-slider-thumbs">
              {propData.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pdm-thumb-btn ${activeSlide === i ? "is-active" : ""}`}
                  onClick={() => setActiveSlide(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info Card */}
          <div className="pdm-hero-card">
            <h1 className="pdm-hero-title">{propData.title}</h1>
            {propData.subtitle && <p className="pdm-hero-sub">{propData.subtitle}</p>}

            {propData.location && (
              <div className="pdm-hero-loc">
                <span className="pdm-hero-loc-icon"><SvgIcon name="pin" size={16} /></span>
                <span>{propData.location}</span>
              </div>
            )}

            {/* Builder pill */}
            {propData.builder && (
              <div className="pdm-builder-pill">
                <div className="pdm-builder-avatar">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="pdm-builder-text">
                  <span className="pdm-builder-tag">Builder :</span>
                  <span className="pdm-builder-name">{propData.builder}</span>
                </div>
              </div>
            )}

            {/* Price Box */}
            <div className="pdm-price-row">
              <span className="pdm-price-main">{propData.priceRange}</span>
              {propData.pricePerSqft && <span className="pdm-price-sqft">{propData.pricePerSqft}</span>}
            </div>

            {/* Specs 2-Column Grid */}
            <div className="pdm-specs-grid">
              {propData.type && (
                <div className="pdm-spec-item">
                  <div className="pdm-spec-icon">🏬</div>
                  <div>
                    <div className="pdm-spec-label">Type</div>
                    <div className="pdm-spec-val">{propData.type}</div>
                  </div>
                </div>
              )}
              {propData.bookingAmount && (
                <div className="pdm-spec-item">
                  <div className="pdm-spec-icon">📝</div>
                  <div>
                    <div className="pdm-spec-label">Booking Amount</div>
                    <div className="pdm-spec-val">{propData.bookingAmount}</div>
                  </div>
                </div>
              )}
              {propData.furnishing && (
                <div className="pdm-spec-item">
                  <div className="pdm-spec-icon">🛋️</div>
                  <div>
                    <div className="pdm-spec-label">Furnishing</div>
                    <div className="pdm-spec-val">{propData.furnishing}</div>
                  </div>
                </div>
              )}
              {propData.sba && (
                <div className="pdm-spec-item">
                  <div className="pdm-spec-icon">↔️</div>
                  <div>
                    <div className="pdm-spec-label">SBA</div>
                    <div className="pdm-spec-val">{propData.sba}</div>
                  </div>
                </div>
              )}
              {propData.availableFrom && (
                <div className="pdm-spec-item">
                  <div className="pdm-spec-icon">📅</div>
                  <div>
                    <div className="pdm-spec-label">Possession Date</div>
                    <div className="pdm-spec-val">{propData.availableFrom}</div>
                  </div>
                </div>
              )}
              {propData.status && (
                <div className="pdm-spec-item">
                  <div className="pdm-spec-icon">✔️</div>
                  <div>
                    <div className="pdm-spec-label">Status</div>
                    <div className="pdm-spec-val">{propData.status}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pdm-hero-actions">
              <button
                type="button"
                className="pdm-btn pdm-btn-contact"
                onClick={() => setContactModalOpen(true)}
              >
                <SvgIcon name="phone" size={17} />
                <span>Contact</span>
              </button>

              <button
                type="button"
                className="pdm-btn pdm-btn-brochure"
                onClick={() => setBrochureModalOpen(true)}
              >
                <SvgIcon name="download" size={17} />
                <span>Download Brochure</span>
              </button>
            </div>

            {/* RERA and Views */}
            {propData.reraNo && (
              <div className="pdm-hero-footer">
                <span className="pdm-rera">RERA NO: {propData.reraNo}</span>
              </div>
            )}
          </div>
        </section>

        {/* =================================================================
            SERIAL 2: PROJECT OVERVIEW (Matches Image 2)
           ================================================================= */}
        <section className="pdm-card pdm-section-overview">
          <div className="pdm-section-head-row">
            <h2 className="pdm-sec-title">Project Overview</h2>

            {/* Social Share Icons */}
            <div className="pdm-social-shares">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="pdm-share-btn pdm-share-fb" title="Share on Facebook">f</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="pdm-share-btn pdm-share-tw" title="Share on Twitter">𝕏</a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="pdm-share-btn pdm-share-wa" title="Share on WhatsApp">W</a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" className="pdm-share-btn pdm-share-tg" title="Share on Telegram">✈</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="pdm-share-btn pdm-share-in" title="Share on LinkedIn">in</a>
              <a href="mailto:info@utkalproperty.com" className="pdm-share-btn pdm-share-mail" title="Share via Email">✉</a>
              <button type="button" className="pdm-share-btn pdm-share-plus" title="More Options">+</button>
            </div>
          </div>

          {propData.overview.length > 0 && (
            <div className="pdm-overview-grid">
              {propData.overview.map((item, i) => (
                <div key={i} className="pdm-overview-item">
                  <div className="pdm-overview-icon">
                    <SvgIcon name={item.icon} size={26} />
                  </div>
                  <div className="pdm-overview-info">
                    <span className="pdm-ov-label">{item.label}</span>
                    <span className="pdm-ov-val">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =================================================================
              SERIAL 3: DESCRIPTION & LOCATION DETAILS (Matches Image 3)
             ================================================================= */}
          {propData.description && (
            <div className="pdm-prose-block">
              <h3 className="pdm-gold-heading">Description</h3>
              <span className="pdm-gold-bar" />
              <div
                className="pdm-prose-text"
                dangerouslySetInnerHTML={{ __html: propData.description }}
              />
            </div>
          )}

          {propData.locationDetails && (
            <div className="pdm-prose-block">
              <h3 className="pdm-gold-heading">Location</h3>
              <span className="pdm-gold-bar" />
              <p className="pdm-prose-text">{propData.locationDetails}</p>
            </div>
          )}
        </section>

        {/* =================================================================
            SERIAL 4 & 5: AMENITIES + KEY FEATURES + FLOOR PLANS + SIDEBAR
            (Matches Image 4 & Image 5)
           ================================================================= */}
        <div className="pdm-two-col-layout">
          {/* Main Left Column */}
          <div className="pdm-col-main">

            {/* Serial 4: Amenities */}
            {propData.amenities.length > 0 && (
              <div className="pdm-card">
                <h3 className="pdm-gold-heading">Amenities {propData.title}</h3>
                <span className="pdm-gold-bar" />

                <div className="pdm-amenities-grid">
                  {propData.amenities.map((am, i) => (
                    <div key={i} className="pdm-amenity-card">
                      <div className="pdm-amenity-icon">
                        <SvgIcon name={am.icon} size={24} />
                      </div>
                      <span className="pdm-amenity-name">{am.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Serial 5: Key Features */}
            {propData.keyFeatures.length > 0 && (
              <div className="pdm-card">
                <h3 className="pdm-gold-heading">Key Features {propData.title}</h3>
                <span className="pdm-gold-bar" />

                <div className="pdm-features-wrap">
                  {propData.keyFeatures.map((kf, i) => (
                    <span key={i} className="pdm-feature-pill">
                      <SvgIcon name="star" size={14} />
                      <span>{kf}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Serial 5: Floor Plans & Documents */}
            {propData.floorPlans.length > 0 && (
              <div className="pdm-card">
                <h3 className="pdm-gold-heading">Floor Plans &amp; Documents</h3>
                <span className="pdm-gold-bar" />

                {/* Tabs */}
                <div className="pdm-floorplan-tabs">
                  {propData.floorPlans.map((fp, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`pdm-fp-tab ${activePlanTab === i ? "is-active" : ""}`}
                      onClick={() => setActivePlanTab(i)}
                    >
                      {fp.label}
                    </button>
                  ))}
                </div>

                {/* Floor Plan Display */}
                <div
                  className="pdm-floorplan-viewer"
                  onClick={() => setLightboxImg(propData.floorPlans[activePlanTab]?.img)}
                  title="Click to view full plan"
                >
                  <div className="pdm-fp-meta-tag">
                    {propData.floorPlans[activePlanTab]?.title}
                  </div>
                  <img
                    src={propData.floorPlans[activePlanTab]?.img}
                    alt={propData.floorPlans[activePlanTab]?.title}
                    className="pdm-fp-img"
                  />
                  <span className="pdm-fp-zoom-hint">🔍 Click to zoom blueprint</span>
                </div>
              </div>
            )}

            {/* =================================================================
                SERIAL 6: WALKTHROUGH VIDEO (Matches Image 6)
               ================================================================= */}
            {propData.videoUrl && (
              <div className="pdm-card">
                <h3 className="pdm-gold-heading">Walkthrough video of {propData.title}</h3>
                <span className="pdm-gold-bar" />

                <div className="pdm-video-wrap">
                  <iframe
                    src={propData.videoUrl}
                    title={`Walkthrough video of ${propData.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* =================================================================
                SERIAL 7: EXPLORE NEIGHBOURHOOD (Matches Image 7)
               ================================================================= */}
            {propData.neighbourhood.length > 0 && (
              <div className="pdm-card">
                <h3 className="pdm-gold-heading">Explore Neighbourhood - {propData.title}</h3>
                <span className="pdm-gold-bar" />

                <div className="pdm-neighbour-grid">
                  {propData.neighbourhood.map((item, i) => (
                    <div key={i} className="pdm-neighbour-card">
                      <span className="pdm-nb-name">{item.name}</span>
                      <span className="pdm-nb-dist">{item.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================
                SERIAL 8: LOCATION MAP (Matches Image 8)
               ================================================================= */}
            {propData.fullAddress && (
              <div className="pdm-card">
                <p className="pdm-map-address">
                  <strong>Location:</strong> {propData.fullAddress}
                </p>
                <div className="pdm-map-wrap">
                  <iframe
                    title="Google Map Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(propData.fullAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    loading="lazy"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar */}
          <aside className="pdm-col-sidebar">

            {/* Serial 4 Right Widget: Rate & Review */}
            <div className="pdm-card pdm-sidebar-widget">
              <h3 className="pdm-widget-title">Rate &amp; Review</h3>
              
              <div className="pdm-star-picker">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`pdm-star-btn ${reviewForm.stars >= star ? "is-filled" : ""}`}
                    onClick={() => setReviewForm({ ...reviewForm, stars: star })}
                    aria-label={`Rate ${star} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <form onSubmit={handleReviewSubmit} className="pdm-widget-form">
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={reviewForm.email}
                  onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Enter Your Phone"
                  value={reviewForm.phone}
                  onChange={(e) => setReviewForm({ ...reviewForm, phone: e.target.value })}
                />
                <textarea
                  placeholder="Write your review..."
                  rows={3}
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  required
                />
                <button type="submit" className="pdm-btn-teal" disabled={reviewSubmitting}>
                  {reviewSubmitting ? "Submitting..." : "Submit"}
                </button>
                {reviewSubmitted && (
                  <p className="pdm-form-success">Thank you! Your review has been submitted for moderation.</p>
                )}
                {reviewError && (
                  <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{reviewError}</p>
                )}
              </form>
            </div>

            {/* Serial 5 Right Widget: Kindly fill in your details to view contact */}
            <div className="pdm-card pdm-sidebar-widget">
              <h3 className="pdm-lead-title">
                Kindly fill in your details to view the contact number.
              </h3>

              {leadSubmitted ? (
                <div className="pdm-lead-revealed">
                  <span className="pdm-lead-badge">✓ Verified Buyer</span>
                  <h4>Contact Details:</h4>
                  <a href="tel:+917077606668" className="pdm-revealed-number">
                    📞 +91 70776 06668
                  </a>
                  <a href="tel:+919861234567" className="pdm-revealed-number">
                    📞 +91 98612 34567
                  </a>
                  <p className="pdm-lead-note">Our senior property consultant will call you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="pdm-widget-form">
                  <div className="pdm-field-group">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="pdm-field-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    />
                  </div>

                  <div className="pdm-field-group">
                    <label>Mobile</label>
                    <input
                      type="tel"
                      placeholder="Enter your contact number"
                      value={leadForm.mobile}
                      onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                      required
                    />
                  </div>

                  {/* Captcha */}
                  <div className="pdm-field-group">
                    <label>Captcha</label>
                    <div className="pdm-captcha-row">
                      <div className="pdm-captcha-badge">{captchaCode}</div>
                      <button
                        type="button"
                        className="pdm-btn-captcha-refresh"
                        onClick={refreshCaptcha}
                      >
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="pdm-field-group">
                    <label>Enter Captcha</label>
                    <input
                      type="text"
                      placeholder="Enter the text"
                      value={leadForm.captchaInput}
                      onChange={(e) => setLeadForm({ ...leadForm, captchaInput: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="pdm-btn-teal">
                    Submit
                  </button>
                </form>
              )}
            </div>

          </aside>
        </div>

        {/* =================================================================
            SERIAL 8: SIMILAR PROJECTS (Matches Image 8)
           ================================================================= */}
        <section className="pdm-similar-section">
          <h2 className="pdm-gold-heading">Similar Project</h2>
          <span className="pdm-gold-bar" />

          <div className="pdm-similar-grid">
            {propData.similarProjects.map((sp) => (
              <article key={sp.id} className="pdm-similar-card">
                <div className="pdm-sim-img-wrap">
                  <span className="pdm-sim-tag">{sp.tag}</span>
                  <img src={sp.image} alt={sp.title} />
                </div>
                <div className="pdm-sim-content">
                  <h4 className="pdm-sim-title">{sp.title}</h4>
                  <p className="pdm-sim-loc">📍 {sp.location}</p>
                  <p className="pdm-sim-price">{sp.price}</p>
                  <Link to={sp.slug ? `/properties/${sp.slug}` : "/properties"} className="pdm-sim-link">
                    View Project Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =================================================================
            SERIAL 9: WHAT PEOPLE SAY ABOUT US / GOOGLE REVIEWS (Matches Image 9)
           ================================================================= */}
        <section className="pdm-reviews-section">
          <div className="pdm-reviews-header">
            <div>
              <h2 className="pdm-reviews-title">What People Say About Us</h2>
              <div className="pdm-rating-summary">
                <span className="pdm-rate-big">{avgRating}</span>
                <span className="pdm-rate-stars">
                  {"★".repeat(Math.round(Number(avgRating)) || 5)}
                  {"☆".repeat(Math.max(0, 5 - (Math.round(Number(avgRating)) || 5)))}
                </span>
                <span className="pdm-rate-count">({activeReviews.length} Reviews)</span>
              </div>
            </div>

            {/* Google Reviews Badge */}
            <div className="pdm-google-badge">
              <span className="pdm-google-logo">
                <span style={{ color: "#4285F4" }}>G</span>
                <span style={{ color: "#EA4335" }}>o</span>
                <span style={{ color: "#FBBC05" }}>o</span>
                <span style={{ color: "#4285F4" }}>g</span>
                <span style={{ color: "#34A853" }}>l</span>
                <span style={{ color: "#EA4335" }}>e</span>
              </span>
              <span className="pdm-google-sub">Reviews</span>
            </div>
          </div>

          {/* Review Cards Grid / Slider */}
          <div className="pdm-reviews-grid">
            {activeReviews.slice(reviewSlide, reviewSlide + 2).map((rev) => (
              <div key={rev.id} className="pdm-review-card">
                <div className="pdm-rev-user-row">
                  <div className="pdm-rev-avatar">{rev.initial}</div>
                  <div>
                    <h4 className="pdm-rev-name">{rev.name}</h4>
                    <div className="pdm-rev-date-row">
                      <span className="pdm-rev-stars">
                        {"★".repeat(rev.stars || 5)}
                        {"☆".repeat(Math.max(0, 5 - (rev.stars || 5)))}
                      </span>
                      <span className="pdm-rev-date">{rev.date}</span>
                    </div>
                  </div>
                </div>
                <p className="pdm-rev-comment">{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Slider navigation arrows */}
          <div className="pdm-reviews-nav">
            <button
              type="button"
              className="pdm-rev-nav-btn"
              onClick={prevReviews}
              aria-label="Previous reviews"
            >
              ‹
            </button>
            <button
              type="button"
              className="pdm-rev-nav-btn"
              onClick={nextReviews}
              aria-label="Next reviews"
            >
              ›
            </button>
          </div>
        </section>

      </div>

      {/* =================================================================
          LIGHTBOX MODAL
         ================================================================= */}
      {lightboxImg && (
        <div className="pdm-lightbox" onClick={() => setLightboxImg(null)}>
          <div className="pdm-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImg} alt="Preview" />
            <button
              type="button"
              className="pdm-lightbox-close"
              onClick={() => setLightboxImg(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* =================================================================
          CONTACT MODAL
         ================================================================= */}
      {contactModalOpen && (
        <div className="pdm-lightbox" onClick={() => setContactModalOpen(false)}>
          <div className="pdm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pdm-modal-head">
              <h3>Contact Property Advisor</h3>
              <button type="button" onClick={() => setContactModalOpen(false)}>✕</button>
            </div>
            <div className="pdm-modal-body">
              <p>Get in touch directly with our dedicated real estate advisor for <strong>{propData.title}</strong>.</p>
              <div className="pdm-contact-links">
                <a href="tel:+917077606668" className="pdm-modal-phone">
                  📞 Call: +91 70776 06668
                </a>
                <a href="tel:+919861234567" className="pdm-modal-phone">
                  📞 Call: +91 98612 34567
                </a>
                <a
                  href={`https://wa.me/917077606668?text=Hello%20Utkal%20Property,%20I%20am%20interested%20in%20${encodeURIComponent(propData.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pdm-modal-wa"
                >
                  💬 WhatsApp Us
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setContactModalOpen(false);
                    window.dispatchEvent(
                      new CustomEvent("open-enquiry-modal", {
                        detail: {
                          location: propData.location || "Bhubaneswar",
                          interest: "Buy a Property",
                          message: `Hi, I am interested in ${propData.title}. Please provide more details.`
                        }
                      })
                    );
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "12px",
                    background: "linear-gradient(135deg, #1b8d44 0%, #0d5d2b 100%)",
                    color: "#fff",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    marginTop: "8px"
                  }}
                >
                  ✉ Fill Property Enquiry Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          BROCHURE MODAL
         ================================================================= */}
      {brochureModalOpen && (
        <div className="pdm-lightbox" onClick={() => setBrochureModalOpen(false)}>
          <div className="pdm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pdm-modal-head">
              <h3>Download Official Brochure</h3>
              <button type="button" onClick={() => setBrochureModalOpen(false)}>✕</button>
            </div>
            <div className="pdm-modal-body">
              <p>Enter your email or phone to receive the high-resolution architectural plans and pricing breakdown for <strong>{propData.title}</strong>.</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!brochureForm.name.trim() || !brochureForm.phone.trim()) return;
                  setBrochureSubmitting(true);
                  try {
                    await fetch(API_ENDPOINTS.LEADS, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        propertyId: propData.id,
                        propertySlug: propData.slug || targetIdOrSlug,
                        propertyTitle: propData.title,
                        name: brochureForm.name.trim(),
                        phone: brochureForm.phone.trim(),
                        email: brochureForm.email.trim(),
                        source: "Brochure Download",
                        type: "Hot",
                        status: "New",
                        enquiry: propData.title ? `Brochure: ${propData.title}` : "Brochure Download",
                        notes: `Requested Official Brochure Download for ${propData.title}`,
                      }),
                    });

                    if (propData.brochurePdf) {
                      const downloadUrl = `${API_ENDPOINTS.PROPERTIES}/${propData.slug || propData.id}/brochure`;
                      const a = document.createElement("a");
                      a.href = downloadUrl;
                      a.setAttribute(
                        "download",
                        `${(propData.slug || propData.title || "property")
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}-brochure.pdf`
                      );
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                    } else {
                      alert("Thank you! Brochure PDF is not uploaded yet; our team will send it to your phone/email shortly.");
                    }

                    setBrochureForm({ name: "", phone: "", email: "" });
                    setBrochureModalOpen(false);
                  } catch (err) {
                    console.error("Brochure submit error:", err);
                    alert("Something went wrong. Please try again.");
                  } finally {
                    setBrochureSubmitting(false);
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={brochureForm.name}
                  onChange={(e) => setBrochureForm({ ...brochureForm, name: e.target.value })}
                  className="pdm-modal-input"
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number *"
                  required
                  value={brochureForm.phone}
                  onChange={(e) => setBrochureForm({ ...brochureForm, phone: e.target.value })}
                  className="pdm-modal-input"
                />
                <input
                  type="email"
                  placeholder="Your Email (Optional)"
                  value={brochureForm.email}
                  onChange={(e) => setBrochureForm({ ...brochureForm, email: e.target.value })}
                  className="pdm-modal-input"
                />
                <button
                  type="submit"
                  className="pdm-btn-teal"
                  disabled={brochureSubmitting}
                  style={{ width: "100%", marginTop: "12px" }}
                >
                  {brochureSubmitting ? "Processing..." : "Download Now"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyDetailsMain;
