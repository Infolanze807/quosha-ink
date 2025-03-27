// export default Product;
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getSingleProduct,
  getSizeChart,
  resetSizeChart,
  productReset,
} from "../../features/product/productSlice";
import styles from "./index.module.scss";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { addToCart } from "../../features/cart/cartSlice";
import { CartItem } from "../../types/cart";
import { Variant } from "../../types/product"; // Removed the unused import of ProductType
import GoToTop from "../../components/components/GoToTop";
import Spinner from "../../components/components/Spinner";
import {
  getReviews,
  resetReview,
} from "../../features/review-rating/reviewRatingSlice";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { MdPinch } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { resetCoupons } from "../../features/coupon/couponSlice";

interface Product {
  sync_variants: {
    product: {
      product_id: string;
    };
  }[];
}

const Product = () => {
  const { product, isLoading } = useAppSelector((state) => state.product);
  // console.log("product111", product)
  const { sizechart } = useAppSelector((state) => state.product);
  // console.log("hy", sizechart);
  // console.log("pro", product?.sync_variants?.[0]?.product?.product_id);
  const productId = product?.sync_variants?.[0]?.product?.product_id;
  // const { reviews } = useAppSelector((state) => state.reviews);
  const { reviewsArray } = useAppSelector((state) => state.reviews);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    dispatch(resetSizeChart());
    dispatch(resetReview());
    
    if (id) {
      dispatch(getSingleProduct(Number(id)));
      dispatch(getReviews(id));
    }

    // Clean up/reset when unmounting the component
    return () => {
      dispatch(productReset());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (productId) {
      dispatch(getSizeChart(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product && product.sync_variants && product.sync_variants.length > 0) {
      setSelectedVariant(product.sync_variants[0]);
      const sizes = product.sync_variants.map((variant) => variant.size);
      setAvailableSizes([...new Set(sizes)]);
      const colors = product.sync_variants.map((variant) => variant.color);
      setAvailableColors([...new Set(colors)]);
      setSelectedSize(product.sync_variants[0].size);
      setSelectedColor(product.sync_variants[0].color);
    }
  }, [product]);

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    const variant = product?.sync_variants.find(
      (v) => v.size === size && v.color === selectedColor
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleColorSelection = (color: string) => {
    setIsImageLoaded(false);
    setSelectedColor(color);
    const variant = product?.sync_variants.find(
      (v) => v.color === color && v.size === selectedSize
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const addToCartHandler = () => {
    if (selectedVariant?.availability_status !== "active")
      return toast.error("Product is out of stock");

    setIsLoadingProduct(true);
    if (product && selectedVariant) {
      const previewFile = selectedVariant.files
        ? selectedVariant.files.find((file) => file.type === "preview")
        : null;
      const cartProduct: CartItem = {
        quantity: 1,
        product: {
          id: selectedVariant.id,
          name: selectedVariant.name,
          price: selectedVariant.retail_price,
          thumbnail_url: previewFile ? previewFile.preview_url : "",
          size: selectedVariant.size,
          external_id: selectedVariant.external_id,
          variants: selectedVariant.variants,
          synced: selectedVariant.synced,
          retailPrice: selectedVariant.retailPrice,
          sync_variants: selectedVariant.sync_variants,
          productId: selectedVariant.productId,
          variant_id: selectedVariant.variant_id,
          availability_status: selectedVariant.availability_status,
          sync_product_id: selectedVariant.sync_product_id,
        },
      };
      dispatch(resetCoupons());
      dispatch(addToCart(cartProduct)).then(() => {
        setIsLoadingProduct(false);
      });
    }
  };

  const handleOpen = () => {
    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const size_table = sizechart?.size_tables[0].measurements;

  function stripHtml(html: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  const route = [
    { name: "Home", route: "/" },
    { name: "Products", route: "/catalog/All" },
    { name: "Product Details", route: `/products/${id}` },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === availableColors.length - 5 ? prevIndex : prevIndex + 1
    );
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  if (isLoading) return <Spinner />;

  return (
    <section className={styles.section}>
      <div className={`${styles.container} main-container`}>
        <p className={styles.section_title_bottom}>
          {route?.map((item, index) => (
            <Link to={item.route} key={index}>
              {item.name}
              {index < 2 && <span>&nbsp;&gt;&nbsp;</span>}
            </Link>
          ))}
        </p>
        {selectedVariant && (
          <div
            className={`grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 lg:gap-20 md:gap-10 gap-10 ${styles.productContainer}`}
          >
            <div className={styles.productImageContainer}>
              {selectedVariant.files &&
              selectedVariant.files.length > 0 &&
              selectedVariant.files.find((file) => file.type === "preview") ? (
                <div className="relative">
                  <img
                    src={
                      selectedVariant.files.find(
                        (file) => file.type === "preview"
                      )?.preview_url
                    }
                    className={`w-full h-auto transition-opacity duration-300 ease-in-out ${
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    }`} // Transition the opacity based on the image load state
                    onLoad={handleImageLoad} // Trigger state change on image load
                  />
                  {selectedVariant.availability_status === "active" ? null : (
                    <div className="absolute bg-slate-50 bg-opacity-50 text-center w-full lg:py-24 md:py-24 py-16 bottom-0 rounded-b-3xl uppercase font-bold text-2xl text-gray-800">
                      Out Of Stock
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src="/default-image.png"
                  className={styles.image}
                  alt="No preview available"
                />
              )}
            </div>
            <div className={styles.productDetailsContainer}>
              <div className={styles.titleContainer}>
                <div
                  className={`${styles.title} border-gray-300 border-b-2 pb-5`}
                >
                  {selectedVariant.name}
                </div>
              </div>
              <div className={styles.colorContainer}>
                <div
                  className={`text-center font-semibold text-2xl py-3 border border-gray-500 rounded-full w-max px-7 mx-auto mb-5 ${styles.title}`}
                >
                  {selectedVariant.color}
                </div>
                <div className={styles.categories}>
                <div className="relative flex items-center justify-center px-8">
                    <button
                      className="absolute left-0 z-10 lg:p-5 md:p-5 p-2 bg-[--three-color] rounded-full hover:bg-gray-900 font-extrabold"
                      onClick={handlePrev}
                    >
                      &lt;
                    </button>
                    <div
                      className={`flex lg:gap-5 md:gap-5 gap-3 overflow-hidden ${styles.slider}`}
                    >
                      {availableColors.slice(currentIndex, currentIndex + 5).map((color) => {
                        const variant = product?.sync_variants.find(
                          (v) => v.color === color
                        );
                        const colorThumbnail = variant?.files?.find(
                          (file) => file.type === "preview"
                        )?.thumbnail_url;

                        return (
                          <div
                            className={`text-center ${styles.button}`}
                            key={color}
                          >
                            <input
                              className="hidden"
                              type="radio"
                              id={color}
                              name="color"
                              onChange={() => handleColorSelection(color)}
                              checked={selectedColor === color}
                            />
                            <label
                              className={`btn btn-default ${
                                selectedColor === color ? styles.selected : ""
                              }`}
                              htmlFor={color}
                            >
                              {colorThumbnail ? (
                                <div className="flex flex-col flex-wrap bg-white">
                                  <img
                                    src={colorThumbnail}
                                    alt={color}
                                    className={`lg:w-32 md:w-28 w-20  ${styles.colorThumbnail}`}
                                  />
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`w-28 h-28 rounded-full ${styles.colorPreview}`}
                                    style={{ backgroundColor: color }}
                                  />
                                  <p>{color}</p>
                                </div>
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="absolute right-0 z-10 lg:p-5 md:p-5 p-2 bg-[--three-color] rounded-full hover:bg-gray-900 font-extrabold"
                      onClick={handleNext}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.sizeColorContainer}>
                <div className={styles.sizeContainer}>
                  <div className={`${styles.title} text-center`}>
                    Select Size:
                  </div>
                  <div className={`${styles.categories}`}>
                    <div className={styles.buttonContainer}>
                      {availableSizes.map((size) => (
                        <div className={styles.button} key={size}>
                          <input
                            type="radio"
                            id={size}
                            name="size"
                            onChange={() => handleSizeSelection(size)}
                            checked={selectedSize === size}
                          />
                          <label className="btn btn-default" htmlFor={size}>
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center text-blue-500 pt-2">
                    <div className="hover:cursor-pointer" onClick={handleOpen}>
                      <div className="">
                        <MdPinch className="mx-auto text-3xl" />
                      </div>
                      <p className="font-semibold text-xl">Check Size Chart</p>
                    </div>
                  </div>
                </div>
                {isPopupOpen && (
                  <div className="fixed inset-0 flex py-5 lg:py-0 md:py-0 justify-end bg-black bg-opacity-50 px-5 lg:px-0 md:px-0 overflow-y-auto z-[103]">
                    <div className="bg-white p-5 w-full max-w-5xl">
                      <div className="flex justify-between">
                        <div className="text-2xl font-semibold">Size Chart</div>
                        <div
                          className="hover:cursor-pointer"
                          onClick={handleClose}
                        >
                          <IoClose className="text-3xl" />
                        </div>
                      </div>
                      <div className="p-5 mb-5 mt-7 bg-[--main-color]">
                        <table className="min-w-full bg-white border">
                          <thead>
                            <tr>
                              <th className="py-3 px-4 border font-extrabold">
                                Available Size
                              </th>
                              {size_table.map((size: any, index: number) => (
                                <th
                                  key={index}
                                  className="py-3 px-4 border font-extrabold"
                                >
                                  {size.type_label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {size_table[0].values.map((value: any, rowIndex: number) => (
                              <tr key={rowIndex}>
                                <td className="py-2 px-4 font-bold text-center border">
                                  {value.size}
                                </td>
                                {size_table.map((size: any, colIndex: number) => (
                                  <td
                                    key={colIndex}
                                    className="py-2 px-4 font-bold text-center border"
                                  >
                                    {size.values[rowIndex].min_value &&
                                    size.values[rowIndex].max_value
                                      ? `${size.values[rowIndex].min_value} - ${size.values[rowIndex].max_value}`
                                      : size.values[rowIndex].value ||
                                        size.values[rowIndex].size}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-5 pt-0 bg-[--main-color]">
                        <div className="font-semibold text-lg text-center">
                          *Garment Measurements in Inches
                        </div>
                        <div className="font-bold lg:text-3xl md:text-3xl text-2xl pt-4 pb-1">
                          How to measure Yourself:
                        </div>
                        <div className="font-semibold lg:text-xl md:text-xl text-lg">
                          {stripHtml(sizechart.size_tables[0].description)}
                        </div>
                        <div className="pt-10">
                          <img
                            className="lg:w-[250px] md:w-[250px] w-72 mx-auto"
                            src={sizechart.size_tables[0].image_url}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.priceContainer}>
                <div className={styles.title}>Price:</div>
                <div className={styles.price}>
                  USD {selectedVariant.retail_price}
                </div>
              </div>
              <div
                className={`${styles.addToCartContainer} border-t-2 pt-5 border-gray-300`}
              >
                <div
                  className={`${styles.addToCart}`}
                  onClick={addToCartHandler}
                >
                  {isLoadingProduct ? (
                    <Spinner className={"addToCartSm"} />
                  ) : (
                    "Add to Cart"
                  )}
                </div>
                <Link to={`/catalog/All`} className={styles.continueShopping}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
        {reviewsArray && reviewsArray.length > 0 && (
          <div className="">
            <div className="text-3xl font-bold py-5">Reviews</div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-10 md:gap-10 gap-5">
              {reviewsArray.map((review: any) => (
                <div key={review._id} className="bg-white p-5">
                  <p className="font-bold lg:text-2xl md:text-2xl text-xl bg-[--main-color] p-2">
                    {review.name}
                  </p>
                  <p className="flex items-center gap-2 font-bold lg:text-2xl md:text-2xl text-xl pt-1">
                    Rating:
                    <span className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`lg:text-3xl md:text-3xl text-2xl cursor-pointer ${
                            index < review?.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </span>
                  </p>
                  <p className="font-bold lg:text-2xl md:text-2xl text-xl">
                    Review:&nbsp;{review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <GoToTop />
    </section>
  );
};

export default Product;
