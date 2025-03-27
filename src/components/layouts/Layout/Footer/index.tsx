import {  useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { MdEmail } from "react-icons/md";
import { FaInstagram, FaTwitterSquare } from "react-icons/fa";
import styles from "./index.module.scss";
import img1 from "../../../../images/QuoshaLogo_Black.png";
import { Link } from "react-router-dom";
import { IoLogoDiscord } from "react-icons/io5";

const Footer = () => {
  const location = useLocation();

  const isBigScreen = useMediaQuery({
    query: "(min-width: 1024px)",
  });

  const isCollectionPage = location.pathname.includes("collections");

  return (
    <footer
      className={`${styles.footer} ${
        isCollectionPage && isBigScreen
          ? styles.is_collection_page_b
          : styles.is_collection_page_s
      }`}
    >
      <div className="lg:px-20 md:px-16 px-6 py-10 md:py-16 lg:py-0">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
          <div>
            <div><img className="w-56" src={img1} alt="Quosha" /></div>
            <div className="pt-10 text-2xl font-semibold"><Link to={"/order"}>Track Order</Link></div>
            <div className=" pt-2 text-2xl font-semibold">Returns & Refund</div>
            <div className=" pt-2 text-2xl font-semibold">Warranty</div>
          </div>
          <div>
            <div className="pb-8 text-3xl font-extrabold">Quosha Story</div>
            <div className="pb-2"><Link to="/about-us" className="text-2xl font-semibold">About Us</Link></div>
            <div className="pb-2"><Link to="/contact-us" className="text-2xl font-semibold">Contact Us</Link></div>
            {/* <div className="pb-2 text-2xl font-semibold">Work With Us</div> */}
            {/* <div className="pb-2 text-2xl font-semibold">Corporate News</div> */}
          </div>
          <div>
            <div className="pb-8 text-3xl font-extrabold">Useful Links</div>
            {/* <div className="pb-2 text-2xl font-semibold">Archived Products</div> */}
            <div className="pb-2"><Link to="/privacy-policy" className=" text-2xl font-semibold">Privacy Policy</Link></div>
            <div className="pb-2"><Link to="/terms-and-conditions" className=" text-2xl font-semibold">Terms of Use</Link></div>
            <div className="pb-2"><Link to="/wallet-checker" className=" text-2xl font-semibold">Wallet Checker</Link></div>
            {/* <div className="pb-2 text-2xl font-semibold">Archived Products</div> */}
          </div>
          <div>
            <div className="pb-8 text-3xl font-extrabold">Contact Info</div>
            <div className="flex items-center gap-5">
              <div className="border p-4 border-black rounded-full"><MdEmail className="text-3xl" /></div>
              <div>
                <p className="text-2xl font-extrabold">Email Us At:</p>
                <p className="text-2xl font-semibold">info@quoshaink.com</p>
                <p className="text-2xl font-semibold">quolabs@quoshaink.com</p>
              </div>
            </div>
            <div className="lg:ps- mt-5">
              {/* <div className="border p-5 border-black rounded-full"><IoCall className="text-3xl" /></div>
              <div>
                <p className="text-2xl font-extrabold">Social:</p>
                <p className="text-2xl font-semibold">+880171889547</p>
              </div> */}
              <div className="text-3xl font-extrabold pb-3">Social:</div>
              <div className="flex gap-5 items-center "><FaInstagram className="text-3xl" /><FaTwitterSquare className="text-3xl" /><a href="https://discord.com/invite/Th9CE68GUU"><IoLogoDiscord  className="text-3xl" /></a></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
