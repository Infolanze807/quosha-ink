import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { createOrder, createPayment } from "../../features/order/orderSlice";
import Web3 from "web3";
import toast from "react-hot-toast";
import { PiShareNetworkLight } from "react-icons/pi";
import { MdOutlineAccountBalance } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import Button from "../../components/components/Button";

const Checkout: React.FC = () => {
  const API_URL = import.meta.env.VITE_APP_SEI_PRICE;
  const location = useLocation();
  const [network, setNetwork] = useState<string | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendToAddress, setSendToAddress] = useState(
    import.meta.env.VITE_APP_OWNER_ACCOUNT
  );
  const [txHash, setTxHash] = useState("");
  const [seiToUsdRate, setSeiToUsdRate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [priceInSei, setPriceInSei] = useState("");
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { cartItems } = useAppSelector((state) => state.cart);
  const selectedAddress = useAppSelector(
    (state) => state.delivery.selectedAddress
  );
  const discountedAmount = useAppSelector(
    (state) => state.coupons.discountedAmount
  );
  // const { shippingRates, taxRates } = useAppSelector((state) => state.order);
  const { taxRate, shippingRate,} =
  location.state || {};

  const calculateTotalPrice = (
    subTotalPrice: number,
    shippingRate: number,
    taxRate: number
  ) => {
    return (
      subTotalPrice -
      discount +
      (shippingRate || 0) +
      (taxRate * subTotalPrice || 0)
    );
  };

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   if (!token) {
  //     navigate("/login")
  //   }
  //   if (window.ethereum) {
  //     window.ethereum.on("chainChanged", handleChainChanged);
  //     window.ethereum.on("accountsChanged", updateAccountAndBalance);
  //   }

  //   return () => {
  //     if (window.ethereum) {
  //       window.ethereum.removeListener("chainChanged", handleChainChanged);
  //       window.ethereum.removeListener(
  //         "accountsChanged",
  //         updateAccountAndBalance
  //       );
  //     }
  //   };
  // }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      navigate("/login");
    }
    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("accountsChanged", updateAccountAndBalance);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener(
          "accountsChanged",
          updateAccountAndBalance 
        );
      }
    };
  }, []);

  // const shippingRate = shippingRates?.[0]?.rate
  //   ? parseFloat(shippingRates[0].rate)
  //   : 0;
  // const taxRate = taxRates?.rate ? parseFloat(taxRates.rate) : 0;
  const subTotalPrice = cartItems.reduce(
    (a, c) => a + c.quantity * c.product.price,
    0
  );
  const discount = discountedAmount;
  // const lastPrice =
  //   calculateTotalPrice(subTotalPrice, shippingRate, taxRate).toFixed(2);

  // const lastPrice = (
  //   calculateTotalPrice(subTotalPrice, shippingRate, taxRate)
  // ).toFixed(2);

  const lastPrice = 1;

  const connectWallet = async () => {
    try { 
      if (!(window as any).ethereum) {
        return alert("MetaMask is not installed");
      }

      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      // console.log("Wallet connected:", accounts[0]);

      const chainIdHex = await (window as any).ethereum.request({
        method: "eth_chainId",
      });
      const networkId = parseInt(chainIdHex, 16);
      // console.log("Chain ID returned by MetaMask:", networkId);

      // switch (networkId) {
      //   case 713715:
      //     setNetwork("SEI DEVNET");
      //     await updateAccountAndBalance();
      //     break;
      //   default:
      //     setNetwork(null);
      //     setCurrentAccount(null);
      //     setBalance(null);
      //     alert("Please Switch To SEI DEVNET Network");
      //     await switchToSeiDevNet();
      //     break;
      // }

      switch (networkId) {
        case 1329:
          setNetwork("SEI Mainnet");
          await updateAccountAndBalance();
          break;
        default:
          setNetwork(null);
          setCurrentAccount(null);
          setBalance(null);
          alert("Please Switch To SEI MAINNET Network");
          await switchToSeiMainnet();
          break;
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while connecting to the wallet");
    }
  };

  // const switchToSeiDevNet = async () => {
  //   const networks = {
  //     SEI_DEVNET: {
  //       chainId: "0xae3f3",
  //       chainName: "SEI DEVNET",
  //       nativeCurrency: {
  //         name: "SEI DEVNET",
  //         symbol: "SEI",
  //         decimals: 18,
  //       },
  //       rpcUrls: ["https://evm-rpc-arctic-1.sei-apis.com"],
  //       blockExplorerUrls: ["https://seistream.app"],
  //     },
  //   };

  //   const params = networks.SEI_DEVNET;

  //   try {
  //     await (window as any).ethereum.request({
  //       method: "wallet_addEthereumChain",
  //       params: [params],
  //     });
  // //Network switch was successful, so reconnect wallet
  // await connectWallet();
  // toast.success("Successfully switched to SEI DEVNET and reconnected!");
  //   } catch (error) {
  //     console.error("Failed to switch network:", error);
  //     alert("Failed to switch network.");
  //   }
  // };

  const switchToSeiMainnet = async () => {
    const networks = {
      SEI_MAINNET: {
        chainId: "0x531",
        chainName: "SEI Mainnet",
        nativeCurrency: {
          name: "SEI Mainnet",
          symbol: "SEI",
          decimals: 18,
        },
        rpcUrls: ["https://evm-rpc.sei-apis.com"],
        blockExplorerUrls: ["https://seistream.app"],
      },
    };

    const params = networks.SEI_MAINNET;

    try {
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params],
      });
      //Network switch was successful, so reconnect wallet
      await connectWallet();
      toast.success("Successfully switched to SEI MAINNET and reconnected!");
    } catch (error) {
      console.error("Failed to switch network:", error);
      alert("Failed to switch network.");
    }
  };

  // const updateAccountAndBalance = async () => {
  //   const web3 = new Web3(window.ethereum as any);
  //   const accounts = await web3.eth.getAccounts();
  //   if (accounts.length > 0) {
  //     setCurrentAccount(accounts[0]);
  //     // console.log("Maanish", accounts)
  //     const balanceWei = await web3.eth.getBalance(accounts[0]);
  //     const balanceEth = web3.utils.fromWei(balanceWei, "ether");
  //     setBalance(balanceEth);
  //   } else {
  //     setBalance(null);
  //     setCurrentAccount(null);
  //     setNetwork(null);
  //    // Disable claim button if no accounts
  //   }

  //   // console.log("Current account:", accounts[0]);
  //   // console.log("Balance updated:",balance,"SEI");
  // };
  const updateAccountAndBalance = async () => {
    const web3 = new Web3(window.ethereum as any);
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
      console.log("Maanish", accounts)
      const balanceWei = await web3.eth.getBalance(accounts[0]);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      setBalance(balanceEth);
    } else {
      setBalance(null);
      setCurrentAccount(null);
      setNetwork(null);
      // Disable claim button if no accounts
    }

    // console.log("Current account:", accounts[0]);
    // console.log("Balance updated:",balance,"SEI");
  };
  // const handleChainChanged = async (chainIdHex: string) => {
  //   const networkId = parseInt(chainIdHex, 16);

  //   switch (networkId) {
  //     case 713715:
  //         setNetwork("SEI DEVNET");
  //         await updateAccountAndBalance();
  //         break;
  //       default:
  //         setNetwork(null);
  //         setCurrentAccount(null);
  //         setBalance(null);
  //         alert("Please Switch To SEI DEVNET Network");
  //         await switchToSeiDevNet();
  //         break;
  //   }
  // };
  const handleChainChanged = async (chainIdHex: string) => {
    const networkId = parseInt(chainIdHex, 16);

    // switch (networkId) {
    //   case 713715:
    //       setNetwork("SEI DEVNET");
    //       await updateAccountAndBalance();
    //       break;
    //     default:
    //       setNetwork(null);
    //       setCurrentAccount(null);
    //       setBalance(null);
    //       alert("Please Switch To SEI DEVNET Network");
    //       await switchToSeiDevNet();
    //       break;
    // }
    switch (networkId) {
      case 1329:
        setNetwork("SEI Mainnet");
        await updateAccountAndBalance();
        break;
      default:
        setNetwork(null);
        setCurrentAccount(null);
        setBalance(null);
        alert("Please Switch To SEI MAINNET Network");
        await switchToSeiMainnet();
        break;
    }
  };
  const sendTransaction = async () => {
    try {
      if (!(window as any).ethereum) {
        return alert("MetaMask is not installed");
      }

      if (!currentAccount) {
        await connectWallet();
        if (!currentAccount) {
          return;
        }
      }

      if (!sendToAddress || !priceInSei) {
        alert("Please enter both address and amount to send.");
        return;
      }

      const web3 = new Web3((window as any).ethereum);
      const balanceWei = await web3.eth.getBalance(currentAccount);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      const amountWei = web3.utils.toWei(priceInSei, "ether");

      if (parseFloat(lastPrice) > parseFloat(balanceEth)) {
        alert("Insufficient balance to send this transaction.");
        return;
      }

      const nonce = await web3.eth.getTransactionCount(
        currentAccount,
        "latest"
      );
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = 21000;

      const tx = {
        from: currentAccount,
        to: sendToAddress,
        value: amountWei,
        gas: gasLimit,
        gasPrice: gasPrice,
        nonce: nonce,
      };
      const txReceipt = await web3.eth.sendTransaction(tx);
      const transactionHash = txReceipt.transactionHash.toString();
      // console.log("Transaction sent. TxHash:", transactionHash);
      setTxHash(transactionHash);
      setSendToAddress("");

      return txReceipt.transactionHash;
    } catch (error) {
      console.error("Failed to send transaction:", error);
      alert("Failed to send transaction.");
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User is not logged in.");
      navigate("/login");
      return;
    }

    if (!paymentMethod) {
      setLoading(false);
      toast.error("Please select a payment method.");
      return;
    }

    if (selectedAddress && cartItems.length > 0) {
      const orderData = {
        userId,
        recipient: selectedAddress,
        items: cartItems.map((item) => ({
          sync_variant_id: item.product.id,
          quantity: item.quantity,
          name: item.product.name,
          productId: item.product.sync_product_id,
          image: item.product.thumbnail_url,
          size: item.product.size,
          price: item.product.price,
        })),
        shipping: "STANDARD",
        subAmount: subTotalPrice,
        discount: discount,
        shippingRate: shippingRate,
        taxRate: taxRate * subTotalPrice,
        totalAmount: lastPrice,
        method: paymentMethod,
        transactionId: txHash,
        // amount: priceInSei,
        currency: "SEI",
        walletAddress: currentAccount,
        SEI: lastPrice,
        USD: priceInSei,
      };

      try {
        if (paymentMethod === "PayPal") {
          sessionStorage.setItem("orderData", JSON.stringify(orderData));
          const paymentData = {
            total: parseFloat(lastPrice),
            currency: "USD",
          };
          const paymentResponse = await dispatch(createPayment(paymentData));
          if (paymentResponse.meta.requestStatus === "fulfilled") {
            const approvalUrl = paymentResponse.payload.approval_url;
            window.location.href = approvalUrl; // Redirect to PayPal for payment approval
          } else {
            toast.error("Failed to create PayPal payment.");
          }
        } else if (paymentMethod === "MetaMask") {
          const txHash = await sendTransaction();
          if (txHash) {
            const txHAshString = txHash.toString();

            orderData.transactionId = txHAshString;
            const orderResponse = await dispatch(createOrder(orderData));
            if (orderResponse.meta.requestStatus === "fulfilled") {
              const orderId = orderResponse.payload.id;
              setLoading(false);
              navigate(`/order-success/${orderId}`);
            } else {
              toast.error("Failed to place order.");
            }
          } else {
            toast.error("Transaction failed, order not placed.");
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to place order.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error(
        "Please select a delivery address and add items to the cart."
      );
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    const fetchSeiToUsdRate = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch SEI to USD rate");
        }
        const data = await response.json();
        const rate = data.Price;
        setSeiToUsdRate(rate);
        setPriceInSei((parseFloat(lastPrice) / rate).toFixed(2));
      } catch (error) {
        console.error("Failed to fetch SEI to USD rate:", error);
      }
    };
    console.log("SEI to USD Rate:", seiToUsdRate);
    fetchSeiToUsdRate();
  }, [lastPrice]);

  if (loading) {
    return (
      <div className="fixed inset-0 p-5 bg-black bg-opacity-40 flex justify-center items-center z-[99]">
        <div className="lg:text-3xl md:text-2xl text-xl font-bold uppercase text-white text-opacity-80">
          Please Wait....
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 py-16 px-4 lg:px-52 md:px-28">
      <div className="flex items-center justify-center gap-4  lg:text-2xl md:text-2xl text-xl font-semibold pb-10 border-b-2 border-[#adadad]">
        <div className="uppercase">Bag</div>---------
        <Link to="/delivery-address" className="uppercase">
          Address
        </Link>
        ---------
        <div className="uppercase font-extrabold">Payment</div>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 lg:p-10 md:p-10 p-5">
        <div className="lg:col-span-2 md:col-span-2">
          <div className="text-2xl font-bold pt-7 pb-4">Delivery Address</div>
          {selectedAddress ? (
            <div className="lg:flex md:flex lg:justify-between lg:items-center md:justify-between md:items-center border bg-gray-50 lg:p-10 md:p-10 p-7 shadow">
              <div>
                {selectedAddress.name && (
                  <div className="font-bold text-2xl pb-0.5">
                    Deliver To:{" "}
                    <span>
                      {selectedAddress.name}, {selectedAddress.phonenumber}
                    </span>
                  </div>
                )}
                {selectedAddress.name2 && (
                  <div className="font-bold text-2xl pb-0.5">
                    Deliver To:{" "}
                    <span>
                      {selectedAddress.name2}, {selectedAddress.phonenumber2}
                    </span>
                  </div>
                )}
                {selectedAddress.city && (
                  <div className="font-bold text-xl">
                    {selectedAddress.address1}, {selectedAddress.address2},{" "}
                    {selectedAddress.city}, {selectedAddress.state_code},{" "}
                    {selectedAddress.state_name}, {selectedAddress.country_code}
                    , {selectedAddress.country_name}, {selectedAddress.zip}
                  </div>
                )}
                {selectedAddress.city2 && (
                  <div className="font-bold text-xl">
                    {selectedAddress.address12}, {selectedAddress.address22},{" "}
                    {selectedAddress.city2}, {selectedAddress.state_code2},{" "}
                    {selectedAddress.state_name2},{" "}
                    {selectedAddress.country_code2},{" "}
                    {selectedAddress.country_name2}, {selectedAddress.zip2}
                  </div>
                )}
                {selectedAddress.email && (
                  <div className="font-bold text-xl pt-1">
                    Email :- {selectedAddress.email}
                  </div>
                )}
                {selectedAddress.email2 && (
                  <div className="font-bold text-xl pt-1">
                    Email :- {selectedAddress.email2}
                  </div>
                )}
              </div>
              <div className="text-center lg:pt-0 md:pt-0 pt-8">
                <Link
                  to="/delivery-address"
                  className="text-xl font-bold px-8 py-3 border bg-[--main-color] rounded border-black"
                >
                  Change
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex justify-between bg-gray-50 items-center border p-10 shadow">
              <div className="font-bold  text-xl">
                No delivery address selected
              </div>
              <Link
                to="/delivery-address"
                className="text-xl font-bold px-8 py-3 border bg-[--main-color] rounded border-black"
              >
                Select Address
              </Link>
            </div>
          )}
          <div className="text-2xl font-bold pt-7 pb-4">
            Choose Payment Mode
          </div>
          <div className="border p-10 bg-gray-50 shadow">
            <div className="text-2xl font-extrabold flex items-center gap-10 border py-2 px-5 rounded w-max bg-white mx-auto">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="PayPal"
                onChange={() => handlePaymentMethodChange("PayPal")}
              />
              <label
                htmlFor="paypal"
                className="flex items-center flex-row gap-3"
              >
                <img
                  className="w-12"
                  src="https://cdn.freebiesupply.com/logos/large/2x/paypal-icon-logo-png-transparent.png"
                  alt="PayPal"
                />
                <div>PayPal</div>
              </label>
            </div>

            <div className="text-2xl font-extrabold flex items-center gap-10 border mt-5 py-2 px-5 rounded w-max bg-white mx-auto">
              <input
                type="radio"
                id="metamask"
                name="paymentMethod"
                value="MetaMask"
                onChange={() => {
                  handlePaymentMethodChange("MetaMask");
                  connectWallet();
                }}
              />
              <label
                htmlFor="metamask"
                className="flex items-center flex-row gap-3"
              >
                <img
                  className="w-14"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"
                  alt="MetaMask"
                />
                <div>MetaMask</div>
              </label>
            </div>
          </div>

          {currentAccount && (
            <div className="data pt-5">
              <div className="bg-gray-50 p-10 shadow-md">
                <p className="flex items-center text-2xl font-semibold gap-2 pb-1">
                  <IoWalletOutline className="text-3xl" />
                  <span>
                    Wallet Address: <span>{currentAccount}</span>
                  </span>
                </p>
                <p className="flex items-center text-2xl font-semibold gap-2 pb-1">
                  <MdOutlineAccountBalance className="text-3xl" />
                  <span>Wallet Balance:</span> {balance} SEI ({network})
                </p>
                <p className="flex items-center text-2xl font-semibold gap-2">
                  <PiShareNetworkLight className="text-3xl" />
                  <span>Wallet Network:</span> {network}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="lg:border-s-2 md:border-s-2 border-[#adadad] p-10">
          <div className="font-extrabold text-2xl pb-2">Order Summary</div>
          <div>
            <div className="text-xl font-extrabold py-5">Price Details</div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-xl font-bold">Sub Total</span>
              <span className="text-xl font-bold">${subTotalPrice}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-xl font-bold">Discount Price</span>
              <span className="text-xl font-bold">${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-xl font-bold">Tax Rate</span>
              <span className="text-xl font-bold">
                {/* {taxRate} */}
                {taxRate
                ? `(${(taxRate * 100).toFixed(3)}%) $${(taxRate * subTotalPrice).toFixed(2)}`
                : "Free"}

              </span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-xl font-bold">Shipping Rate</span>
              <span className="text-xl font-bold">
                {shippingRate}
                {/* {shippingRates.length > 0
                  ? `$${shippingRates[0].rate}`
                  : "Free"} */}
              </span>
            </div>
            <div className="flex justify-between items-center border-t-2 border-[#adadad] pt-4">
              <span className="text-xl font-extrabold">Total Amount</span>
              {/* <span className="text-xl font-extrabold">${lastPrice}</span> */}
              <span className="text-xl font-extrabold">${lastPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-extrabold">Total Amount Sei</span>
              <span className="text-xl font-extrabold">SEI {priceInSei}</span>
            </div>
          </div>
          <div className="pt-10 text-center">
            <Button
              onClick={handlePlaceOrder}
              className="bg-[#f3844a] hover:bg-[#f3844a] w-full rounded-t-none rounded-b-lg rounded-md text-white text-xl font-bold px-10 py-4 hover:text-gray-200"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
