import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { VscCircleFilled } from "react-icons/vsc";
import { fetchUserOrders, setOrderAmountDetails } from "../../features/order/orderSlice";
import { RootState } from "../../app/store";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/components/Spinner";

interface Product {
  _id: string;
  image: string;
  name: string;
  quantity: number;
  size: string;
}

interface OrderDetail {
  _id: string;
  orderId: string;
  products: Product[];
  amount: number;
  createdAt: string;
}

interface Order {
  order: OrderDetail[];
}

const OrderPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUserOrders: userOrders, isLoading } = useAppSelector(
    (state: RootState) => state.order
  );
  const { userId: urlUserId } = useParams();
  const token = localStorage.getItem("token");
  const { userName } = location.state || {};

  console.log("userName", userName)

  const userId = urlUserId || localStorage.getItem("userId");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      navigate("/login")
    }
     else if (userId) {
      dispatch(fetchUserOrders( userId ));
    }
  }, [dispatch, userId]);

  const handleLinkClick = (orderDetail: any) => {
    dispatch(setOrderAmountDetails(orderDetail));
    const userIdFromUrl = urlUserId;

    if (userIdFromUrl) {
      navigate(`/admin/order-status/${userIdFromUrl}/${orderDetail.orderId}`);
    } else {
     navigate(`/order-status/${orderDetail.orderId}`)
  }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (isLoading) {
    return <div><Spinner/></div>;
  }

  return (
    <div className="py-16 px-4">
      <div className="lg:px-32 md:px-24 px-0">
        <div className="text-center text-5xl font-extrabold pb-16 pt-7">
          Need Help with Orders?
        </div>
        <div className="bg-white lg:p-14 md:p-14 p-7 rounded-md">
          <div className="text-center pb-10 text-3xl font-bold">
           {userName ? `Orders for ${userName}`: "Your Orders"}

          </div>
          {userOrders && userOrders.length > 0 ? (
            userOrders.map((order: Order) => (
              order.order.map((orderDetail) => (
                <div key={orderDetail._id} className="bg-[--main-color] lg:p-10 md:p-10 p-7 mb-7 rounded-lg">
                  <div className="">
                    {/* <div className="pe-2">
                      <IoMdCheckmarkCircleOutline className="text-5xl text-green-600 me-2" />
                    </div> */}
                    <div className="flex justify-between">         
                      <p className="lg:text-2xl md:text-2xl text-xl font-bold">Order ID: <span className="">{orderDetail.orderId}</span></p>
                      <p className="lg:text-2xl md:text-2xl text-xl font-bold">Order Date: <span>{formatDate(orderDetail.createdAt)}</span></p>
                    </div>
                  </div>
                  {orderDetail.products.map((product) => (
                    <div className="cursor-pointer" onClick={() => handleLinkClick(orderDetail)}
                    key={product._id}>
                    <div key={product._id} className="flex items-center bg-white mt-4 p-5">
                      <div className="pe-10">
                        <img className="w-36" src={product.image} alt={product.name} />
                      </div>
                      <div>
                        <p className="font-bold">{product.name}</p>
                        {/* <p>Size: {product.size}</p> */}
                        <p className="font-bold">Quantity: {product.quantity}</p>
                      </div>
                    </div>
                    </div>
                  ))}
                  <div className="bg-white mt-4 p-5">
                    <div className="flex items-center">
                      <VscCircleFilled className="text-xl" />
                      <p className="text-2xl font-bold">
                        Exchange/Return window closed on 10-12 Days
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ))
          ) : (
            <div>No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
