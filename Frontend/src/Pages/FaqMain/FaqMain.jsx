
import React from "react";

import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";
import Faq from "../../Components/Faq/Faq";

import faqImage from "../../assets/page-title-about.jpg";

const FaqMain = () => {
  return (
    <div>
      <Breadcrumb
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions and learn more about our property services."
        image={faqImage}
      />

      <Faq />
    </div>
  );
};

export default FaqMain;
