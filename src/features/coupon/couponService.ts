import axiosConfig from "../../app/axiosConfig";


const getCoupon = async () => {
    try {
      const response = await axiosConfig.get(`/applycoupon/coupons`);
      return response.data.coupons;
    } catch (error:any) {
      console.error("Manish", error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Failed to check eligibility");
      }
    }
  };

  const applyCoupon = async (couponCode: string, totalPrice: string) => {
    try {
      const response = await axiosConfig.post(`/applycoupon/apply-coupon`, { couponCode, totalPrice });
      // console.log("Manish post", response)
      return response.data;
    } catch (error:any) {
      console.error("Manish coupon", error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Failed to check eligibility");
      }
    }
  };

  const couponService = {
    getCoupon,
    applyCoupon,
  };
  
  export default couponService;