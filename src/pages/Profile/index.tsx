import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { PiCube } from "react-icons/pi";
import { FaHandHoldingDroplet, FaRegHeart } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { VscCircleFilled } from "react-icons/vsc";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { AppDispatch, RootState } from "../../app/store";
import { getUser, updateUser } from "../../features/auth/authSlice";
import { fetchCountries } from "../../features/order/orderSlice";
import { useAppSelector } from "../../app/hooks";
import { SiGmail } from "react-icons/si";
import { FaUser, FaPhone, FaMapPin } from "react-icons/fa6";
import { LiaCitySolid } from "react-icons/lia";
import { TbMapPinCode } from "react-icons/tb";
import { PiCodesandboxLogoFill } from "react-icons/pi";
import { MdOutlineStreetview } from "react-icons/md";
import { IoHomeSharp,IoCodeSlashSharp } from "react-icons/io5";
import { FaTransgender } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";



type State = {
  name: string;
  code: string;
};

const ProfilePage: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    gender: "",
    email: "",
    phonenumber: "",
    address1: "",
    address2: "",
    city: "",
    state_name: "",
    state_code: "",
    country_code: "",
    country_name: "",
    zip: "",
    id: ""
  });
  const dispatch: AppDispatch = useDispatch();
  const countries = useAppSelector((state: RootState) => state.order.countries);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      navigate("/login")
    }
     else if (userId) {
      dispatch(getUser(userId));
    }
    dispatch(fetchCountries());
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setUserDetails({
        id: user.id || '',
        name: user.name || '',
        gender: user.gender || '',
        email: user.email || '',
        phonenumber: user.phonenumber || '',
        address1: user.Address?.[0]?.address1 || '',
        address2: user.Address?.[0]?.address2 || '',
        city: user.Address?.[0]?.city || '',
        state_name: user.Address?.[0]?.state_name || '',
        state_code: user.Address?.[0]?.state_code || '',
        country_name: user.Address?.[0]?.country_name || '',
        country_code: user.Address?.[0]?.country_code || '',
        zip: user.Address?.[0]?.zip || ''
      });
    }
  }, [user]);

  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  const handleSaveClick = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    dispatch(updateUser({ userDetails, userId })).then((response: any) => {
      if (response.meta.requestStatus === "fulfilled") {
        setLoading(false);
        if (userId) {
          dispatch(getUser(userId));
          setIsPopupOpen(false);
        }
      }
    });
  };

  const handleCancelClick = () => {
    setIsPopupOpen(false);
  };

  const handleClearClick = () => {
    setUserDetails(prevDetails => ({
      ...prevDetails, 
      address1: "",
      address2: "",
      city: "",
      state_name: "",
      state_code: "",
      country_code: "",
      country_name: "",
      zip: "",
    }));
  };
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Prevent numbers in "name" field
    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) {
      return; // Stop execution if input contains anything other than letters/spaces
    }
  
    // Prevent letters in "phonenumber" field
    if (name === "phonenumber" && !/^\d*$/.test(value)) {
      return; // Stop execution if input contains anything other than numbers
    }
  
    // Update state only if input is valid
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };   

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(country => country.name === event.target.value);
    setUserDetails({ ...userDetails, country_name: event.target.value, country_code: selectedCountry?.code || '',  state_name: '', state_code: '' });
    setStates(selectedCountry?.states || []);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = states.find(state => state.name === event.target.value);
    setUserDetails({ 
      ...userDetails,
      state_name: event.target.value, 
      state_code: selectedState?.code || '' 
    });
  };


  return (
    <div className="pt-20 py-16 px-4">
      <div className="lg:px-32 md:px-24 px-0">
        <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1 gap-7">
          <div>
            <div className="bg-white p-5 h-max rounded-lg">
              <div className="flex items-center">
                <div className="">
                  <img
                    className="w-20 rounded-full"
                    src="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                    alt="User Profile"
                  />
                </div>
                <div className="ps-5">
                  <p className="text-xl font-bold">Hello,</p>
                  <p className="font-extrabold">
                    {userDetails.name || "Loading..."}
                  </p>
                </div>
              </div>
              <div className="mt-7 border rounded-md p-5">
                <Link
                  to="/profile"
                  className="bg-[--main-color] border p-3 rounded-md flex items-center"
                >
                  <CgProfile className="text-4xl me-3" />
                  <div className="font-bold text-2xl">Profile</div>
                </Link>
                <Link
                  to="/order"
                  className="bg-[--main-color] border p-3 mt-3 rounded-md flex items-center"
                >
                  <PiCube className="text-4xl me-3" />
                  <div className="font-bold text-2xl">Order</div>
                </Link>
                <Link
                  to="/wishlist"
                  className="bg-[--main-color] border p-3 mt-3 rounded-md flex items-center"
                >
                  <FaRegHeart className="text-4xl me-3" />
                  <div className="font-bold text-2xl">Wishlist</div>
                </Link>
                <Link
                  to="/nft-drop"
                  className="bg-[--main-color] border p-3 mt-3 rounded-md flex items-center"
                >
                  <FaHandHoldingDroplet  className="text-4xl me-3" />
                  <div className="font-bold text-2xl">NFTs Drop</div>
                </Link>
                <Link
                  to="/wallet-checker"
                  className="bg-[--main-color] border p-3 mt-3 rounded-md flex items-center"
                >
                  <IoIosWallet  className="text-4xl me-3" />
                  <div className="font-bold text-2xl">Wallets Checker</div>
                </Link>
                <Link
                  to="/"
                  className="bg-[--main-color] border p-3 mt-3 rounded-md flex items-center"
                >
                  <TbLogout className="text-4xl me-3" />
                  <div className="font-bold text-2xl">Logout</div>
                </Link>
              </div>
            </div>
            <div className="bg-white mt-7 p-5 h-max rounded-lg hidden lg:block md:block ">
              <div className="font-bold text-xl pb-4">Legal</div>
              <div>
                <Link
                  to="/terms"
                  className="bg-[--main-color] border p-3 mt-3 rounded-md flex items-center"
                >
                  <div className="font-bold text-2xl">Terms of Use</div>
                </Link>
              </div>
              <div>
                <Link
                  to="/privacy-policy"
                  className="bg-[--main-color] border p-3 mt-3 rounded-md flex items-center"
                >
                  <div className="font-bold text-2xl">Privacy Policy</div>
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 md:col-span-3 bg-white rounded-lg lg:p-10 md:p-10 p-5">
            <div className="font-bold text-xl pb-6">EDIT PROFILE</div>
            <div className="border ">
              <div className="lg:p-10 md:p-10 p-5 border-b">
                <p className="font-bold text-xl pb-1">Email Id:</p>
                <p className="border bg-[--main-color] text-2xl w-max font-semibold rounded-lg p-3">
                  {userDetails.email ? userDetails.email : <div className="text-gray-300">Add Email</div>}
                </p>
              </div>
              <div className="lg:p-10 md:p-5 p-5">
                <p className="border-b pb-7 font-bold text-2xl">
                  General Information:
                </p>
                <div className="grid lg:grid-cols-5 grid-cols-1 lg:py-16 md:py-16 py-7 lg:px-5 md:px-5 px-2">
                  <div className="lg:border-e lg:pe-10 col-span-2">
                    <div className="lg:pb-10 md:pb-10 pb-6">
                      <p className="font-bold text-xl pb-1">User Name:</p>
                      <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                        {userDetails.name ? userDetails.name : <div className="text-gray-300">Add Name</div>}
                      </p>
                    </div>
                    <div className="lg:pb-10 md:pb-10 pb-6">
                      <p className="font-bold text-xl pb-1">Gender:</p>
                      <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5 flex items-center">
                        <MdOutlineRadioButtonChecked className="me-1" />
                        {userDetails.gender ? userDetails.gender : <div className="text-gray-300">Add Gender</div>}
                      </p>
                    </div>
                    <div className="lg:pb-10 md:pb-10 pb-6">
                      <p className="font-bold text-xl pb-1">Phone Number:</p>
                      <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                        {userDetails.phonenumber ? userDetails.phonenumber : <div className="text-gray-300">Add Number</div>}
                      </p>
                    </div>
                  </div>
                  <div className="lg:ps-10 col-span-3">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 lg:gap-10 md:gap-10 gap-6">
                      <div>
                        <p className="font-bold text-xl pb-1">
                          Address Line 1:
                        </p>
                        <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                          {userDetails.address1 ? userDetails.address1 : <div className="text-gray-300">Add Address Line 1</div>}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-xl pb-1">
                          Address Line 2:
                        </p>
                        <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                          {userDetails.address2 ? userDetails.address2 : <div className="text-gray-300">Add Address Line 2</div>}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-xl pb-1">City:</p>
                        <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                          {userDetails.city  ? userDetails.city : <div className="text-gray-300">Add City</div>}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-xl pb-1">State Code:</p>
                        <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                          {userDetails.state_code ? userDetails.state_code : <div className="text-gray-300">Add State Code</div>}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-xl pb-1">State:</p>
                        <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                          {userDetails.state_name ? userDetails.state_name : <div className="text-gray-300">Add State Name</div>}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-xl pb-1">Country Code:</p>
                        <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                          {userDetails.country_code ? userDetails.country_code : <div className="text-gray-300">Add Country Code</div>}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-xl pb-1">Country:</p>
                        <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                          {userDetails.country_name ? userDetails.country_name : <div className="text-gray-300">Add Country Name</div>}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-xl pb-1">Zip Code:</p>
                        <p className="border bg-[--main-color] text-2xl font-semibold rounded-lg p-3 px-5">
                          {userDetails.zip ? userDetails.zip : <div className="text-gray-300">Add ZIP</div>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center border-t">
                  <button
                    className="bg-black text-white font-semibold text-xl rounded-md py-3 px-16 mt-10 hover:bg-white hover:text-black outline"
                    onClick={handleEditClick}
                  >
                    EDIT
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-10">
              <div className="text-3xl font-extrabold">FAQs</div>
              <div className="pt-6">
                <p className="text-2xl font-extrabold pb-2 flex items-center">
                  <VscCircleFilled className="me-1" />
                  What happens when I update my email address (or mobile
                  number)?
                </p>
                <p className="text-2xl font-semibold">
                  Your login email id (or mobile number) changes, likewise.
                  You'll receive all your account related communication on your
                  updated email address (or mobile number).
                </p>
              </div>
              <div className="pt-6">
                <p className="text-2xl font-extrabold pb-2 flex items-center">
                  <VscCircleFilled className="me-1" />
                  What happens to my existing e-commerce account when I update
                  my email address (or mobile number)?
                </p>
                <p className="text-2xl font-semibold">
                  Updating your email address (or mobile number) doesn't
                  invalidate your account. Your account remains fully
                  functional. You'll continue seeing your Order history, saved
                  information and personal details.
                </p>
              </div>
              <div className="pt-6">
                <p className="text-2xl font-extrabold pb-2 flex items-center">
                  <VscCircleFilled className="me-1" />
                  Does my Seller account get affected when I update my email
                  address?
                </p>
                <p className="text-2xl font-semibold">
                  Flipkart has a 'single sign-on' policy. Any changes will
                  reflect in your Seller account also.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-start lg:items-center md:items-start py-10 justify-center bg-black bg-opacity-50 px-5 overflow-y-auto z-[103]">
          <div className="bg-white p-8 w-full max-w-6xl rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-grow text-center text-2xl font-bold">Update Address</div>
            {/* <div className="text-3xl font-bold cursor-pointer">x</div> */}
            <button 
            onClick={handleCancelClick} 
            className="text-3xl font-bold text-gray-600 hover:text-red-600 bg-white py-2  px-5 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
          >
            ×
          </button>
          </div>
            <form onSubmit={handleSaveClick}>
              <div className="lg:mb-7 md:mb-7 mb-5 relative">
                <label
                  className="block text-gray-700 text-xl font-extrabold"
                  htmlFor="name"
                >
                  Name:
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                  <span className="text-gray-500 sm:text-sm">
                    <FaUser className="text-xl" />
                  </span>
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  required
                  value={userDetails.name}
                  onChange={handleChange}
                  className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="lg:mb-7 md:mb-7 mb-5 relative">
                <label
                  className="block text-gray-700 text-xl font-extrabold"
                  htmlFor="gender"
                >
                  Gender:
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                  <span className="text-gray-500 sm:text-sm">
                    <FaTransgender className="text-xl" />
                  </span>
                </div>
                <select
                  name="gender"
                  required
                  value={userDetails.gender}
                  onChange={handleChange}
                  className="shadow ps-12 appearance-none border rounded w-full font-semibold py-[8.4px] px-3 text-xl text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" className="font-bold text-2xl">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="lg:mb-7 md:mb-7 mb-5 relative">
                <label
                  className="block text-gray-700 text-xl font-extrabold"
                  htmlFor="email"
                >
                  Email:
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                  <span className="text-gray-500 sm:text-sm">
                    <SiGmail className="text-xl" />
                  </span>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  required
                  value={userDetails.email}
                  onChange={handleChange}
                  readOnly
                  className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="lg:mb-7 md:mb-7 mb-5 relative">
                <label
                  className="block text-gray-700 text-xl font-extrabold"
                  htmlFor="phone"
                >
                  Phone:
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                  <span className="text-gray-500 sm:text-sm">
                    <FaPhone className="text-xl" />
                  </span>
                </div>
                <input
                  type="tel"
                  name="phonenumber"
                  placeholder="Phone Number"
                  required
                  value={userDetails.phonenumber}
                  onChange={handleChange}
                  className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-7 md:gap-7 gap-7">
                  <div className="relative">
                    <label
                      className="block text-gray-700 text-xl font-extrabold"
                      htmlFor="address"
                    >
                      Address Line 1:
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                      <span className="text-gray-500 sm:text-sm">
                        <IoHomeSharp className="text-xl" />
                      </span>
                    </div>
                    <input
                      type="text"
                      name="address1"
                      placeholder="Address 1"
                      required
                      value={userDetails.address1}
                      onChange={handleChange}
                      className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-700 text-xl font-extrabold"
                      htmlFor="address"
                    >
                      Address Line 2:
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                      <span className="text-gray-500 sm:text-sm">
                        <MdOutlineStreetview className="text-xl" />
                      </span>
                    </div>
                    <input
                      type="text"
                      name="address2"
                      // required
                      value={userDetails.address2}
                      onChange={handleChange}
                      placeholder="Address 2"
                      className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <div className="text-red-500 font-semibold text-sm end-0 pe-2 absolute">*(optional)</div>
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-700 text-xl font-extrabold"
                      htmlFor="address"
                    >
                      City:
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                      <span className="text-gray-500 sm:text-sm">
                        <LiaCitySolid className="text-xl" />
                      </span>
                    </div>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter City"
                      required
                      value={userDetails.city}
                      onChange={handleChange}
                      className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-700 text-xl font-extrabold pb-2"
                      htmlFor="address"
                    >
                      Country:
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                      <span className="text-gray-500 sm:text-sm">
                        <TbMapPinCode className="text-xl" />
                      </span>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center pt-8 pl-4">
                      <span className="text-gray-500 sm:text-sm">
                        <MdArrowDropDown className="text-4xl" />
                      </span>
                    </div>
                    <select
                      name="country_name"
                      required
                      value={userDetails.country_name}
                      onChange={handleCountryChange}
                      className="shadow ps-12 appearance-none border rounded w-full font-semibold py-[8.4px] px-3 text-xl text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" className="font-bold text-2xl">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-700 text-xl font-extrabold"
                      htmlFor="address"
                    >
                      Country Code:
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                      <span className="text-gray-500 sm:text-sm">
                        <IoCodeSlashSharp className="text-xl" />
                      </span>
                    </div>
                    <input
                      type="text"
                      name="country_code"
                      placeholder="Enter Country Code"
                      required
                      disabled
                      value={userDetails.country_code}
                      onChange={handleChange}
                      className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="relative">
                    {states.length > 0 ? (
                      <>
                        <label className="block text-gray-700 text-xl pb-2 font-extrabold" htmlFor="state">
                          State:
                        </label>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                          <span className="text-gray-500 sm:text-sm">
                            <TbMapPinCode className="text-xl" />
                          </span>
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center pt-8 pl-4">
                          <span className="text-gray-500 sm:text-sm">
                            <MdArrowDropDown className="text-4xl" />
                          </span>
                        </div>
                        <select
                          name="state_name"
                          required
                          value={userDetails.state_name}
                          onChange={handleStateChange}
                          className="shadow ps-12 appearance-none border rounded w-full font-semibold py-[8.4px] px-3 text-xl text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="" className="font-bold text-2xl">Select State</option>
                          {states.map((state) => (
                            <option key={state.code} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </>
                    ): <div className="relative">
                      <label
                      className="block text-gray-700 text-xl font-extrabold"
                      htmlFor="address"
                    >
                      State:
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                      <span className="text-gray-500 sm:text-sm">
                        <TbMapPinCode className="text-xl" />
                      </span>
                    </div>
                    <input
                      type="text"
                      name="state_name"
                      placeholder="Enter State Name"
                      required
                      value={userDetails.state_name}
                      onChange={handleChange}
                      className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                      </div>} 
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-700 text-xl font-extrabold"
                      htmlFor="address"
                    >
                      State Code:
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                      <span className="text-gray-500 sm:text-sm">
                        <PiCodesandboxLogoFill className="text-xl" />
                      </span>
                    </div>
                    <input
                      type="text"
                      name="state_code"
                      placeholder="Enter State Code"
                      required
                      value={userDetails.state_code}
                      onChange={handleChange}
                      className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-700 text-xl font-extrabold"
                      htmlFor="address"
                    >
                      Zip Code:
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pt-8 pl-4">
                      <span className="text-gray-500 sm:text-sm">
                        <FaMapPin className="text-xl" />
                      </span>
                    </div>
                    <input
                      type="text"
                      name="zip"
                      placeholder="Enter ZIP"
                      required
                      value={userDetails.zip}
                      onChange={handleChange}
                      className="shadow ps-12 appearance-none border rounded w-full font-bold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
              <div className="flex items-center pt-10 justify-between">
                
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold text-2xl py-3 px-7 rounded focus:outline-none focus:shadow-outline"
                  type="reset"
                  onClick={handleClearClick}
                >
                  Clear
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold text-2xl py-3 px-7 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
