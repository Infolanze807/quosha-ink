import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../../../app/hooks";
import Button from "../../../components/components/Button";
import Modal from "../../../components/components/Modal";
import styles from "./index.module.scss";
import { useMediaQuery } from "react-responsive";
import CartProduct from "../CartProduct";
import { CartItem } from "../../../types/cart";
import { IoClose } from "react-icons/io5";

interface CartModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartModal: React.FC<CartModalProps> = ({ show, setShow }) => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const modalRef = useRef<HTMLDivElement>(null);

  const isBigScreen = useMediaQuery({
    query: "(min-width: 496px)",
  });

  const totalPrice = cartItems.reduce(
    (a, c) => a + c.quantity * c.product.price,
    0
  );

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  return (
    <Modal isOpen={show} onClose={handleClose} isRight={isBigScreen} >
      <div ref={modalRef} className={` ${styles.container}`}>
        <div className="flex items-center justify-between border-b">
          <div className="ps-6 text-3xl">Your Cart</div>
          <div>
            <Button
                className={`bg-transparent text-black text-5xl hover:bg-transparent`}
                onClick={handleClose}
              >
                <IoClose />
              </Button>
          </div>
        </div>
        <div className={styles.content}>
          {cartItems.map((item: CartItem) => (
            <CartProduct
              key={item.product.id}
              item={item}
              onClick={handleClose}
            />
          ))}
        </div>
        <div className={styles.footer_container}>
          <div className={styles.footer_wrapper}>
            <div className={`px-7 pt-7 ${styles.footer_total}`}>
              <p>
                <span>Total</span>
              </p>
              <p>
                <span>{totalPrice.toFixed(2)}</span>
              </p>
            </div>
            <div className={styles.buttons_wrapper}>
              <div className={styles.buttons_container}>
                <Button
                  className={`p-6 text-white text-2xl font-medium bg-[#f3844a] text-center w-full`}
                  to="/cart"
                  onClick={handleClose}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CartModal;
