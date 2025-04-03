import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import { AboutUs, Cart, Catalog, Contact, FailedOrder, Home, PayPalSuccess, Privacy, Product, ResetPage, SingleOrder, Terms, VerifyPage } from "../pages";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ForgotPage from "../pages/Forgot";
import OrderPage from "../pages/Order";
import ProfilePage from "../pages/Profile";
import WishlistPage from "../pages/Wishlist";
import Checkout from "../pages/Delievery/Checkout";
import Delivery from "../pages/Delievery/Delivery";
import SuccessOrder from "../pages/Order/SuccessOrder";
import NftAirdrop from "../pages/NftAirDrops/NftAirdrops";
import Admin from "../pages/Admin";
import WalletChecker from "../pages/WalletChecker/WalletChecker";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage/>
      },
      {
        path: "nft-drop",
        element: <NftAirdrop />
      },
      {
        path: "wallet-checker",
        element:<WalletChecker/>
      },
      {
        path: "forgot-password",
        element: <ForgotPage/>
      },
      {
        path: "passwordreset/:userId/:token",
        element: <ResetPage/>
      },
      {
        path: "verifyemail/:userId/:token",
        element: <VerifyPage/>
      },
      {
        path: "delivery-address",
        element: <Delivery/>
      },
      {
        path: "payment",
        element: <Checkout/>
      },
      {
        path: "order",
        element: <OrderPage/>
      },
      {
        path: "admin/orders/:userId",
        element: <OrderPage/>
      },
      {
        path: "order-success/:orderId",
        element: <SuccessOrder/>
      },
      {
        path: "failedOrder",
        element: <FailedOrder/>
      },
      {
        path: "about-us",
        element: <AboutUs/>
      },
      {
        path: "contact-us",
        element: <Contact/>
      },
      {
        path: "terms-and-conditions",
        element: <Terms/>
      },
      {
        path: "privacy-policy",
        element: <Privacy/>
      },
      {
        path: "payment/success",
        element: <PayPalSuccess />,
      },
      {
        path: "order-status/:orderId",
        element: <SingleOrder/>
      },
      {
        path: "admin/order-status/:userId/:orderId",
        element: <SingleOrder/>
      },
      {
        path: "wishlist",
        element: <WishlistPage/>
      },
      {
        path: "admin",
        element: <Admin/>
      },
      {
        path: "profile",
        element: <ProfilePage/>
      },
      {
        path: "catalog",
        element: <Catalog />,
        children: [
          {
            path: ":id",
            element: <Catalog />,
          },
        ],
      },
      {
        path: "products",
        children: [
          {
            path: ":id",
            element: <Product />,
          },
        ],
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);
