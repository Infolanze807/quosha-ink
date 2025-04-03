import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { executePayment, createOrder } from "../../features/order/orderSlice";
import toast from "react-hot-toast";

const PayPalSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const { cartItems } = useAppSelector((state) => state.cart);
  const data = JSON.parse(sessionStorage.getItem("orderData") || "{}");
  const isOrderCreated = useRef(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentId = searchParams.get("paymentId");
    const payerId = searchParams.get("PayerID");

    if (!paymentId || !payerId) {
      toast.error("Missing payment details.");
      navigate("/");
      return;
    }

    const handleOrderCreation = async () => {
      if (isOrderCreated.current) return;  // Prevent multiple executions
      isOrderCreated.current = true;

      const orderData = {
        userId: userId || "",
        recipient: data.recipient,
        items: cartItems.map((item) => ({
          sync_variant_id: item.product.id,
          quantity: item.quantity,
          name: item.product.name,
          productId: item.product.sync_product_id,
          image: item.product.thumbnail_url,
          size: item.product.size,
          price: item.product.price,
        })),
        shipping: "STANDARD",
        subAmount: data.subAmount,
        discount: data.discount,
        shippingRate: data.shippingRate,
        taxRate: data.taxRate,
        totalAmount: data.totalAmount,
        method: "PayPal",
        transactionId: paymentId,
        USD: data.totalAmount,
        currency: "USD",
      };

      // console.log("Order Data:", orderData);

      try {
        // Execute PayPal payment (if necessary)
        await dispatch(executePayment({ total: (data.totalAmount), paymentId, payerId }));

        // Create order using orderData
        // const orderResponse = await dispatch(createOrder(orderData));

        // console.log("Order Response:", orderResponse);

        // if (orderResponse.meta.requestStatus === "fulfilled") {
        //   const orderId = orderResponse.payload.id;
        //   navigate(`/order-success/${orderId}`);
        //   sessionStorage.removeItem("orderData");
        // } else {
        //   toast.error("Failed to place order.");
        // }
      } catch (error) {
        toast.error("Failed to create order after payment.");
        // navigate("/");
      }
    };

    handleOrderCreation();
  }, [location.search, cartItems, dispatch, navigate]);

  return (
    <div className="fixed inset-0 p-5 bg-black bg-opacity-40 flex justify-center items-center z-[99]">
      <div className="text-3xl font-bold uppercase">Please Wait....</div>
    </div>
  );
};

export default PayPalSuccess;
