import { useNavigate } from "react-router-dom";
import { RiUserLine, RiMenuLine, RiCloseLine } from "react-icons/ri";
import styles from "./index.module.scss";
import { navbarData } from "../../../../../data/navItems";
import CartIcon from "./CartIcon";
import { FormEvent, useEffect, useState, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import wishlistImg from "../../../../../images/Wishlist_Heart_Product_Catalogue.png";
import { IoMdSearch,IoIosWallet  } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { PiCube } from "react-icons/pi";
import { FaRegHeart } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { FaHandHoldingDroplet } from "react-icons/fa6";
import img1 from "../../../../../images/QuoshaLogo_Black.png";

interface NavBarProps {
  handleShow: () => void;
}

const Navbar: React.FC<NavBarProps> = ({ handleShow }) => {
  const [hasScrolled, setHasSrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [dropdownAnimation, setDropdownAnimation] = useState("");
  const [tokenPresent, setTokenPresent] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const navigate = useNavigate();

  const resizeHeaderOnScroll = () => {
    setHasSrolled((hasScrolled) => {
      if (
        !hasScrolled &&
        (document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20)
      ) {
        return true;
      }

      if (
        hasScrolled &&
        document.body.scrollTop < 4 &&
        document.documentElement.scrollTop < 4
      ) {
        return false;
      }

      return hasScrolled;
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", resizeHeaderOnScroll);

    return () => window.removeEventListener("scroll", resizeHeaderOnScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTokenPresent(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setTokenPresent(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    // Refresh every second
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      setTokenPresent(!!token);
    }, 1000);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      isDropdownVisible &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  const navStyles = hasScrolled
    ? `${styles.nav} ${styles.hasScrolled}`
    : styles.nav;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog/search?query=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible);
    setIsDropdownVisible(false);
  };

  const toggleDropdownVisibility = () => {
    if (isDropdownVisible) {
      setDropdownAnimation(styles.hideDropdown);
      setTimeout(() => {
        setIsDropdownVisible(false);
        setDropdownAnimation("");
      }, 300);
    } else {
      setIsDropdownVisible(true);
      setDropdownAnimation(styles.showDropdown);
    }
    setIsNavVisible(false);
  };

  const handleDropdownLinkClick = () => {
    setDropdownAnimation(styles.hideDropdown);
    setTimeout(() => {
      setIsDropdownVisible(false);
      setDropdownAnimation("");
    }, 300);
    setIsNavVisible(false);
  };

  const logout = () => {
    handleDropdownLinkClick();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("Name");
    localStorage.removeItem("cart");
    localStorage.removeItem("totalQuantity");
    window.location.reload();
    navigate("/");
  };

  return (
    <nav className={navStyles}>
      <div className={` ${styles.container_bottom}`}>
        <Link to="/" className={styles.title}>
          <img className="lg:w-60 md:w-48 w-40" src={img1} alt="Quosha" />
        </Link>
        <ul className={`${styles.links} ${isNavVisible ? styles.show : ""}`}>
          {navbarData.map((category) => (
            <div key={category.category} className={styles.dropdown1}>
              <button className={`${styles.dropbtn} ${styles.link}`}>
                {category.category}
              </button>
              <div className={styles.dropdowncontent}>
                {category.items.map((item) => (
                  <div key={item.id} className={styles.dropdownItem}>
                    <NavLink
                      to={
                        category.category === "Collections"
                          ? `/catalog/search?query=${item.to}`
                          : `/catalog/search?query=${category.category} ${item.to}`
                      }
                      onClick={handleDropdownLinkClick}
                      className="block p-3 text-gray-800 rounded-md"
                    >
                      {item.name}
                    </NavLink>
                    {/* <NavLink
                      key={subItem.id}
                      // to ={`/catalog/search?query=${item.to} ${subItem.to}`}
                      to={
                        category.category === "Collections"
                          ? `/catalog/search?query=${item.to} ${subItem.to}`
                          : `/catalog/search?query=${category.category} ${item.to} ${subItem.to}`
                      }
                      onClick={handleDropdownLinkClick}
                      className="block p-2 font-medium text-gray-500 hover:bg-white rounded-md ps-10"
                    >
                      {subItem.name}
                    </NavLink> */}

                    {/* Check for subItems */}
                    {item.subItems && item.subItems.length > 0 && (
                      <div className={styles.subDropdown}>
                        {item.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.id}
                            // to ={`/catalog/search?query=${item.to} ${subItem.to}`}
                            to={
                              category.category === "Collections"
                                ? `/catalog/search?query=${item.to} ${subItem.to}`
                                : `/catalog/search?query=${category.category} ${item.to} ${subItem.to}`
                            }
                            onClick={handleDropdownLinkClick}
                            className="block p-2 font-medium text-gray-500 hover:bg-white rounded-md ps-10"
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ul>
        <ul className={styles.icons_menu}>
          <li>
            <form className="hidden lg:block md:block" onSubmit={handleSearch}>
              <label
                htmlFor="default-search1"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  id="default-search1"
                  className="block w-96 p-3 ps-5 text-2xl font-semibold text-gray-900 border border-gray-300 rounded-full bg-gray-50"
                  required
                />
                <button
                  type="submit"
                  className="text-black absolute end-1 bottom-0.5 hover:bg-slate-200  bg-transparent font-medium rounded-full p-3"
                >
                  <IoMdSearch className="text-3xl" />
                </button>
              </div>
            </form>
          </li>
          <li>
            <div
              className={`hidden lg:block md:block ${styles.link}`}
              onClick={handleShow}
            >
              <CartIcon />
            </div>
          </li>
          {tokenPresent && (
            <li>
              <div onClick={toggleDropdownVisibility} className={styles.link}>
                <NavLink to={`/wishlist`} className={styles.link}>
                  <img
                    className="w-8 md:w-9"
                    src={wishlistImg}
                    alt="wishlist"
                  />
                </NavLink>
              </div>
            </li>
          )}
          <li ref={dropdownRef} className="relative">
            {!tokenPresent ? (
              <div className="">
                <NavLink to={`/login`} className={styles.link}>
                  <RiUserLine />
                </NavLink>
              </div>
            ) : (
              <div
                onClick={toggleDropdownVisibility}
                className={` ${styles.link}`}
              >
                <RiUserLine />
              </div>
            )}
            {isDropdownVisible && (
              <div
                className={`absolute z-[101] right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg ${dropdownAnimation}`}
              >
                <Link
                  to="/profile"
                  onClick={handleDropdownLinkClick}
                  className="block p-3 pb-0 text-gray-800 bg-white rounded-lg"
                >
                  <div className="rounded-md bg-[--main-color] w-full hover:bg-gray-200 text-2xl font-bold flex items-center p-3">
                    <CgProfile className="text-3xl me-3" />
                    <p>Profile</p>
                  </div>
                </Link>
                <Link
                  to="/order"
                  onClick={handleDropdownLinkClick}
                  className="block p-3 pb-0 text-gray-800 bg-white"
                >
                  <div className="rounded-md bg-[--main-color] w-full hover:bg-gray-200 text-2xl font-bold flex items-center p-3">
                    <PiCube className="text-3xl me-3" />
                    <p>Orders</p>
                  </div>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={handleDropdownLinkClick}
                  className="block p-3 pb-0 text-gray-800 bg-white"
                >
                  <div className="rounded-md bg-[--main-color] w-full hover:bg-gray-200 text-2xl font-bold flex items-center p-3">
                    <FaRegHeart className="text-3xl me-3" />
                    <p>Wishlist</p>
                  </div>
                </Link>
                <Link
                  to="/nft-drop"
                  onClick={handleDropdownLinkClick}
                  className="block p-3 pb-0 text-gray-800 bg-white"
                >
                  <div className="rounded-md bg-[--main-color] w-full hover:bg-gray-200 text-2xl font-bold flex items-center p-3">
                    <FaHandHoldingDroplet className="text-3xl me-3" />
                    <p>NFTs Drop</p>
                  </div>
                </Link>
                <Link
                  to="/wallet-checker"
                  onClick={handleDropdownLinkClick}
                  className="block p-3 pb-0 text-gray-800 bg-white"
                >
                  <div className="rounded-md bg-[--main-color] w-full hover:bg-gray-200 text-2xl font-bold flex items-center p-3">
                    <IoIosWallet className="text-3xl me-3" />
                    <p>Wallets Checker</p>
                  </div>
                </Link>
                <Link
                  to="/"
                  onClick={logout}
                  className="block p-3 text-gray-800 bg-white rounded-lg"
                >
                  <div className="rounded-md bg-[--main-color] w-full hover:bg-gray-200 text-2xl font-bold flex items-center p-3">
                    <TbLogout className="text-3xl me-3" />
                    <p>Logout</p>
                  </div>
                </Link>
              </div>
            )}
          </li>
          <div className={styles.mobile_icon} onClick={toggleNavVisibility}>
            {isNavVisible ? (
              <RiCloseLine size={27} />
            ) : (
              <RiMenuLine size={24} />
            )}
          </div>
        </ul>
      </div>
      <div className="flex gap-4 items-center pb-1">
        <form className="lg:hidden md:hidden block" onSubmit={handleSearch}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              id="default-search"
              className="block w-full p-4 text-sm font-bold text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 hover:bg-black bg-black font-medium rounded-lg text-sm px-4 py-2"
            >
              Search
            </button>
          </div>
        </form>
        <div
          className={`block lg:hidden md:hidden text-4xl`}
          onClick={handleShow}
        >
          <CartIcon />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
