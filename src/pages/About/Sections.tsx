import React from "react";
import img1 from "../../images/about-img-1.webp";
import { FaAngleDown } from "react-icons/fa";

const handleScrollDown = () => {
  const scrollDistance = window.innerWidth < 450 ? 440 : 280;
  window.scrollBy({ top: scrollDistance, behavior: "smooth" });
};

const Exclusive: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row md:flex-row lg:gap-10 md:gap-10 gap-0 items-center justify-center lg:py-10 md:py-10 py-7 px-6 md:px-16 lg:px-16 lg:mb-2 md:mb-2 mb-1">
      <div className="py-5 lg:py-0 md:py-0 order-none lg:order-1 md:order-1">
        <img
          className="mx-auto lg:w-[300px] md:w-[260px] w-[220px]"
          src={img1}
          alt="quosha"
        />
      </div>
      <div className=" order-1 lg:order-none md:order-none">
        <div className="text-4xl font-[750] pb-3 text-gray-900 underline underline-offset-4 text-center lg:text-start md:text-start">Quosha Exclusive</div>
        <div className="lg:text-[16px] flex items-start md:text-2xl text-2xl text-center lg:text-start md:text-start font-semibold max-w-6xl leading-9">
          » Explore Quosha's exclusive collection, a harmonious blend of style
          and comfort. From the comfort of home to the bustling streets,
          Quosha's exclusive collection offers an unparalleled fusion of fashion
          and flair, ensuring every moment is adorned with effortless elegance
          and timeless style.
        </div>
        <div
          onClick={handleScrollDown}
          className="lg:text-xl md:text-xl text-lg mx-auto lg:mx-0 md:mx-0 font-semibold bg-black w-max flex items-center py-3 px-5 text-gray-100 rounded-full mt-4 cursor-pointer"
        >
          Scroll Down To See &nbsp;
          <span>
            <FaAngleDown />
          </span>
        </div>
      </div>
    </div>
  );
};

const Merch: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row md:flex-row lg:gap-10 md:gap-10 gap-0 items-center justify-center lg:py-10 md:py-10 py-7 px-6 md:px-16 lg:px-16 lg:mb-2 md:mb-2 mb-1">
      <div className="py-5 lg:py-0 md:py-0 order-none lg:order-1 md:order-1">
        <img
          className="mx-auto lg:w-[300px] md:w-[260px] w-[220px]"
          src={img1}
          alt="quosha"
        />
      </div>
      <div className=" order-1 lg:order-none md:order-none">
        <div className="text-4xl font-[750] pb-3 text-gray-900 underline underline-offset-4 text-center lg:text-start md:text-start">Merch 3.0</div>
        <div className="lg:text-[16px] md:text-2xl text-2xl text-center lg:text-start md:text-start font-semibold max-w-6xl leading-9">
          » Welcome to Merch 3.0, the ultimate destination for Web3.0 and crypto
          enthusiasts seeking fashion with a digital edge. Dive into our
          collection of t-shirts, hoodies, and hats, meticulously designed to
          reflect the spirit of the blockchain era.
        </div>
        <div className="pt-4 lg:text-[16px] md:text-2xl text-2xl text-center lg:text-start md:text-start font-semibold max-w-6xl leading-9">
          » Express your passion for decentralized technologies with our bold
          and vibrant designs, each one a nod to the innovative spirit of the
          crypto community. Wrap yourself in the comfort of our premium hoodies,
          perfect for those late-night coding sessions or blockchain meetups.
          Adorn your head with our stylish hats, featuring sleek designs that
          seamlessly blend technology and fashion.
        </div>
        <div
          onClick={handleScrollDown}
          className="lg:text-xl md:text-xl text-lg mx-auto lg:mx-0 md:mx-0 font-semibold bg-black w-max flex items-center py-3 px-5 text-gray-100 rounded-full mt-4 cursor-pointer"
        >
          Scroll Down To See &nbsp;
          <span>
            <FaAngleDown />
          </span>
        </div>
      </div>
    </div>
  );
};

const Anons: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row md:flex-row lg:gap-10 md:gap-10 gap-0 items-center justify-center lg:py-10 md:py-10 py-7 lg:px-16 md:px-16 px-6 lg:mb-2 md:mb-2 mb-1">
      <div className="py-5 lg:py-0 md:py-0 order-none lg:order-1 md:order-1">
        <img
          className="mx-auto lg:w-[300px] md:w-[260px] w-[220px]"
          src={img1}
          alt="quosha"
        />
      </div>
      <div className=" order-1 lg:order-none md:order-none">
        <div className="text-4xl font-[750] pb-3 text-gray-900 underline underline-offset-4 text-center lg:text-start md:text-start">Anons x Quosha</div>
        <div className="lg:text-[16px] md:text-2xl text-2xl text-center lg:text-start md:text-start font-semibold max-w-6xl leading-9">
          » Welcome to the Anons x Quosha Collection, exclusively crafted for
          our community members. This unique collaboration brings Anons'
          captivating NFT designs to life on Quosha's premium hoodies, t-shirts,
          and hats. Each piece features stunning digital art from the SEI
          blockchain, merging style with cutting-edge technology. Wear your
          passion for NFTs and blockchain innovation proudly with our apparel.
          Perfect for showcas
        </div>
        <div className="pt-4 lg:text-[16px] md:text-2xl text-2xl text-center lg:text-start md:text-start font-semibold max-w-6xl leading-9">
          » Join us in celebrating this groundbreaking fusion of creativity and
          community.
        </div>
        <div
          onClick={handleScrollDown}
          className="lg:text-xl md:text-xl text-lg mx-auto lg:mx-0 md:mx-0 font-semibold bg-black w-max flex items-center py-3 px-5 text-gray-100 rounded-full mt-4 cursor-pointer"
        >
          Scroll Down To See &nbsp;
          <span>
            <FaAngleDown />
          </span>
        </div>
      </div>
    </div>
  );
};

export { Exclusive, Merch, Anons };
