import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./index.module.scss";
import Button from "../../components/components/Button";
import {
  incrementItemFromCart,
  reduceItemFromCart,
  removeItemFromCart,
} from "../../features/cart/cartSlice";
import { MdCheck, MdDelete } from "react-icons/md";
import { TbTruckReturn } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";
import Spinner from "../../components/components/Spinner";
import toast from "react-hot-toast";
import { TbLoader2 } from "react-icons/tb";
import wishlistimg from "../../images/Wishlist_Heart_Checkout_Page.png";
import {
  getCouponsAsync,
  applyCouponAsync,
  setDiscountedAmount,
  resetCoupons,
} from "../../features/coupon/couponSlice";
import { addToWishlist } from "../../features/wishlist/wishlistSlice";
import { WishlistItem } from "../../types/wishlist";

type WishlistProduct = {
  productId: number;
  name: string;
  image: string;
  price: number;
  id: number;
};

const Cart: React.FC = () => {
  const { cartItems, isLoading } = useAppSelector((state) => state.cart);
  const {
    coupons,
    isLoading: couponsLoading,
    selectedCoupon,
    discountedAmount,
    error,
  } = useAppSelector((state) => state.coupons);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getCouponsAsync()); // Fetch coupons when component mounts
  }, [dispatch]);

  const totalPrice = cartItems.reduce(
    (a, c) => a + c.quantity * c.product.price,
    0
  );

  const handlePlaceOrder = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      dispatch(setDiscountedAmount(discountedAmount));
      navigate("/delivery-address");
    } else {
      toast.error("Please login first");
    }
  };

  const activeCoupons = coupons.filter(coupon => coupon.status === "true");
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      applyCouponAsync({ couponCode, totalPrice: totalPrice.toString() })
    )
      .unwrap()
      .then(() => {
        toast.success(`Coupon applied successfully!`);
        // setCouponCode("");
      })
      .catch((error) => {
        console.error("Error applying coupon:", error);
      });
  };

  const handleRemoveCoupon = () => {
    dispatch(resetCoupons());
    setCouponCode("");
  };

  const addToWishlistHandler = ({ productId, name, image, price, id }: WishlistProduct) => {
    const token = localStorage.getItem("token"); // Check for token
    if (!token) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    setLoadingStates((prevState) => ({ ...prevState, [productId]: true })); 
    const userId = localStorage.getItem("userId");

    const wishlistItem: WishlistItem = {
      userId: userId ?? "",
      productId,
      name,
      image,
      price,
      id,
    };

    dispatch(addToWishlist(wishlistItem)).then(() => {
      setLoadingStates((prevState) => ({ ...prevState, [productId]: false }));
    });
  };

  if (isLoading || couponsLoading) return <Spinner />;

  return (
    <section className={styles.section}>
      <div className={`${styles.container} main-container`}>
        <div
          className={`items-center justify-center border-b-2 border-[#adadad] py-10 mb-5 ${styles.titleContainer}`}
        >
          <div className="flex items-center justify-center gap-4 lg:text-2xl md:text-2xl text-xl font-semibold">
            <div className="uppercase font-extrabold">Bag</div>---------
            <div className="uppercase ">Address</div>---------
            <div className="uppercase">Payment</div>
          </div>
        </div>
        {cartItems.length ? (
          <div className={styles.content}>
            <div className={styles.cartLeft}>
              {cartItems.map((item) => (
                <div className={styles.cartCardWrapper} key={item.product.id}>
                  <Link
                    to={`/products/${item.product.sync_product_id}`}
                    className={styles.cartCardContainer}
                  >
                    <img
                      src={item.product.thumbnail_url}
                      className={`!bg-white !rounded-3xl ${styles.cartCardImage}`}
                      alt={item.product.name}
                    />
                    <div className={styles.cartCardDetails}>
                      <div className={styles.cartCardLeft}>
                        <div className={styles.title}>{item.product.name}</div>
                        <div className={styles.size}>
                          Size: {item.product.size}
                        </div>
                        <div className={styles.price}>
                          ${item.product.price}
                        </div>
                        <div className={styles.return}>
                          <div className={styles.iconContainer}>
                            <TbTruckReturn className={styles.icon} />
                          </div>
                          <div className={styles.title}>
                            7 days return available
                          </div>
                        </div>
                        <div className={styles.delivery}>
                          <div className={styles.iconContainer}>
                            <MdCheck className={styles.icon} />
                          </div>
                          <div className={styles.title}>
                            Delivery by 5-6 days
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className={styles.cartCardRight}>
                    <div className={styles.cartCardRightWrapper}>
                      <Button
                        className={styles.button}
                        onClick={() => {
                          handleRemoveCoupon();
                          dispatch(reduceItemFromCart(item.product));
                        }}
                      >
                        -
                      </Button>
                      <div className={styles.counter}>{item.quantity}</div>
                      <Button
                        className={styles.button}
                        onClick={() => {
                          handleRemoveCoupon();
                          dispatch(incrementItemFromCart(item.product));
                        }}
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex w-full items-center gap-5 md:pb-7 justify-end">
                      <div
                        onClick={() =>
                          addToWishlistHandler({
                            productId: item.product.id,
                            name: item.product.name,
                            image: item.product.thumbnail_url,
                            price: item.product.price,
                            id: item.product.id,
                          })
                        }
                        className="rounded-md duration-300"
                      >
                        {loadingStates[item.product.id] ? (
                          <div className="p-4">
                            <TbLoader2 className={`animate-spin text-2xl`} />
                          </div>
                        ) : (
                          // <FaRegHeart className={`text-2xl`} />
                          <img className="w-[37px]" src={wishlistimg} alt="wishlish" />
                        )}
                      </div>
                      <Button
                        className={`bg-[--title-color] hover:bg-[--title-color] ${styles.cartCardDelete}`}
                        onClick={() => {
                          handleRemoveCoupon();
                          dispatch(removeItemFromCart(item.product.id));
                        }}
                      >
                        <MdDelete className={styles.icon} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartRight}>
              <div className={styles.coupon}>
                <div className={styles.availableCoupons}>
                  <div className={`!text-black ${styles.title}`}>Available Coupons:</div>
                  <select
                    className="block w-full p-4 mb-2 mt-1 text-xl font-bold text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none"
                    value={couponCode}
                    disabled={coupons.length === 0}
                    onChange={(e) => setCouponCode(e.target.value)}
                  >
                    <option value="" className="" disabled>
                      {activeCoupons.length === 0 ? 'No coupons available' : 'Select a coupon'}
                    </option>
                    {activeCoupons.map((coupon) => (
                      <option
                        className=""
                        key={coupon.code}
                        value={coupon.code}
                      >
                        {coupon.code} - {coupon.discount}% off,&nbsp; min
                        purchase ${coupon.minimum}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`!text-black ${styles.title}`}>Coupons:</div>
                <div className={styles.couponContent}>
                  <form
                    className="max-w-md mx-auto"
                    onSubmit={handleApplyCoupon}
                  >
                    <label
                      htmlFor="default-search"
                      className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                      Search
                    </label>
                    <div className="relative">
                      <div
                        className="cursor-pointer absolute start-2.5 bottom-4"
                        onClick={handleRemoveCoupon}
                      >
                        <IoMdCloseCircle className="text-[20px] text-[--title-color]" />
                      </div>
                      <input
                        type="search"
                        id="default-search"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="block w-full p-4 ps-12 text-lg font-bold text-gray-900 border border-gray-200 rounded-lg bg-white"
                        required
                      />
                      <button
                        type="submit"
                        className="text-white absolute end-2.5 bottom-3.5 bg-[--title-color] font-medium rounded-lg text-sm px-4 py-2"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
                {error && (
                  <div className="text-xl font-semibold text-red-500">
                    {error}
                  </div>
                )}
              </div>
              <div className={styles.priceDetails}>
                <div className={`!text-black ${styles.title}`}>Price Details</div>
                <div className={styles.priceContent}>
                  <div className={styles.title}>Sub Total</div>
                  <div className={styles.price}>${totalPrice.toFixed(2)}</div>
                </div>
                {selectedCoupon && (
                  <>
                    <div className={styles.priceContent}>
                      <div className={styles.title}>Discount</div>
                      <div className={`text-red-600 ${styles.price}`}>
                        {selectedCoupon.discount}%
                      </div>
                    </div>
                    <div className={styles.priceContent}>
                      <div className={styles.title}>Discounted Amount</div>
                      <div className={`text-red-600 ${styles.price}`}>
                        ${selectedCoupon.discountedAmount.toFixed(2)}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className={styles.totalContent}>
                <div className={styles.title}>Total Amount</div>
                <div className={styles.price}>
                  {(selectedCoupon
                    ? selectedCoupon.TotalAmount
                    : totalPrice
                  ).toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <Button
                  className="bg-[#f3844a] hover:bg-[#f3844a] w-full rounded-t-none rounded-b-lg rounded-md text-white text-xl font-bold px-10 py-3 hover:text-gray-200"
                  onClick={handlePlaceOrder}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`text-center py-20 ${styles.noCartItems}`}>
            No Items Here
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
