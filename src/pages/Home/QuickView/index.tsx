// import { useEffect } from "react";

// import styles from "./index.module.scss";
// import { useAppDispatch, useAppSelector } from "../../../app/hooks";
// import {
//   getCategory,
//   getProducts,
// } from "../../../features/product/productSlice";
// import ProductCard from "../../../components/components/ProductCard";
// import { navQuick } from "../../../data/navItems";
// import productPrices from "../../../../priceProducts.json";

// const QuickView = () => {
//   const { filteredProducts } = useAppSelector((state) => state.product);

//   // console.log("Filtered products:", filteredProducts);
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(getProducts()); // Fetch all products initially
//   }, [dispatch]);

//   const handleCategory = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
//     const target = e.target as HTMLInputElement;
//     // console.log("Category selected:", target.value);

//     if (target.value === "all") {
//       dispatch(getProducts()); // Fetch all products
//     } else {
//       dispatch(getCategory(target.value.toLowerCase())); // Filter products by category
//     }
//   };

//   const findPrice = (productName: string) => {
//     const product = productPrices.productPrice.find(item => item.productName === productName);
//     return product ? parseFloat(product.productPrice.replace('$', '')) : 0;
//   }

//   return (
//     <section className={styles.section}>
//       <div className={`${styles.container} main-container`}>
//         <p className={`text-center lg:pb-2 ${styles.section_title_top}`}>
//           Featured Products
//         </p>
//         <div className={styles.categories}>
//           <div className={styles.buttonContainer}>
//             {navQuick.map((item, index) => {
//               return (
//                 <div className={styles.button} key={item.name}>
//                   <input
//                     type="radio"
//                     id={item.name}
//                     name="category"
//                     value={item.value}
//                     onClick={(e) => handleCategory(e)}
//                     defaultChecked={index === 0}
//                   />
//                   <label className="btn btn-default" htmlFor={item.name}>
//                     {item.name}
//                   </label>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <div className={styles.productList}>
//   {filteredProducts?.slice(0, 10)?.map((product) => {
//     const price = findPrice(product.name); // Find the price for each product
//     return (
//       <ProductCard
//         id={product.id}
//         key={product.external_id}
//         title={product.name}
//         price={price} 
//         image={product.thumbnail_url}
//         external_id={product.external_id}
//       />
//     );
//   })}
// </div>
//       </div>
//     </section>
//   );
// };

// export default QuickView;

import { useEffect } from "react";

import styles from "./index.module.scss";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  getCategory,
  getProducts,
} from "../../../features/product/productSlice";
import ProductCard from "../../../components/components/ProductCard";
import { navQuick } from "../../../data/navItems";
import productPrices from "../../../../priceProducts.json";

const QuickView = () => {
  const { filteredProducts } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProducts()); // Fetch all products initially
  }, [dispatch]);

  const handleCategory = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const target = e.target as HTMLInputElement;

    if (target.value === "all") {
      dispatch(getProducts()); // Fetch all products
    } else {
      dispatch(getCategory(target.value.toLowerCase())); // Filter products by category
    }
  };

  const findPrice = (productName: string) => {
    const product = productPrices.productPrice.find(item => item.productName === productName);
    return product ? parseFloat(product.productPrice.replace('$', '')) : 0;
  };

  return (
    <section className={styles.section}>
      <div className={`${styles.container} main-container`}>
        <p className={`text-center lg:pb-2 ${styles.section_title_top}`}>
          Featured Products
        </p>
        <div className={styles.categories}>
          <div className={styles.buttonContainer}>
            {navQuick.map((item, index) => {
              return (
                <div className={styles.button} key={item.name}>
                  <input
                    type="radio"
                    id={item.name}
                    name="category"
                    value={item.value}
                    onClick={(e) => handleCategory(e)}
                    defaultChecked={index === 0}
                  />
                  <label className="btn btn-default" htmlFor={item.name}>
                    {item.name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.productList}>
          {filteredProducts?.filter(product => product.name.includes("Ft")).slice(0, 10).map((product) => {
            const price = findPrice(product.name);
            return (
              <ProductCard
                id={product.id}
                key={product.external_id}
                title={product.name}
                price={price}
                image={product.thumbnail_url}
                external_id={product.external_id}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickView;
