import React, { useState } from "react";
import Nav from "./Nav";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay  } from "swiper/modules";

interface HeaderProps {
  handleShow: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleShow }: HeaderProps) => {
  const [showSlider, setShowSlider] = useState(true); 
  return (
    <header>
             {showSlider && (
              <div className="fixed w-full cursor-pointer z-50" >
                {/* Close Button */}
                <button
                  onClick={() => setShowSlider(false)}
                  className="absolute top-2 right-6 z-20 text-black bg-transparent hover:bg-transparent hover:text-red-500"
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
                    <div className="flex flex-col justify-center items-center h-full text-center p-6  bg-gray-300">
                      <p className="mt-2 text-lg md:text-xl">Claim up to 5 Anons NFT on purchases above 40$, starting from March 31st, 10:00 am PST
                      </p>
                    </div>
                  </SwiperSlide>
      
                  {/* Slide 2 */}
                  <SwiperSlide>
                    <div className="flex flex-col justify-center items-center h-full text-center p-6  bg-gray-300">
                      <p className="mt-2 text-lg md:text-xl"> 10 % off on Quosha store for all Turtlez NFT holders. Join the discord to claim your coupon code! <a href="https://discord.com/invite/Th9CE68GUU" target="_blank" rel="noopener noreferrer">discord.gg/Th9CE68GUU</a> .</p>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            )}
      <Nav handleShow={handleShow} />
    </header>
  );
};

export default Header;
