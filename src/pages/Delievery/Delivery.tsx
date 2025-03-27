import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CartItem } from "../../types/cart";
import { AppDispatch, RootState } from "../../app/store";
import { getUser } from "../../features/auth/authSlice";
import { setSelectedAddress } from "../../features/delivery/deliverySlice";
import { SiGmail } from "react-icons/si";
import { FaUser, FaPhone, FaMapPin } from "react-icons/fa6";
import { LiaCitySolid } from "react-icons/lia";
import { TbMapPinCode } from "react-icons/tb";
import { PiCodesandboxLogoFill } from "react-icons/pi";
import { MdOutlineStreetview } from "react-icons/md";
import { IoHomeSharp, IoCodeSlashSharp } from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import {
  fetchCountries,
  fetchShippingRates,
  fetchTaxRates,
} from "../../features/order/orderSlice";
import { Address } from "../../types/address";
import Button from "../../components/components/Button";
import salesTaxData from "../../../salesTax.json";

const Delivery: React.FC = () => {
  interface ShippingRate {
    minDeliveryDate: string;
    maxDeliveryDate: string;
    rate: string;
  }

  interface TaxRate {
    rate: string;
  }

  type State = {
    name: string;
    code: string;
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { cartItems } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const countries = useAppSelector((state: RootState) => state.order.countries);
  const [states, setStates] = useState<State[]>([]);
  const discountedAmount = useAppSelector(
    (state) => state.coupons.discountedAmount
  );
  const dispatch: AppDispatch = useAppDispatch();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRate | null>(null);
  const [loding, setLoding] = useState(false);
  const [userDetails, setUserDetails] = useState<Address>({
    name: "",
    phonenumber: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state_name: "",
    country_name: "",
    state_code: "",
    country_code: "",
    zip: "",
    name2: "",
    phonenumber2: "",
    email2: "",
    address12: "",
    address22: "",
    city2: "",
    state_name2: "",
    country_name2: "",
    state_code2: "",
    country_code2: "",
    zip2: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [otherAddresses, setOtherAddresses] = useState<Address[]>([]);
  const [userDetails2, setUserDetails2] = useState<Address>({
    name: "",
    phonenumber: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state_name: "",
    country_name: "",
    state_code: "",
    country_code: "",
    zip: "",
    name2: "",
    phonenumber2: "",
    email2: "",
    address12: "",
    address22: "",
    city2: "",
    state_name2: "",
    country_name2: "",
    state_code2: "",
    country_code2: "",
    zip2: "",
  });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >();

  const handleEditClick = () => {
    setIsPopupOpen(true);
    setIsEditing(false);
    setEditIndex(null);
    setUserDetails2({
      name: "",
      phonenumber: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      state_name: "",
      country_name: "",
      state_code: "",
      country_code: "",
      zip: "",
      name2: "",
      phonenumber2: "",
      email2: "",
      address12: "",
      address22: "",
      city2: "",
      state_name2: "",
      country_name2: "",
      state_code2: "",
      country_code2: "",
      zip2: "",
    });
  };

  const handleCancelClick = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      navigate("/login");
    } else if (userId) {
      dispatch(getUser(userId));
    }
    dispatch(fetchCountries());
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setUserDetails({
        name: user.name || "",
        phonenumber: user.phonenumber || "",
        email: user.email || "",
        address1: user.Address?.[0]?.address1 || "",
        address2: user.Address?.[0]?.address2 || "",
        city: user.Address?.[0]?.city || "",
        state_name: user.Address?.[0]?.state_name || "",
        country_name: user.Address?.[0]?.country_name || "",
        state_code: user.Address?.[0]?.state_code || "",
        country_code: user.Address?.[0]?.country_code || "",
        zip: user.Address?.[0]?.zip || "",
      });
    }

    const storedAddresses = localStorage.getItem("otherAddresses");
    if (storedAddresses) {
      setOtherAddresses(JSON.parse(storedAddresses));
    }

    const storedSelectedAddressIndex = localStorage.getItem(
      "selectedAddressIndex"
    );
    if (storedSelectedAddressIndex !== null) {
      setSelectedAddressIndex(parseInt(storedSelectedAddressIndex));
    }
  }, [user]);

  const handleEditAddress = (index: number) => {
    const address = otherAddresses[index];
    setUserDetails2(address);
    setIsPopupOpen(true);
    setIsEditing(true);
    setEditIndex(index);
  };

  const fetchShippingRatesForSelectedAddress = async (address: any) => {
    setLoding(true);
    const recipient = {
      country_code: address.country_code2 || userDetails.country_code,
      state_code: address.state_code2 || userDetails.state_code,
      zip: address.zip2 || userDetails.zip,
    };
    const items = cartItems.map((item) => ({
      variant_id: item.product.variant_id,
      quantity: item.quantity,
    }));
    const currency = "CA";
    // console.log("hy",items)
    try {
      const result = await dispatch(
        fetchShippingRates({ recipient, items, currency })
      );
      if (fetchShippingRates.fulfilled.match(result)) {
        setShippingRates(result.payload);
        setLoding(false);
      }
    } catch (error) {
      console.error("Failed to fetch shipping rates:", error);
    } finally {
      setLoding(false);
    }
  };

  const fetchTaxRatesForSelectedAddress = async (address: any) => {
    setLoding(true);
    const recipient = {
      country_code: address.country_code2 || userDetails.country_code,
      state_code: address.state_code2 || userDetails.state_code,
      zip: address.zip2 || userDetails.zip,
    };

    const recipientJson = {
      country_name: address.country_name2 || userDetails.country_name,
      state_name: address.state_name2 || userDetails.state_name,
      zip: address.zip2 || userDetails.zip,
    };
  

    const countryData = salesTaxData.countries.find(
      (country) => country.name.toLowerCase() === recipientJson.country_name.toLowerCase()
    );
  
    if (countryData) {
      const foundTax = countryData.states.find(
        (state) => state.state.toLowerCase() === recipientJson.state_name.toLowerCase()
      );
  
      if (foundTax) {
        const taxRateValue = parseFloat(foundTax.combined_rate.replace("%", "")) / 100;
        setTaxRates({ rate: taxRateValue.toString() }); 
        setLoding(false);
        return;
      }
    }
    
    try {
      const result = await dispatch(fetchTaxRates({ recipient }));
      if (fetchTaxRates.fulfilled.match(result)) {
        setTaxRates(result.payload);
        setLoding(false);
      }
    } catch (error) {
      console.error("Failed to fetch shipping rates:", error);
    } finally {
      setLoding(false);
    }
  };

  const handleRadioChange = (index: number | null) => {
    setSelectedAddressIndex(index);
    if (index === null) {
      // console.log("Default Address Selected:", userDetails);
      dispatch(setSelectedAddress(userDetails as Address));
      fetchShippingRatesForSelectedAddress(userDetails);
      fetchTaxRatesForSelectedAddress(userDetails);
    } else {
      // console.log("Other Address Selected:", otherAddresses[index]);
      dispatch(setSelectedAddress(otherAddresses[index]));
      fetchShippingRatesForSelectedAddress(otherAddresses[index]);
      fetchTaxRatesForSelectedAddress(otherAddresses[index]);
    }
  };

  const handleClearClick = () => {
    setUserDetails2({
      name: userDetails2.name,  // Keep name if needed
      phonenumber: userDetails2.phonenumber,
      email: userDetails2.email,
      address1: "",
      address2: "",
      city: "",
      state_name: "",
      country_name: "",
      state_code: "",
      country_code: "",
      zip: "",
      name2: "",
      phonenumber2: "",
      email2: "",
      address12: "",
      address22: "",
      city2: "",
      state_name2: "",
      country_name2: "",
      state_code2: "",
      country_code2: "",
      zip2: "",
    });
  };
   

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const minDeliveryDate = shippingRates?.[0]?.minDeliveryDate ?? null;
  const maxDeliveryDate = shippingRates?.[0]?.maxDeliveryDate ?? null;
  
  console.log("minDeliveryDate", minDeliveryDate)
  console.log("maxDeliveryDate", maxDeliveryDate)

  // const calculateTotalPrice = (
  //   subTotalPrice: number,
  //   shippingRate: number,
  //   taxRate: number
  // ) => {
  //   return (
  //     subTotalPrice -
  //     discount +
  //     (shippingRate || 0) +
  //     (taxRate * subTotalPrice || 0)
  //   );
  // };

  const calculateTotalPrice = (
    subTotalPrice: number,
    shippingRate: number,
    taxRate: number
  ) => {
    const taxAmount = parseFloat((subTotalPrice * taxRate).toFixed(2));
    const roundedShipping = parseFloat(shippingRate.toFixed(2));
  
    return subTotalPrice - discount + roundedShipping + taxAmount;
  };

  const shippingRate = shippingRates?.[0]?.rate
    ? parseFloat(shippingRates[0].rate)
    : 0;

  const taxRate = taxRates ? parseFloat(taxRates.rate) : 0;

  const subTotalPrice = cartItems.reduce(
    (a, c) => a + c.quantity * c.product.price,
    0
  );

  const discount = discountedAmount;

  // Ensure shippingRate and taxRate are treated as numbers
  const lastPrice = calculateTotalPrice(
    parseFloat(subTotalPrice.toString()),
    parseFloat(shippingRate.toString()),  
    parseFloat(taxRate.toString())       
  ).toFixed(2);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addresses = [...otherAddresses];

    if (isEditing && editIndex !== null) {
      addresses[editIndex] = userDetails2;
      fetchShippingRatesForSelectedAddress(userDetails2);
      fetchTaxRatesForSelectedAddress(userDetails2);
    } else {
      addresses.push(userDetails2);
    }

    setOtherAddresses(addresses);
    localStorage.setItem("otherAddresses", JSON.stringify(addresses));
    setIsPopupOpen(false);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(
      (country) => country.name === event.target.value
    );
    setUserDetails2({
      ...userDetails2,
      country_name2: event.target.value,
      country_code2: selectedCountry?.code || "",
      state_name2: "",
      state_code2: "",
    });
    setStates(selectedCountry?.states || []);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = states.find(
      (state) => state.name === event.target.value
    );
    setUserDetails2({
      ...userDetails2,
      state_name2: event.target.value,
      state_code2: selectedState?.code || "",
    });
  };

  if (loding) {
    return (
      <div className="fixed inset-0 p-5 bg-black bg-opacity-40 flex justify-center items-center z-[99]">
        <div className="lg:text-3xl md:text-2xl text-xl font-bold uppercase text-white text-opacity-80">
          Please Wait....
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 py-16 px-4 lg:px-52 md:px-28">
      <div className="flex items-center justify-center gap-4  lg:text-2xl md:text-2xl text-xl font-semibold pb-10 border-b-2 border-[#adadad]">
        <Link to="/cart" className="uppercase">
          Bag
        </Link>
        ---------
        <div className="uppercase font-extrabold">Address</div>---------
        <div className="uppercase">Payment</div>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 lg:p-10 md:p-10 p-5">
        <div className="lg:col-span-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <div className="font-extrabold text-2xl">
              Select Delivery Address
            </div>
            <div
              onClick={handleEditClick}
              className="text-xl font-bold px-8 py-3 border bg-gray-50 rounded border-black hover:cursor-pointer"
            >
              Add New Address
            </div>
          </div>
          <div className="text-xl font-bold pt-5">Default Address</div>
          {userDetails.city && userDetails.zip ? (
            <div className="flex gap-5 border p-10 bg-gray-50 shadow">
              <div>
                <input
                  type="radio"
                  checked={selectedAddressIndex === null}
                  onChange={() => handleRadioChange(null)}
                />
              </div>
              <div>
                <p className="text-2xl font-extrabold pb-3">
                  {userDetails.name} - {userDetails.phonenumber}
                </p>
                <p className="text-xl font-bold pb-1">
                  {userDetails.address1}, {userDetails.address2},{" "}
                  {userDetails.city}
                </p>
                <p className="text-xl font-bold pb-3">
                  {userDetails.state_code}, {userDetails.state_name},{" "}
                  {userDetails.country_code}, {userDetails.country_name} -{" "}
                  {userDetails.zip}
                </p>
                <p className="text-xl font-bold">
                  E-mail:{" "}
                  <span className="font-extrabold">{userDetails.email}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="border shadow p-10 bg-gray-50 text-center font-bold">
              Default Address Not Added
            </div>
          )}

          <div className="text-xl font-bold pt-5">Other Address</div>
          {otherAddresses.length === 0 ? (
            <p className="text-xl font-bold text-center bg-gray-50 p-10 border mb-10 shadow">
              No other addresses found
            </p>
          ) : (
            otherAddresses.map((address, index) => (
              <div
                key={index}
                className="lg:flex md:flex justify-between border p-10 mb-10 bg-gray-50 shadow"
              >
                <div className="flex gap-5">
                  <div>
                    <input
                      type="radio"
                      className=""
                      checked={selectedAddressIndex === index}
                      onChange={() => handleRadioChange(index)}
                    />
                  </div>
                  <div className="">
                    <p className="text-2xl font-extrabold pb-3">
                      {address.name2} - {address.phonenumber2}
                    </p>
                    <p className="text-xl font-bold pb-1">
                      {address.address12}, {address.address22}, {address.city2}
                    </p>
                    <p className="text-xl font-bold pb-3">
                      {address.state_code2}, {address.state_name2},{" "}
                      {address.country_code2}, {address.country_name2} -{" "}
                      {address.zip2}
                    </p>
                    <p className="text-xl font-bold">
                      E-mail:{" "}
                      <span className="font-extrabold">{address.email2}</span>
                    </p>
                  </div>
                </div>
                <div
                  onClick={() => handleEditAddress(index)}
                  className="border border-black h-max text-xl bg-[--main-color] hover:cursor-pointer font-bold px-8 py-3 mt-5 md:mt-0 lg:mt-0 text-center w-max lg:mx-0 md:mx-0 mx-auto"
                >
                  Edit
                </div>
              </div>
            ))
          )}
          <div
            onClick={handleEditClick}
            className="p-10 border text-center text-2xl bg-gray-50 font-extrabold shadow hover:cursor-pointer"
          >
            <span className="text-3xl">+</span> Add New Address
          </div>
        </div>
        <div className="lg:border-s-2 md:border-s-2 border-[#adadad] p-10">
          <div className="font-extrabold text-2xl pb-2">Delivery Estimates</div>
          {cartItems.map((item: CartItem) => (
            <div className="flex gap-7 items-center mb-5">
              <img
                className="w-24"
                src={item.product.thumbnail_url}
                alt={item.product.name}
              />
              <p className="text-xl font-bold">
                {minDeliveryDate && maxDeliveryDate ? (
                  <>
                    Delivery between
                    <span className="font-extrabold">
                      {" "}
                      <span>{formatDate(minDeliveryDate)}</span> -{" "}
                      <span>{formatDate(maxDeliveryDate)}</span>
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">Please select a shipping method to see delivery dates.</span>
                )}
              </p>

              {/* <p>{item.product.id}</p> */}
            </div>
          ))}
          <div className="">
            <div className="text-xl font-extrabold py-5">Price Details</div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-xl font-bold">Sub Total</span>
              <span className="text-xl font-bold">${subTotalPrice}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-xl font-bold">Discount Price</span>
              <span className="text-xl font-bold">${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-xl font-bold">Tax Rate</span>
              <span className="text-xl font-bold">
                ({taxRate * 100 + "%"})
                {"$" + (taxRate * subTotalPrice).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-xl font-bold">Shipping Rate</span>
              <span className="text-xl font-bold">
                {shippingRates?.[0]?.rate ? (
                  <span>${shippingRates?.[0].rate}</span>
                ) : (
                  "Select Address"
                )}
              </span>
            </div>
            <div className="flex justify-between items-center border-t-2 border-[#adadad] pt-4">
              <span className="text-xl font-extrabold">Total Amount</span>
              <span className="text-xl font-extrabold">${lastPrice}</span>
            </div>
          </div>
          <div className="pt-10 text-center">
          <Link
            to="/payment"
            state={{
              taxRate: taxRate,         // Pass tax rate
              shippingRate: shippingRate, // Pass shipping rate
              lastPrice: lastPrice,     // Pass total price
              subTotalPrice: subTotalPrice, // Pass subtotal
              discount: discount,       // Pass discount amount
            }}
          >
            <Button className="bg-[#f3844a] hover:bg-[#f3844a] w-full rounded-t-none rounded-b-lg rounded-md text-white text-xl font-bold px-10 py-3 hover:text-gray-200">
              Checkout
            </Button>
          </Link>

          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-start py-10 justify-center bg-black bg-opacity-50 px-5 overflow-y-auto z-[103]">
          <div className="bg-white p-8 w-full max-w-3xl rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-grow text-center text-2xl font-bold">
              {isEditing ? "Edit Address" : "Add New Address"}
            </div>
            <button 
            onClick={handleCancelClick} 
            className="text-3xl font-bold text-gray-600 hover:text-red-600 bg-white py-2  px-5 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
          >
            ×
          </button>
          </div>
            <form onSubmit={handleFormSubmit}>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
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
                  name="name2"
                  placeholder="Enter Your Name"
                  required
                  value={userDetails2.name2}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(value)) { // Allow only letters and spaces
                      setUserDetails2({ ...userDetails2, name2: value });
                    }
                  }}
                  className="block ps-12 shadow appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
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
                  name="phonenumber2"
                  placeholder="Enter Your Phone"
                  required
                  value={userDetails2.phonenumber2}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setUserDetails2({ ...userDetails2, phonenumber2: value });
                    }
                  }}
                
                  className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
                <label
                  className="block text-gray-700 text-xl font-extrabold"
                  htmlFor="phone"
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
                  name="email2"
                  placeholder="Enter Your Email"
                  required
                  value={userDetails2.email2}
                  onChange={(e) =>
                    setUserDetails2({
                      ...userDetails2,
                      email2: e.target.value,
                    })
                  }
                  className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
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
                  name="address12"
                  placeholder="Enter Address Line 1"
                  required
                  value={userDetails2.address12}
                  onChange={(e) =>
                    setUserDetails2({
                      ...userDetails2,
                      address12: e.target.value,
                    })
                  }
                  className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
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
                  name="address22"
                  placeholder="Enter Address Line 2"
                  // required
                  value={userDetails2.address22}
                  onChange={(e) =>
                    setUserDetails2({
                      ...userDetails2,
                      address22: e.target.value,
                    })
                  }
                  className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <div className="text-red-500 font-semibold text-sm end-0 pe-2 absolute">
                  *(optional)
                </div>
              </div>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
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
                  name="city2"
                  placeholder="Enter City"
                  required
                  value={userDetails2.city2}
                  onChange={(e) =>
                    setUserDetails2({ ...userDetails2, city2: e.target.value })
                  }
                  className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="lg:mb-5 md:mb-5 mb-3 relative">
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
                  name="country_name2"
                  required
                  value={userDetails2.country_name2}
                  onChange={handleCountryChange}
                  className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-[8.4px] px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" className="font-semibold text-2xl">
                    Select Country~
                  </option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
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
                  name="country_code2"
                  placeholder="Enter Country Code"
                  required
                  value={userDetails2.country_code2}
                  onChange={(e) =>
                    setUserDetails2({
                      ...userDetails2,
                      country_code2: e.target.value,
                    })
                  }
                  disabled
                  className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
                {states.length > 0 ? (
                  <>
                    <label
                      className="block text-gray-700 text-xl pb-2 font-extrabold"
                      htmlFor="state"
                    >
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
                      name="state_name2"
                      required
                      value={userDetails2.state_name2}
                      onChange={handleStateChange}
                      className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-[8.4px] px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" className="font-bold text-2xl">
                        Select State~
                      </option>
                      {states.map((state) => (
                        <option key={state.code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <div>
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
                      name="state_name2"
                      placeholder="Enter State"
                      required
                      value={userDetails2.state_name2}
                      onChange={(e) =>
                        setUserDetails2({
                          ...userDetails2,
                          state_name2: e.target.value,
                        })
                      }
                      className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                )}
              </div>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
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
                  name="state_code2"
                  placeholder="Enter State Code"
                  required
                  value={userDetails2.state_code2}
                  onChange={(e) =>
                    setUserDetails2({
                      ...userDetails2,
                      state_code2: e.target.value,
                    })
                  }
                  className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="lg:mb-5 md:mb-5 mb-3 relative">
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
                  name="zip2"
                  placeholder="Enter ZIP"
                  required
                  value={userDetails2.zip2}
                  onChange={(e) =>
                    setUserDetails2({ ...userDetails2, zip2: e.target.value })
                  }
                  className="shadow ps-12 appearance-none border rounded w-full text-xl font-semibold py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {/* </div> */}
              <div className="flex items-center pt-10 justify-between">
              <button
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold text-2xl py-3 px-7 rounded focus:outline-none focus:shadow-outline"
                  // onClick={handleCancelClick}
                  type="reset"
                  onClick={handleClearClick}
                >
                  Clear
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold text-2xl py-3 px-7 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Save
                </button>
               
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;
