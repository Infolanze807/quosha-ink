import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import img from "../../images/checkout_15661686.png";
import { useAppDispatch } from "../../app/hooks";
import { setOrderId } from "../../features/delivery/deliverySlice";

const SuccessOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderId) {
      dispatch(setOrderId(orderId));
    }
  }, [orderId, dispatch]);

  return (
    <div className="pt-20 py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="text-center p-20">
          <div className="pb-5">
            <img className="w-28 mx-auto" src={img} alt="Success" />
          </div>
          <div className="font-bold text-3xl">Thank you for ordering!</div>
          <div className="pt-2 font-semibold text-xl text-gray-600">
          Your order has been successfully placed. We’re processing it and will update you once it’s shipped.  
          You can track your order status in the "View Order" section for real-time updates.
          </div>
          <div>
            <div className="pt-6 pb-4 font-semibold text-xl text-black">
              Your Order ID: {orderId}
            </div>
            {/* <Link to="/nft-drop">
              <button className="font-semibold text-xl py-3 px-5 rounded bg-green-600 hover:bg-green-700 text-white">Claim NFTs</button>
            </Link> */}
          </div>
          <div className="flex gap-5 justify-center mt-7">
            <Link
              className="uppercase py-3 px-5 font-bold text-xl border-black border hover:text-white hover:bg-black"
              to="/order"
            >
              View Order
            </Link>
            <Link
              className="uppercase py-3 px-5 font-semibold text-xl text-white bg-black hover:text-black hover:bg-white border border-black"
              to="/"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessOrder;
