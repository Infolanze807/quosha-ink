import { useEffect, useState } from "react";

import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { AnimatePresence } from "framer-motion";
import CartModal from "../../../pages/Cart/CarModal";
import Footer from "./Footer";
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  const [showModal, setShow] = useState(false); 
  const location = useLocation();

  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = showModal ? "hidden" : "auto";
    }
  }, [showModal]);

  const handleShow = () => {
    setShow(true);
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <div id="layout">
      {!isAdminRoute && <Header handleShow={handleShow} />}
      {!isAdminRoute && <div className="py-12"></div>}
        <main>
          <Outlet />
        </main>
        {!isAdminRoute && <Footer />}
      </div>
      {/* Admin */}

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showModal && <CartModal show={showModal} setShow={setShow} />}
      </AnimatePresence>
      <Toaster />
    </>
  );
};

export default Layout;
