
import React from "react";

import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";
import PropertyDetailsMain from "../../Components/PropertyDetailsMain/PropertyDetailsMain";

import propertyImage from "../../assets/page-title-about.jpg";

const PropertyDetails = () => {
  return (
    <div>
      <Breadcrumb
        title="Property Details"
        subtitle="Discover every detail of your dream property, including features, amenities and location."
        image={propertyImage}
      />

      <PropertyDetailsMain />
    </div>
  );
};

export default PropertyDetails;
