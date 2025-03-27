import React, { FormEvent, useState } from "react";
import styles from "./index.module.scss";
import img2 from "./../../images/QuoshaLogo_Black.png";
import { MdKey, MdVisibilityOff, MdVisibility } from "react-icons/md";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { resetpassword } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import toast from 'react-hot-toast';

const ResetPage: React.FC = () => {
  const { userId, token } = useParams<{ userId: string; token: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);

    if (userId && token) {
      const resultAction = await dispatch(resetpassword({ userId, token, resetpassword: { password } }));
      if (resetpassword.fulfilled.match(resultAction)) {
        const { token, userId, name } = resultAction.payload;
        // const userId = user.userId;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("Name", name);
        // toast.success("Password reset successfully");
        navigate("/");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } else {
      toast.error("Invalid URL parameters");
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
            Please enter your new password and confirm password
          </div>
          <form onSubmit={handleReset}>
            <div className="form-group mt-8">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                  <span className="text-gray-500 sm:text-sm">
                    <MdKey className="text-2xl" />
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="block w-full bg-[--main-color] text-xl rounded-full border-0 py-4 ps-14 text-gray-900 font-semibold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Enter Your New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 pr-5 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <MdVisibility className="text-2xl" />
                  ) : (
                    <MdVisibilityOff className="text-2xl" />
                  )}
                </span>
              </div>
            </div>
            <div className="form-group mt-8">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                  <span className="text-gray-500 sm:text-sm">
                    <MdKey className="text-2xl" />
                  </span>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  className="block w-full bg-[--main-color] text-xl rounded-full border-0 py-4 ps-14 text-gray-900 font-semibold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Enter Your Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 pr-5 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
                    <MdVisibility className="text-2xl" />
                  ) : (
                    <MdVisibilityOff className="text-2xl" />
                  )}
                </span>
              </div>
            </div>
            <div className="CTA text-center pt-10 ">
              <input
                className="py-3 px-16 rounded-full font-semibold hover:bg-white border-2 border-black hover:text-black bg-black text-white hover:cursor-pointer"
                type="submit"
                value={loading ? "Loading..." : "Submit"}
                disabled={loading}
              />
              <div className="pt-10 flex justify-center">
                Back to&nbsp;
                <NavLink
                  to={`/login`}
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

export default ResetPage;
