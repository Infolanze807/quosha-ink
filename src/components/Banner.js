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
          <div className="flex lg:gap-4 md:gap-2 gap-1 absolute lg:right-[5.5vw] lg:bottom-[4.7vw] lg:left-auto md:right-[3vw] md:bottom-[3.5vw] md:left-auto left-[7vw] bottom-[12vw]">
            <a href="https://x.com/quoshaink" className="bg-gradient-to-r from-[#feee48] to-[#2eb894] hover:from-[#2eb894] hover:to-[#feee48] rounded-lg lg:py-3 md:py-2 py-2 lg:px-5 md:px-4 px-3" target="_blank" rel="noopener noreferrer">
              <img className="lg:w-[7vw] md:w-[7vw] w-[10vw]" src={twt} alt="twitter" />
            </a>
            <a href="https://x.com/Anons_sei" className="bg-gradient-to-r from-[#ab539e] to-[#ef6d50] hover:from-[#ef6d50] hover:to-[#ab539e] rounded-lg lg:py-3 md:py-2 py-2 lg:px-5 md:px-4 px-3" target="_blank" rel="noopener noreferrer">
              <img className="lg:w-[7vw] md:w-[7vw] w-[10vw]" src={sei} alt="sei" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
