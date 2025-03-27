import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../../../app/hooks";
import { addToWishlist } from "../../../features/wishlist/wishlistSlice";
import toast from "react-hot-toast";
import Button from "../Button";
import Skeleton from "../Skeleton/Skeleton";
import styles from "./index.module.scss";
import { TbLoader2 } from "react-icons/tb";
import img1 from "../../../images/Wishlist_Heart_Product_Catalogue.png";

interface ProductCardProps {
  id: number;
  key: string;
  title: string;
  image: string;
  external_id: string;
  price: number;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  key,
  title,
  price,
  image,
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const addToWishlistHandler = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    setIsLoading(true);

    const userId = localStorage.getItem("userId");

    const wishlistItem = {
      userId: userId ?? "",
      productId: id,
      name: title,
      image: image,
      price: price,
      id: id,
    };

    dispatch(addToWishlist(wishlistItem)).then(() => {
      setIsLoading(false);
    });
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <motion.div
      id={title}
      key={key}
      tabIndex={id}
      whileHover={{ cursor: "pointer" }}
      whileTap={{ cursor: "grabbing" }}
      transition={{
        ease: "easeInOut",
        duration: 0.4,
      }}
    >
      <div className={`hover:scale-[1.02] duration-300 ${styles.productItem}`}>
        <div className={styles.productPic}>
          <Link to={`/products/${String(id)}`}>
            <div className="relative">
              {!isImageLoaded && (
                <Skeleton
                  width="100%"
                  height="200px"
                  borderRadius="8px"
                  className="absolute inset-0"
                />
              )}
              <img
                src={image}
                alt={title}
                className={`w-full h-auto transition-opacity duration-300 ease-in-out ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={handleImageLoad}
              />
              {/* <div className="absolute top-0 right-0 bg-red-500 text-white font-bold text-lg px-4 py-2 transform rotate-12 shadow-xl">
    ${price}
  </div> */}
            </div>
          </Link>
          <div
            className={`lg:p-9 md:p-5 p-4 border-t ${styles.productDetailsContainer}`}
          >
            <Link
              to={`/products/${String(id)}`}
              className={styles.productDetailsWrapper}
            >
              <div className={styles.productDetails}>
                <div className={styles.productTitle}>
                  <div>{title}</div>
                </div>
              </div>
              <div className="text-red-600">USD {price}</div>
            </Link>
            <motion.div onClick={() => addToWishlistHandler()}>
              <Button className={`lg:p-1 md:p-1 p-0 ${styles.iconCcontainer}`}>
                {isLoading ? (
                  <TbLoader2 className={`animate-spin ${styles.icon}`} />
                ) : (
                  <img
                    className={`!p-0 ${styles.loader}`}
                    src={img1}
                    alt="wishlist"
                  />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
