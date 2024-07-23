import React from "react";
import "./Banner.css";
import img from "../images/IMG_7546.PNG";
import img2 from "../images/IMG_7548.PNG";
import twt from "../images/IMG_7549.PNG";
import sei from "../images/IMG_7550.PNG";

const Banner = () => {
  return (
    <div className="bg-img">
      <div className="lg:p-20 md:p-20 p-10 py-20 bg-black bg-opacity-60">
        <div className="relative">
          <img className="hidden lg:block md:block" src={img} alt="quosha" />
          <img className="lg:hidden md:hidden" src={img2} alt="quosha" />
          <div className="flex lg:gap-7 md:gap-7 gap-4 absolute lg:right-[6vw] lg:bottom-[5.5vw] lg:left-auto md:right-[4vw] md:bottom-[5vw] md:left-auto left-[6vw] bottom-[15.5vw]">
            <a href="https://x.com/quoshaink" target="_blank" rel="noopener noreferrer">
              <img className="lg:w-[9vw] md:w-[9vw] w-[16vw] hover:opacity-85" src={twt} alt="twitter" />
            </a>
            <a href="https://x.com/Anons_sei" target="_blank" rel="noopener noreferrer">
              <img className="lg:w-[9vw] md:w-[9vw] w-[16vw] hover:opacity-85" src={sei} alt="sei" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
