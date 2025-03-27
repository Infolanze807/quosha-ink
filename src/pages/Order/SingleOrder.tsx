import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { fetchUserSingleOrders } from "../../features/order/orderSlice";
import { RootState } from "../../../src/app/store";
import { MdOutlineDelete } from "react-icons/md";
import {
  addReview,
  getReview,
  deleteReview,
} from "../../features/review-rating/reviewRatingSlice";
import Spinner from "../../components/components/Spinner";

interface Product {
  _id: string;
  image: string;
  name: string;
  price: string;
  productId: string;
  quantity: string;
  size: string;
  sync_variant_id: string;
  addedAt: string;
  id: string;
}

const SingleOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  const {userId: urlUserId, orderId } = useParams<{userId: string; orderId: string }>();
  
  const userId = urlUserId || localStorage.getItem("userId") || "";
  const name = localStorage.getItem("Name") || "";

  const { order, isLoading } = useAppSelector(
    (state: RootState) => state.order
  );
  const orderAmount = useAppSelector(
    (state: RootState) => state.order.orderAmountDetails
  );
  // console.log("orderAmount", orderAmount);
  const { reviews } = useAppSelector((state: RootState) => state.reviews);
  // console.log("review10001", reviews);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [popup, setPopup] = useState(false);
  const [currentProductId, setCurrentProductId] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      navigate("/login");
    } else if (orderId) {
      dispatch(fetchUserSingleOrders(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (orderId && userId && orderAmount) {
      orderAmount.products.forEach((item: Product) => {
        dispatch(getReview({ productId: item.productId, userId, orderId }));
      });
    }
  }, [dispatch, orderId, userId, orderAmount]);

  const openPopup = (productId: string) => {
    setCurrentProductId(productId);
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
    setRating(0);
    setComment("");
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    const reviewData = {
      productId: currentProductId,
      userId,
      orderId: orderId || "",
      name,
      rating,
      comment,
    };
    if (reviewData) {
      dispatch(addReview(reviewData));
      setRating(0);
      setComment("");
    }
    closePopup();

    // if (orderId) {
    //   dispatch(fetchUserSingleOrders(orderId));
    // }
  };

  const handleDeleteReview = (reviewId: string, productId: string) => {
    dispatch(deleteReview({ reviewId, userId, productId }));
    // console.log("de", productId);
  };

  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    // Function to get the suffix for day (e.g., st, nd, rd, th)
    const getDaySuffix = (day: number) => {
      if (day >= 11 && day <= 13) {
        return "th";
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return <div>No order details available.</div>;
  }

  const handleGoBack = () => {
    navigate(-1);  // Navigate one step back in the history
  };

  return (
    <div className="py-16 px-4">
      <div className="lg:px-32 md:px-24 px-0">
        <div className="p-3 pb-5 text-2xl font-bold">
          <div onClick={handleGoBack} className="flex items-center gap-3">
            <FaArrowLeft />
            Back to Orders
          </div>
        </div>
        <div className="">
          <div className="grid lg:grid-col-3 md:grid-cols-3 grid-cols-1 gap-10">
            <div className="col-span-2 p-10 bg-white h-max">
              <div className="flex items-center justify-between p-5 pb-0">
                <div className="flex items-center">
                  <div className="pe-2">
                    <IoMdCheckmarkCircleOutline className="text-5xl text-green-600 me-2" />
                  </div>
                  <div>
                    <p className="text-green-600 font-extrabold">
                      {order.status?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="font-semibold text-2xl">
                  Order ID - <span className="font-bold">{order.id}</span>
                </div>
              </div>
              {orderAmount &&
                orderAmount.products.map((item: Product) => (
                  <div key={item.id} className="mt-5 bg-[--main-color]">
                    <div className="p-5 flex gap-10 items-center">
                      <div>
                        <Link to={`/products/${item.productId}`}>
                          <img className="w-52" src={item.image} alt="img" />
                        </Link>
                      </div>
                      <div>
                        <div className="text-3xl font-bold pb-2">
                          {item.name}
                        </div>
                        <div className="text-2xl font-bold pb-1">
                          Size:- <span>{item.size}</span>
                        </div>
                        <div className="text-2xl font-bold pb-1">
                          Price:- <span>{item.price}$</span>
                        </div>
                      </div>
                    </div>
                    {!urlUserId ? (
                    <>
                    <div>
                      {reviews[item.productId] &&
                      item.productId === reviews[item.productId].productId ? (
                        <div className="p-5 pt-0">
                          <div className="p-5 bg-white flex justify-between">
                            <div className="">
                              <div className="font-bold text-2xl pb-1">
                                Your Review:
                              </div>
                              <div className="text-2xl pb-1 flex gap-2 font-semibold items-center">
                                Rating:{" "}
                                <span className="flex gap-1">
                                  {[...Array(5)].map((_, index) => (
                                    <FaStar
                                      key={index}
                                      className={`text-3xl cursor-pointer ${
                                        index <
                                        (reviews[item.productId]?.rating ||
                                          rating)
                                          ? "text-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                      onClick={() => handleRating(index + 1)}
                                    />
                                  ))}
                                </span>
                              </div>
                              <div className="text-2xl font-semibold pb-1">
                                Comment: {reviews[item.productId].comment}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteReview(
                                  reviews[item.productId]._id,
                                  reviews[item.productId].productId
                                )
                              }
                              className="bg-red-500 text-white px-3 py-3 font-semibold text-xl rounded w-max h-max flex items-center"
                            >
                              <MdOutlineDelete className="text-2xl" />
                              <span className="pt-1 lg:block md:block hidden">
                                &nbsp;Review
                              </span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 pt-0">
                          <div className="p-5 bg-white">
                            <div
                              className="flex items-center gap-3 ps-2 text-3xl hover:cursor-pointer"
                              onClick={() => openPopup(item.productId)}
                            >
                              {[...Array(5)].map((_, index) => (
                                <FaStar
                                  key={index}
                                  className={`text-3xl cursor-pointer ${
                                    index <
                                    (reviews[item.productId]?.rating || rating)
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                  onClick={() => handleRating(index + 1)}
                                />
                              ))}
                            </div>
                            <div
                              className="font-semibold text-2xl pt-2 hover:cursor-pointer"
                              onClick={() => openPopup(item.productId)}
                            >
                              Give Rate & Review to
                              <span className="font-extrabold">
                                {" "}
                                Quosha Ink
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5 pb-8">
                      <a
                        href={`mailto:quolabs@quoshaink.com?subject=${encodeURIComponent(
                          `Return and Refund Request - Order ID ${order.id}`
                        )}&body=${encodeURIComponent(
                          `Hello Quosha Ink,

I would like to request a return and refund for my order. Here are the details:

Product Name: ${orderAmount?.products
                            ?.map((item: Product) => item.name)
                            .join(", ")}
Order ID: ${order.id}
Recipient Name: ${order.recipient.name}
Transaction ID: ${orderAmount.payment.transactionId}

Thank you,
${order.recipient.name}`
                        )}`}
                        className="bg-blue-500 text-white p-5 font-bold text-xl rounded hover:bg-blue-600"
                      >
                        Return & Refund
                      </a>
                    </div>

                    {popup && (
                      <div className="fixed inset-0 p-5 bg-black bg-opacity-50 flex justify-center items-center z-[99]">
                        <div className="bg-white p-8 rounded shadow-lg w-[400px] max-w-2xl">
                          <div className="flex justify-between items-center mb-7">
                            <div className="text-2xl font-bold">
                              Rate & Review
                            </div>
                            <button
                              onClick={closePopup}
                              className="text-4xl font-bold bg-white hover:bg-white text-black p-0"
                            >
                              &times;
                            </button>
                          </div>
                          <form action="" onSubmit={handleSubmit}>
                            <div className="flex gap-2 mb-4">
                              {[...Array(5)].map((_, index) => (
                                <FaStar
                                  key={index}
                                  className={`text-3xl cursor-pointer ${
                                    index < rating
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                  onClick={() => handleRating(index + 1)}
                                />
                              ))}
                            </div>
                            <textarea
                              className="w-full p-2 border rounded mb-7 font-normal text-xl"
                              placeholder="Write your comment..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              required
                            ></textarea>
                            <div className="text-center">
                              <button
                                // onClick={handleSubmit}
                                className="bg-blue-500 text-white px-7 py-3 font-semibold uppercase text-xl rounded"
                                type="submit"
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    
                  )}
                    </>
                    ): null}
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-10 h-max">
              <div className="bg-white p-5">
                <div className="bg-[--main-color] p-5">
                  <div className="font-bold text-2xl pb-1">
                    Order# {order.id}
                  </div>
                  <div className="font-semibold text-xl pb-1">
                    Order place on: {formatDate(order.created)}
                  </div>
                  <div className="font-semibold text-xl pb-1">
                    Paid by {order.recipient.name}
                  </div>
                  <div className="font-semibold text-xl pb-1">
                    Transaction ID:{" "}
                    {orderAmount?.payment?.transactionId?.startsWith(
                      "PAYID"
                    ) ? (
                      <span className="break-words break-all whitespace-normal font-bold">
                        {orderAmount.payment.transactionId}
                      </span>
                    ) : (
                      <a
                        href={`https://seitrace.com/tx/${orderAmount?.payment?.transactionId}?chain=pacific-1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words break-all whitespace-normal font-bold text-blue-500 hover:underline"
                      >
                        {orderAmount?.payment?.transactionId || "N/A"}
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-5 border-b-2 border-[#adadad] text-3xl font-bold">
                  Order Payment Details
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-xl font-bold">Order Amount</span>
                    <span className="text-xl font-bold">
                      ${orderAmount?.amount?.subTotalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-xl font-bold">Discount</span>
                    <span className="text-xl font-bold">
                      ${orderAmount?.amount?.discount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-xl font-bold">Tax Amount</span>
                    <span className="text-xl font-bold">
                      ${orderAmount?.amount?.taxRate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3">
                    <span className="text-xl font-bold">Shipping Fee</span>
                    <span className="text-xl font-bold">
                      ${orderAmount?.amount?.shippingRate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-[#adadad]">
                    <span className="text-xl font-bold">Total Order</span>
                    <span className="text-xl font-bold">
                      ${orderAmount?.amount?.totalPrice}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-10">
                <div className="text-2xl font-bold border-b-2 mb-3 pb-1 border-[#adadad]">
                  Deliver To:
                </div>
                <div className="text-xl font-bold pb-1">
                  Name - <span>{order.recipient.name}</span>
                </div>
                <div className="text-xl font-bold pb-1">
                  Address1 - <span>{order.recipient.address1}</span>
                </div>
                {order.recipient.address2 && (
                  <div className="text-xl font-bold pb-1">
                    Address2 - <span>{order.recipient.address2}</span>
                  </div>
                )}
                <div className="text-xl font-bold pb-1">
                  City - <span>{order.recipient.city}</span>
                </div>
                {order.recipient.state_name && (
                  <div className="text-xl font-bold pb-1">
                    State - <span>{order.recipient.state_name}</span>
                  </div>
                )}
                <div className="text-xl font-bold pb-1">
                  Country - <span>{order.recipient.country_name}</span>
                </div>
                <div className="text-xl font-bold pb-1">
                  Zip - <span>{order.recipient.zip}</span>
                </div>
                <div className="text-xl font-bold pb-1">
                  Email - <span>{order.recipient.email}</span>
                </div>
                {order.recipient.phone && (
                  <div className="text-xl font-bold pb-1">
                    Phone - <span>{order.recipient.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
