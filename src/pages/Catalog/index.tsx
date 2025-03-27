import { useNavigate, useParams, useLocation } from "react-router";
import styles from "./index.module.scss";
import ProductCard from "../../components/components/ProductCard";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getCategory, getProducts, searchProducts } from "../../features/product/productSlice";
import { useEffect } from "react";
import { navCollection } from "../../data/navItems";
import Spinner from "../../components/components/Spinner";
import GoToTop from "../../components/components/GoToTop";
import Button from "../../components/components/Button";
import { MdArrowBack } from "react-icons/md";
import { ROUTES } from "../../constants/Route";
import { Exclusive, Anons, Merch } from "../About/Sections";
import productPrices from "../../../priceProducts.json";

const Catalog = () => {
  let { id } = useParams();
  const location = useLocation();
  const { filteredProducts, isLoading } = useAppSelector((state) => state.product);

  // console.log("Hello", filteredProducts)
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");

    if (query) {
      dispatch(searchProducts(query));
      return;
    }

    if (!id) {
      const newUrl = window.location.pathname + "/All";
      window.history.pushState({ path: newUrl }, "", newUrl);

      id = "All";
    }

    const category = navCollection.find((item) => item.name === id?.toString());
    if (category?.value !== "all") {
      const pathUrl = ROUTES.find((item) => item.name.toLowerCase() === category?.value.toLowerCase());
  if (pathUrl) {
    dispatch(getCategory(pathUrl.url.toLowerCase()));
  } else {
    console.error(`No pathUrl found for category value: ${category?.value}`);
  }
} else {
  dispatch(getProducts());
}
}, [id, location.search]);

 const findPrice = (productName: string) => {
    const product = productPrices.productPrice.find(item => item.productName === productName);
    return product ? parseFloat(product.productPrice.replace('$', '')) : 0;
  };

const renderSection = () => {
  switch (id?.toLowerCase()) {
    case 'quosha-exclusive':
      return <Exclusive />;
    case 'merch 3.0':
      return <Merch />;
    case 'anons':
      return <Anons />;
    default:
      return null;
  }
};

  const convertedString = id
    ?.split("-")
    ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
    ?.join(" ");

  if (isLoading) return <Spinner />;
  return (
    <div className={`${styles.container} main-containe`}>
      <div className="bg-white ">
        {renderSection()}
      </div>
      <div className={`${styles.titleContainer} main-container`}>
        <Button className={styles.iconContainer} onClick={() => navigate(-1)}>
          <MdArrowBack className={styles.icon} />
        </Button>
        <div className={styles.title}>{convertedString}</div>
      </div>
      <div className={`${styles.productList} main-container`}>
        {filteredProducts?.map((product, index) => {
          const price = findPrice(product.name);
          return (
            <ProductCard
            {...product}
            id={product.id}
            key={index.toString()}
            title={product.name}
            //  price={product.retailPrice ? Number(product.retailPrice) : 0}
            price={price} 
            image={product.thumbnail_url}
            />
          );
        })}
      </div>
      <GoToTop />
    </div>
  );
};

export default Catalog;
