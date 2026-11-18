
import React from "react";

import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";
import OurTeamFirst from "../../Components/OurTeamFirst/OurTeamFirst";

import teamImage from "../../assets/page-title-about.jpg";

const OurTeam = () => {
  return (
    <div>
      <Breadcrumb
        title="Our Team"
        subtitle="Meet our dedicated team of professionals committed to helping you find the perfect property."
        image={teamImage}
      />

      <OurTeamFirst />
    </div>
  );
};

export default OurTeam;
