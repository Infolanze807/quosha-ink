import { useEffect, useState } from "react";
import { CgShoppingBag } from "react-icons/cg";
import styles from "./index.module.scss";
import { useAppSelector } from "../../../../../../app/hooks";

const CartIcon = () => {
  const { totalItems } = useAppSelector((state) => state.cart);

  // console.log("totalItems", totalItems);

  const [bump, setBump] = useState(false);
  const [initialQuantity, setInitialQuantity] = useState(0);

  // ✅ Load initial quantity from localStorage on first render
  useEffect(() => {
    const storedQuantity = localStorage.getItem("totalQuantity");
    if (storedQuantity && !totalItems) {
      setInitialQuantity(parseInt(storedQuantity, 10));
    }
  }, [totalItems]);

  // ✅ Sync totalItems with localStorage whenever it changes
  useEffect(() => {
    if (totalItems === 0) {
      localStorage.removeItem("totalQuantity");
      setInitialQuantity(0);
    } else if (totalItems !== undefined) {
      localStorage.setItem("totalQuantity", totalItems.toString());
      setInitialQuantity(totalItems);
    }
  }, [totalItems]);

  // ✅ Determine the final quantity to display
  const totalQuantity = totalItems ?? initialQuantity;

  // console.log("quantity", totalQuantity);

  // ✅ Handle cart bump animation
  const iconStyles = bump
    ? `${styles.bump} ${styles.cart_icon}`
    : styles.cart_icon;

  const amountStyles =
    totalQuantity === 0 ? styles.no_items : styles.cart_amount;

  useEffect(() => {
    if (totalQuantity === 0) {
      return;
    } else {
      setBump(true);
    }

    const timer = setTimeout(() => {
      setBump(false);
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [totalQuantity]);

  return (
    <div className={iconStyles}>
      <CgShoppingBag className="text-black" />
      <div className={amountStyles}>
        <div>{totalQuantity}</div>
      </div>
    </div>
  );
};

export default CartIcon;
