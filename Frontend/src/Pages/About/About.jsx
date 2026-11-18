
import React from "react";

import Breadcrumb from "../../Components/Breadcrumb/Breadcrumb";

import AboutFirst from "../../Components/AboutFirst/AboutFirst";
import AboutSecond from "../../Components/AboutSecond/AboutSecond";
import AboutThird from "../../Components/AboutThird/AboutThird";
import AboutFour from "../../Components/AboutFour/AboutFour";
import AboutFive from "../../Components/AboutFive/AboutFive";
import AboutSix from "../../Components/AboutSix/AboutSix";
import AboutSeven from "../../Components/AboutSeven/AboutSeven";

import aboutImage from "../../assets/page-title-about.jpg";

const About = () => {
  return (
    <div>
      <Breadcrumb
        title="About Us"
        subtitle="Learn who we are, what we do and why families trust us to help them find the right property."
        image={aboutImage}
      />

      <AboutFirst />
      <AboutSecond />
      <AboutThird />
      <AboutFour />
      <AboutFive />
      <AboutSix />
      <AboutSeven />
    </div>
  );
};

export default About;
