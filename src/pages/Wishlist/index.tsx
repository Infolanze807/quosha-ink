import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import {
  fetchWishlistItems,
  removeItemFromWishlist,
} from "../../features/wishlist/wishlistSlice";
import { AppDispatch, RootState } from "../../app/store";
import { Link, useNavigate } from "react-router-dom";
import productPrices from "../../../priceProducts.json";
import Spinner from "../../components/components/Spinner";

const WishlistPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const { wishlistItems, loading } = useSelector(
    (state: RootState) => state.wishlist
  );
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      navigate("/login");
    } else if (userId) {
      dispatch(fetchWishlistItems(userId));
    }
  }, [dispatch, userId]);

  const handleRemoveFromWishlist = async (productId: number) => {
    if (userId) {
      await dispatch(removeItemFromWishlist({ userId, productId }));
      dispatch(fetchWishlistItems(userId));
    }
  };

  const findPrice = (productName: string): string => {
    const product = productPrices.productPrice.find(
      (item) => item.productName === productName
    );
    return product ? product.productPrice : "0.00"; 
  };

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="lg:px-32 md:px-24 px-0">
        <div className="text-5xl font-extrabold text-center py-14">
          My Wishlist
        </div>
        <div className="bg-white lg:p-16 md:p-12 p-7">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:gap-10 md:gap-10 gap-7">
            {wishlistItems.length === 0 ? (
              <div className="text-center">Your wishlist is empty.</div>
            ) : (
              wishlistItems?.map((item) =>
                item && item.productId ? (
                  <div
                    className="border shadow-lg bg-[--main-color] hover:scale-105 duration-500"
                    key={item.productId}
                  >
                    <Link to={`/products/${String(item.productId)}`}>
                      <div className="relative">
                        <div className="relative">
                          <img
                            className="w-full h-auto"
                            src={item.image}
                            alt={item.name}
                          />
                          {/* <div className="absolute top-0 right-0 bg-red-500 text-white font-bold text-lg px-4 py-2 transform rotate-12 shadow-xl">
                            ${findPrice(item.name)}
                          </div> */}
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-7 p-5 px-7">
                      <p className="text-2xl font-bold line-clamp-2">{item.name}</p>
                      <div
                        className="bg-red-600 p-3 rounded-lg hover:cursor-pointer"
                        onClick={() => handleRemoveFromWishlist(item.productId)}
                      >
                        <MdDelete className="text-3xl text-white" />
                      </div>
                    </div>
                    <div className="text-red-600 px-7 pb-3">USD {findPrice(item.name)}</div>
                  </div>
                ) : null
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
