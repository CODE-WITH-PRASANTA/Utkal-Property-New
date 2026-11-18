
import React from "react";

import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";
import Property from "../../Components/property/property";

import propertyImage from "../../assets/page-title-about.jpg";

const PropertyMain = () => {
  return (
    <div>
      <Breadcrumb
        title="Our Properties"
        subtitle="Explore our exclusive collection of properties and find the perfect place for your future."
        image={propertyImage}
      />

      <Property />
    </div>
  );
};

export default PropertyMain;
