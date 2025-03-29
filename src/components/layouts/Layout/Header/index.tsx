// import React from "react";
// import Nav from "./Nav";

// interface HeaderProps {
//   handleShow: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ handleShow }: HeaderProps) => {
//   return (
//     <header>
//       <Nav handleShow={handleShow} />
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect, useRef } from "react";
import Nav from "./Nav";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";

interface HeaderProps {
  handleShow: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleShow }) => {
  const [showSlider, setShowSlider] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const sliderTop = sliderRef.current.getBoundingClientRect().top;
        setIsSticky(sliderTop <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative w-full">
      {showSlider && (
        <>
          <div
            ref={sliderRef}
            className={`w-full transition-all duration-300 z-50 ${
              isSticky ? "fixed top-0 left-0 w-full" : "relative"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSlider(false)}
              className="absolute top-0 md:top-2 right-0 md:right-6 z-20 text-black bg-transparent hover:text-red-500 hover:bg-transparent"
            >
              ✖
            </button>

            {/* Swiper Slider */}
            <Swiper
              className="w-full h-full"
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              modules={[Autoplay]}
            >
              {/* Slide 1 */}
              <SwiperSlide>
                <div className="flex flex-col justify-center items-center h-full text-center p-6 bg-gray-300">
                  <p className="mt-2 text-lg md:text-xl">
                    Claim up to 5 Anons NFT on purchases above 40$, starting from March 31st, 10:00 am PST
                  </p>
                </div>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <div className="flex flex-col justify-center items-center h-full text-center p-6 bg-gray-300">
                  <p className="mt-2 text-lg md:text-xl">
                    10% off on Quosha store for all Turtlez NFT holders. Join the discord to claim your coupon code! 
                    <a href="https://discord.com/invite/Th9CE68GUU" target="_blank" rel="noopener noreferrer">
                      discord.gg/Th9CE68GUU
                    </a>.
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Spacer to push Nav down when sticky */}
          {isSticky && <div className="h-[70px] md:h-[53px]" />}
        </>
      )}

      {/* Navigation - will not be behind the slider anymore */}
      <Nav handleShow={handleShow} />
    </header>
  );
};

export default Header;
