import toast from "react-hot-toast";
import axiosConfig from "../../app/axiosConfig";

const shippingRates = async (
  recipient: { country_code: string; state_code: string },
  items: { variant_id: number; quantity: number }[],
  currency: string
) => {
  try {
    const response = await axiosConfig.post("/printful/shipping/rates", {
      recipient,
      items,
      currency
    });
    // console.log("shipping Rate", response);
    return response.data.result;
  } catch (error) {
    throw new Error("Failed to fetch shipping rates");
  }
};

const taxRates = async (
  recipient: { country_code: string; state_code: string, zip: number },
) => {
  try {
    const response = await axiosConfig.post("/printful/tax/rates", {
      recipient,
    });
    // console.log("tax Rate", response);
    return response.data.result;
  } catch (error: any) {
    // console.log("Manish1111111111", error.response.data.error)
    throw new Error(error.response.data.error);
  }
};

const createOrder = async (orderData: any) => {
    try {
      const response = await axiosConfig.post("/printful/orders", orderData);
      // console.log("response", response);
      toast.success("Order Place Sucessfully")
      return response.data.result;
    } catch (error) {
      throw new Error("Failed to create order");
    }
  };

  const fetchUserOrders = async (userId: string) => {
    try {
      const response = await axiosConfig.get(`/printful/orders/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch user orders");
    }
  };

  const fetchUserSingleOrders = async (orderId: string) => {
    try {
      const response = await axiosConfig.get(`/printful/orders/${orderId}`);
      // console.log("single", response.data);
      return response.data.result;
    } catch (error: any) {
      throw new Error("Failed to fetch user orders");
    }
  };

  const createPayment = async (total: any) => {
    try {
      const response = await axiosConfig.post("/payment/pay", { total });
      return response.data;
    } catch (error) {
      throw new Error("Failed to create PayPal payment");
    }
  };

  const executePayment = async ({ paymentId, payerId,total }: { total: number; paymentId: string; payerId: string }) => {
    try {
      const response = await axiosConfig.get(`/payment/success`, {
        params: {
          paymentId,
          PayerID: payerId,
          total,
        },
      });
      // console.log("order", response.data)
      return response.data;
    } catch (error) {
      throw new Error("Failed to execute PayPal payment");
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axiosConfig.get("/printful/countries");
      return response.data.result;
    } catch (error) {
      throw new Error("Failed to fetch countries");
    }
  };

  const checkEligibility = async (orderId: string, userId: string, walletAddress: string) => {
    try {
      const response = await axiosConfig.get("user/check-eligibility", {
        params: {
          orderId,
          userId,
          walletAddress,
        },
      });
      return response.data;
    } catch (error:any) {
      console.error("Manish", error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Failed to check eligibility");
      }
    }
  };

  const nftDrop = async (orderId: string, userId: string) => {
    try {
      const response = await axiosConfig.post("user/update-nftdrop", {  
        orderId,
        userId
      });
      // console.log("Manish", response.data)
      return response.data;
    } catch (error) {
      // console.log("Manish", error)
      throw new Error("Failed to perform NFT drop");
    }
  }

const orderService = {
  shippingRates,
  createOrder,
  taxRates,
  fetchUserOrders,
  fetchUserSingleOrders,
  createPayment,
  executePayment,
  fetchCountries,
  checkEligibility,
  nftDrop,
};

export default orderService;
