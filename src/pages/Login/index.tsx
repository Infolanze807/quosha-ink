import { useNavigate } from "react-router";
import { FormEvent, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { login } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks"; 
import { NavLink } from "react-router-dom";
import { SiGmail } from "react-icons/si";
import { MdKey, MdVisibilityOff, MdVisibility } from "react-icons/md";
import img2 from "./../../images/QuoshaLogo_Black.png";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [token, navigate]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);

    const resultAction = await dispatch(login({ email: formData.email, password: formData.password }));
    if (login.fulfilled.match(resultAction)) {
      console.log("logindata", resultAction)
      const userToken = resultAction.payload.token;
      const userId = resultAction.payload.user._id;
      const name = resultAction.payload.user.name; 
      const role = resultAction.payload.user.role
      console.log("role", role)

      localStorage.setItem("token", userToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("Name", name);
      if (role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <section className={`pt-16 py-10 px-4 ${styles.maincomponent}`}>
      <div className={`py-20`}>
        <div className="shadow-lg rounded-xl max-w-2xl bg-white mx-auto lg:p-12 lg:py-20 md:p-12 md:py-20 p-6 py-10">
          <div className="flex items-center justify-center">
            <img className="w-64 me-3" src={img2} alt="Flowy" />
            {/* <span className="text-5xl font-bold text-[--four-color]">Quosha</span> */}
          </div>
          <div className="text-4xl font-bold text-center pt-10">Login / Sign in</div>
          <div className="text-center font-semibold pt-3 text-2xl text-gray-600">Use your credentials to access your account.</div>
          <form onSubmit={formSubmitHandler}>
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
                  value={formData.email}
                  onChange={handleChange}
                  id="loginEmail"
                  className="block w-full bg-[--main-color] text-xl rounded-full border-0 py-4 ps-14 text-gray-900 font-semibold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Enter Your Email"
                  required
                />
              </div>
            </div>
            <div className="form-group mt-5">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                  <span className="text-gray-500 sm:text-sm">
                    <MdKey className="text-2xl" />
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  id="loginPassword"
                  className="block w-full bg-[--main-color] text-xl rounded-full border-0 py-4 ps-14 text-gray-900 font-semibold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Enter Your Password"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 pr-5 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibility className="text-2xl" /> : <MdVisibilityOff className="text-2xl" />}
                </span>
              </div>
            </div>
            <div className="text-end pt-4">
              <NavLink to="/forgot-password" className="hover:text-gray-500">
                Forgot Password?
              </NavLink>
            </div>
            <div className="CTA text-center pt-5">
              <input
                className="py-3 px-16 rounded-full font-semibold hover:bg-white border-2 border-black hover:text-black bg-black text-white hover:cursor-pointer"
                type="submit"
                value={loading ? "Loading..." : "Login"}
                disabled={loading}
              />
              <div className="pt-10 flex justify-center">
                Don't have an account?&nbsp;
                <NavLink to={`/register`} className="text-blue-500">
                  Register Here
                </NavLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

