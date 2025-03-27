import React, { FormEvent, useState } from "react";
import styles from "./index.module.scss";
import img2 from "./../../images/QuoshaLogo_Black.png";
import { SiGmail } from "react-icons/si";
import { NavLink } from "react-router-dom";
import { forgot } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks"; 

const ForgotPage: React.FC = () => {

  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const handleForgot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const resultAction = await dispatch(forgot({email}));
    if (forgot.fulfilled.match(resultAction)) {
      // console.log("Response:",resultAction.payload.message);
    }
    setLoading(false);
  };

  return (
    <div className={`pt-16 py-10 px-4 ${styles.maincomponent}`}>
      <div className={`py-20`}>
        <div className="shadow-lg rounded-xl max-w-2xl bg-white mx-auto lg:p-12 lg:py-20 md:p-12 md:py-20 p-6 py-10">
          <div className="flex items-center justify-center">
            <img className="w-64 me-3" src={img2} alt="Flowy" />
            {/* <span className="text-5xl font-bold text-[--four-color]">Quosha</span> */}
          </div>
          <div className="text-4xl font-bold text-center pt-10">
            Reset Your Password
          </div>
          <div className="text-center font-semibold pt-3 text-2xl text-gray-600">
            Please enter your email address and we will send you a reset
            password link.
          </div>
          <form onSubmit={handleForgot}>
            <div className="form-group mt-8">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                  <span className="text-gray-500 sm:text-sm">
                    <SiGmail className="text-xl" />
                  </span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full bg-[--main-color] text-xl rounded-full border-0 py-4 ps-14 text-gray-900 font-semibold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Enter Your Email"
                  required
                />
              </div>
            </div>
            <div className="CTA text-center pt-5 ">
                    <input
                      className="py-3 px-16 rounded-full font-semibold hover:bg-white border-2 border-black hover:text-black bg-black text-white hover:cursor-pointer"
                      type="submit"
                      value={loading ? "Loading..." : "Submit"}
                      disabled={loading}
                    />
                    <div className=" pt-10 flex justify-center">
                      Back to&nbsp;
                      <NavLink to={`/login`}
                        className="hover:cursor-pointer hover:text-gray-500"
                      >
                        Login
                      </NavLink>
                    </div>
                  </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPage;
