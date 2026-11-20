
import React from "react";


import propertyImage from "../../assets/page-title-about.jpg";
import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";
import SellProperty from "../../Components/SellProperty/SellProperty";

const SellAndRentProperty = () => {
  return (
    <div>
      <Breadcrumb
        title="Sell or Rent Your Property"
        subtitle="List your property with us. Whether you want to sell your home or rent your property, we help you connect with the right buyers and tenants."
        image={propertyImage}
      />

      <SellProperty/>
    </div>
  );
};

export default SellAndRentProperty;
