import React from "react";
import { Link } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/24/solid";

const FailedOrder: React.FC = () => {
  return (
    <div className="pt-20 py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="text-center p-20">
          <div className="pb-5">
            <XCircleIcon className="w-28 mx-auto text-red-600" />
          </div>
          <div className="font-bold text-3xl text-red-600">Order Failed</div>
          <div className="pt-2 font-semibold text-xl text-gray-600">
            Unfortunately, your order could not be processed. Please try again or contact customer support for assistance.
          </div>
          <div className="flex gap-5 justify-center mt-7">
            <Link
              className="uppercase py-3 px-5 font-bold text-xl border-red-600 border text-red-600 hover:text-white hover:bg-red-600"
              to="/delivery-address"
            >
              Retry Payment
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

export default FailedOrder;
