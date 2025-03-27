import React, { useState } from "react";
import styles from "./index.module.scss";
import img2 from "./../../images/QuoshaLogo_Black.png";
import { useParams, useNavigate  } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { verifyemail } from "../../features/auth/authSlice";

const VerifyPage: React.FC = () => {

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { userId, token } = useParams<{ userId: string; token: string }>();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!userId || !token) {
      console.error("Invalid URL parameters");
      return;
    }

    setLoading(true);

    // const verifyemailData = { user_status: "active" }; // Assuming you want to set status to 'active'
    
    const resultAction = await dispatch(verifyemail({ userId, token }));

    if (verifyemail.fulfilled.match(resultAction)) {
      // console.log("Email verified successfully.");
      navigate("/");
    } else {
      // console.error("Failed to verify email. Please try again.");
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
          <div className="text-4xl font-bold text-center pt-10">
            Verify Your Account
          </div>
          <div className="text-center font-semibold pt-3 text-2xl text-gray-600">
            Use your credentials to access your account.
          </div>
          <div>
            
          </div>
          <div className="text-center pt-10">
            <button onClick={handleVerify} className="py-3 px-16 rounded-full font-semibold hover:bg-white border-2 border-black hover:text-black outline bg-black text-white hover:cursor-pointer">
              {loading ? "Loading..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyPage;
