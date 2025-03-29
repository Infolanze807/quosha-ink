import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ABI } from "./ABI.js";
import { checkEligibility, nftDrop } from "../../features/order/orderSlice.js";
import { RootState } from "../../app/store.js";
import img from "../../images/Nft.png";
import { useAppSelector, useAppDispatch } from "../../app/hooks.js";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import Spinner from "../../components/components/Spinner/index.js";
import Confetti from "react-confetti";
import { useNavigate } from "react-router";
// import { useWindowSize } from "react-use";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const NftAirdrop: React.FC = () => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [nftBalance, setNftBalance] = useState<number | null>(null);
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [recipientTokenIds, setRecipientTokenIds] = useState<string[]>([]);
  const [isStep1Complete, setIsStep1Complete] = useState<boolean>(false);
  const [isStep2Complete, setIsStep2Complete] = useState<boolean>(false);
  const [isStep3Complete, setIsStep3Complete] = useState<boolean>(false);
  const [isClaimEnabled, setIsClaimEnabled] = useState<boolean>(false);
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const PhaseEnum = {
    ANONS: { name: "ANONS", numTokens: 5 },
    QUOLABS: { name: "QUOLABS", numTokens: 4 },
    PUBLIC: { name: "PUBLIC", numTokens: 2 },
  };

  const ContractAdd = import.meta.env.VITE_APP_CONTRACT_ADD;
  const Private_key = import.meta.env.VITE_APP_PRIVATE_KEY;
  const Owner = import.meta.env.VITE_APP_OWNER_NFT;
  const userId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state: RootState) => state.order);
  const orderIdNew = useAppSelector(
    (state: RootState) => state.delivery.orderId
  );
  const [orderId, setOrderId] = useState<string>(orderIdNew || "");
  const handleCheckEligibility = (walletAddress: string) => {
    dispatch(checkEligibility({ orderId, userId, walletAddress }));
  };

  console.log("orderIdNew", orderIdNew);

  useEffect(() => {
    if (orderIdNew) {
      setOrderId(orderIdNew);
      setIsStep1Complete(true);
    }
  }, [orderIdNew]);

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

  const handleConffetiClick = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4000); // Confetti for 2 seconds
  };

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
      //   case 1328:
      //     setNetwork("SEI Testnet");
      //     await updateAccountAndBalance();
      //     handleCheckEligibility(accounts[0]);
      //     setIsStep2Complete(true);
      //     setIsClaimEnabled(true);
      //     break;
      //   default:
      //     setNetwork(null);
      //     setCurrentAccount(null);
      //     setBalance(null);
      //     alert("Please Switch To SEI TESTNET Network");
      //     await switchToSeiTestnet();
      //     break;
      // }

      switch (networkId) {
        case 1329:
          setNetwork("SEI Mainnet");
          await updateAccountAndBalance();
          handleCheckEligibility(accounts[0]);
          setIsStep2Complete(true);
          setIsClaimEnabled(true);
          break;
        default:
          setNetwork(null);
          setCurrentAccount(null);
          setBalance(null);
          alert("Please Switch To SEI MAINNET Network");
          await switchToSeiMainnet();
          break;
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while connecting to the wallet");
      setLoading(false);
    }
  };

  // const switchToSeiTestnet = async () => {
  //   const networks = {
  //     SEI_TESTNET: {
  //       chainId: "0x530",
  //       chainName: "SEI Testnet",
  //       nativeCurrency: {
  //         name: "SEI Testnet",
  //         symbol: "SEI",
  //         decimals: 18,
  //       },
  //       rpcUrls: ["https://evm-rpc-testnet.sei-apis.com"],
  //       blockExplorerUrls: ["https://seistream.app"],
  //     },
  //   };

  //   const params = networks.SEI_TESTNET;

  //   try {
  //     await (window as any).ethereum.request({
  //       method: "wallet_addEthereumChain",
  //       params: [params],
  //     });
  //     //Network switch was successful, so reconnect wallet
  //     await connectWallet();
  //     alert("Successfully switched to SEI TESTNET and reconnected!");
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
      alert("Successfully switched to SEI MAINNET and reconnected!");
    } catch (error) {
      console.error("Failed to switch network:", error);
      alert("Failed to switch network.");
    }
  };

  const updateAccountAndBalance = async () => {
    const web3 = new Web3(window.ethereum as any);
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
      console.log("Maanish", accounts);
      const balanceWei = await web3.eth.getBalance(accounts[0]);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      setBalance(balanceEth);
      setIsStep2Complete(false);
      setIsClaimEnabled(false);
    } else {
      setBalance(null);
      setCurrentAccount(null);
      setNetwork(null);
      setIsStep2Complete(false); // Reset step 2 completion if no accounts
      setIsClaimEnabled(false);
      // Disable claim button if no accounts
    }

    // console.log("Current account:", accounts[0]);
    // console.log("Balance updated:",balance,"SEI");
  };

  const handleChainChanged = async (chainIdHex: string) => {
    const networkId = parseInt(chainIdHex, 16);

    // switch (networkId) {
    //   case 1328:
    //       setNetwork("SEI SEI Testnet");
    //       await updateAccountAndBalance();
    //       break;
    //     default:
    //       setNetwork(null);
    //       setCurrentAccount(null);
    //       setBalance(null);
    //       alert("Please Switch To SEI TestNet Network");
    //       await switchToSeiTestnet();
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

  const performNftAirdrop = async () => {
    setLoading(true);
    try {
      if (!ContractAdd || !currentAccount) {
        alert("Please enter contract address and recipient address.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI, ContractAdd);
      console.log(contract, "...");

      const recipientTokenIds = await contract.methods
        .tokensOfReceiver(currentAccount)
        .call();
      if (!Array.isArray(recipientTokenIds)) {
        alert("Failed to fetch recipient token IDs.");
        return;
      }
      const recipientTokenCount = recipientTokenIds.length;

      if (recipientTokenCount >= 8) {
        alert(
          "You have already claimed 8 tokens. You are not eligible to claim more NFTs."
        );
        return;
      }

      const ownerTokenIds = await contract.methods.tokensOfOwner().call();
      if (!Array.isArray(ownerTokenIds) || ownerTokenIds.length === 0) {
        alert("Owner does not own any tokens to airdrop.");
        return;
      }

      // const methodToCall =
      //   caseNumber === 2
      //     ? contract.methods.transferFirstTwoTokens(currentAccount)
      //     : contract.methods.transferFirstTokens(currentAccount);
      // const gas = await methodToCall.estimateGas({ from: Owner });
      // const gasPrice = await web3.eth.getGasPrice();

      //*old code*//
      // let methodToCall;
      // if (status?.phase === "ANONS" && status?.amount >= 30) {
      //   methodToCall = contract.methods.transferFirstTokens(currentAccount);
      // } else if (status?.phase === "QUOLABS" && status?.amount >= 40) {
      //   methodToCall = contract.methods.transferFirstTokens(currentAccount);
      // } else if (status?.phase === "PUBLIC" && status?.amount >= 45) {
      //   methodToCall = contract.methods.transferFirstTokens(currentAccount);
      // } else {
      //   alert("You are not eligible for the current phase or order subtotal.");
      //   return;
      // }

      //*new code*//
      let methodToCall;
      let numTokens = 0;

      if (status?.phase === PhaseEnum.ANONS.name && status?.amount >= 40) {
        numTokens = PhaseEnum.ANONS.numTokens;
        methodToCall = contract.methods.transferTokens(
          currentAccount,
          numTokens
        );
      } else if (
        status?.phase === PhaseEnum.QUOLABS.name &&
        status?.amount >= 40
      ) {
        numTokens = PhaseEnum.QUOLABS.numTokens;
        methodToCall = contract.methods.transferTokens(
          currentAccount,
          numTokens
        );
      } else if (
        status?.phase === PhaseEnum.PUBLIC.name &&
        status?.amount >= 40
      )  {return}
      // {
      //   numTokens = PhaseEnum.PUBLIC.numTokens;
      //   methodToCall = contract.methods.transferTokens(
      //     currentAccount,
      //     numTokens
      //   );
      // } 
      else {
        alert("You are not eligible for the current phase or order subtotal.");
        return;
      }

      const gas = await methodToCall.estimateGas({ from: Owner });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: Owner,
        to: ContractAdd,
        gas: gas,
        gasPrice: gasPrice,
        data: methodToCall.encodeABI(),
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_key);
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      const updatedNftBalance = await contract.methods.balanceOf(Owner).call();
      if (updatedNftBalance && !Array.isArray(updatedNftBalance)) {
        setNftBalance(parseInt(updatedNftBalance, 10));
      }

      const token = await contract.methods.tokensOfOwner().call();
      if (Array.isArray(token)) {
        setTokenIds(token.map((id: any) => id.toString()));
      }

      setTransactionHash(receipt.transactionHash.toString());
      setRecipientTokenIds(recipientTokenIds.map((id: any) => id.toString()));
      alert(`You have successfully claimed  NFT(s)`);
      dispatch(nftDrop({ orderId, userId }));
      setIsStep3Complete(true); // Mark Step 3 as complete
      setLoading(false);
      handleConffetiClick();
    } catch (error) {
      alert(`Failed to claim  NFT(s)`);
      setIsClaimEnabled(true); // Enable the claim button again on error
      setErrorOccurred(true); // Set error flag to true
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchNftBalance = async () => {
      try {
        if (!Owner || !ContractAdd) {
          return;
        }

        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ABI, ContractAdd);

        const balance = await contract.methods.balanceOf(Owner).call();
        if (balance && !Array.isArray(balance)) {
          setNftBalance(parseInt(balance, 10));
        }
      } catch (error) {
        setNftBalance(null);
      }
    };

    fetchNftBalance();
  }, [Owner, ContractAdd]);

  useEffect(() => {
    const fetchTokenIds = async () => {
      try {
        if (!Owner || !ContractAdd) {
          return;
        }

        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ABI, ContractAdd);
        const tokenIds = await contract.methods.tokensOfOwner(Owner).call();
        if (Array.isArray(tokenIds)) {
          setTokenIds(tokenIds.map((id: any) => id.toString()));
        }
      } catch (error) {
        setTokenIds([]);
      }
    };

    fetchTokenIds();
  }, [Owner, ContractAdd]);

  useEffect(() => {
    if (isStep3Complete) {
      setIsClaimEnabled(false);
    }
  }, [isStep3Complete]);
  // console.log("Contract Address:", ContractAdd);
  // console.log("Current Account:", currentAccount);
  // console.log("Recipient Token IDs:",formattedTokenIds.map(id => id.toString()));
  // console.log("Owner Token IDs:", nftBalance);

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pt-20 py-16 lg:px-52 md:px-24 px-5">
      <div className="grid lg:grid-cols-7 md:grid-cols-7 grid-cols-1 gap-10">
        <div className="lg:col-span-2 md:col-span-2 h-max">
          <div className="p-10 bg-white">
            <div className="pt-10">
              <img className="mx-auto w-40" src={img} alt="" />
            </div>
            <div className="text-center font-bold text-5xl pt-4 uppercase">
              NFT Airdrop
            </div>
            <div className="text-center font-semibold text-2xl pt-2">
              Remaining NFTs: {nftBalance}
            </div>
          </div>
          <div className="bg-white mt-10 px-10 py-7">
            {ContractAdd && (
              <div className="flex items-center">
                <div className="text-2xl font-semibold">Contract Address</div>
                <div className="pe-2">
                  <MdArrowForwardIos />
                </div>
                <div className="break-words break-all text-2xl font-semibold whitespace-normal">
                  {" "}
                  {ContractAdd}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-5 md:col-span-5 bg-white p-10 h-max">
          <div className="bg-slate-50 p-10">
            <div className="font-semibold text-2xl underline underline-offset-2">
              Step - 1
            </div>
            <div className="flex items-center justify-center gap-5">
              <div className="text-2xl font-semibold">Enter Order Id:</div>
              <div>
                <input
                  placeholder="Enter Your Order Id"
                  value={orderId}
                  required
                  onChange={(e) => setOrderId(e.target.value)}
                  onBlur={() => setIsStep1Complete(true)}
                  className="text-2xl font-semibold py-3"
                />
              </div>
            </div>
          </div>
          <div className="py-3">
            <MdKeyboardDoubleArrowDown className="text-4xl mx-auto" />
          </div>
          <div className="bg-slate-50 p-10">
            <div className="font-semibold text-2xl underline underline-offset-2">
              Step - 2
            </div>
            <div className="flex items-center justify-center gap-5">
              <div className="text-2xl font-semibold">Connect your wallet:</div>
              <div>
                <button
                  onClick={connectWallet}
                  className="py-2 rounded border-none px-6 outline-2 font-semibold text-xl text-white outline outline-black bg-black hover:bg-white hover:text-black"
                  disabled={!isStep1Complete}
                >
                  Connect
                </button>
              </div>
            </div>
            <div className="text-left text-xs">
              {currentAccount && (
                <p className=" pt-7 text-center font-semibold text-2xl break-words break-all whitespace-normal">
                  Account: {currentAccount}
                </p>
              )}

              {errorOccurred && (
                <div className="text-2xl text-red-600">
                  An error occurred. Please try again.
                </div>
              )}
            </div>
            <div></div>
          </div>
          <div className="py-3">
            <MdKeyboardDoubleArrowDown className="text-4xl mx-auto" />
          </div>
          <div className="bg-slate-50 p-10">
            <div className="font-semibold text-2xl underline underline-offset-2">
              Step - 3
            </div>
            <div className="flex items-center justify-center gap-5">
              <div className="text-2xl font-semibold">Claim Your Nfts:</div>
              {/* <div>
                {!error ? (
                  <>
                    {!isClaimEnabled ? (
                      <button
                        disabled
                        className="py-2 rounded border-none px-6 outline-2 font-semibold text-xl text-white outline outline-black bg-black hover:bg-white hover:text-black"
                      >
                        Claim NFT
                      </button>
                    ) : (
                      <>
                        {status?.phase === "ANONS" && status?.amount >= 30 && (
                          <button
                            onClick={() => performNftAirdrop()}
                            className="py-2 rounded border-none px-6 outline-2 font-semibold text-xl text-white outline outline-black bg-black hover:bg-white hover:text-black"
                            disabled={
                              !isStep2Complete ||
                              isStep3Complete ||
                              !isClaimEnabled
                            }
                          >
                            Claim NFT
                          </button>
                        )}
                        {status?.phase === "QUOLABS" &&
                          status?.amount >= 40 && (
                            <button
                              onClick={() => performNftAirdrop()}
                              className="py-2 rounded border-none px-6 outline-2 font-semibold text-xl text-white outline outline-black bg-black hover:bg-white hover:text-black"
                              disabled={
                                !isStep2Complete ||
                                isStep3Complete ||
                                !isClaimEnabled
                              }
                            >
                              Claim NFT
                            </button>
                          )}
                        {status?.phase === "PUBLIC" && status?.amount >= 45 && (
                          <button
                            onClick={() => performNftAirdrop()}
                            className="py-2 rounded border-none px-6 outline-2 font-semibold text-xl text-white outline outline-black bg-black hover:bg-white hover:text-black"
                            disabled={
                              !isStep2Complete ||
                              isStep3Complete ||
                              !isClaimEnabled
                            }
                          >
                            Claim NFT
                          </button>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <button
                    className="py-2 rounded border-none px-6 outline-2 font-semibold text-xl text-white outline outline-black bg-black hover:bg-white hover:text-black"
                    disabled
                  >
                    Claim NFTs
                  </button>
                )}
              </div> */}
              <div>
  <button
    onClick={performNftAirdrop}
    className="py-2 rounded border-none px-6 outline-2 font-semibold text-xl text-white outline outline-black bg-black hover:bg-white hover:text-black"
    disabled={!isClaimEnabled || !isStep2Complete || isStep3Complete || 
      status?.phase === PhaseEnum.PUBLIC.name }
  >
    Claim NFT
  </button>
              </div>
            </div>
            <div>
              {transactionHash && (
                <p className=" pt-7 text-center font-semibold text-2xl break-words break-all whitespace-normal">
                  Transaction Hash: <br />
                  <a
                    href={`https://seitrace.com/tx/${transactionHash}?chain=pacific-1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words break-all whitespace-normal font-bold text-blue-500 hover:underline"
                  >
                    {transactionHash}
                  </a>
                </p>
              )}

              {recipientTokenIds.length > 0 && (
                <div className="text-left hidden">
                  <p>Your Token IDs:</p>
                  <ul>
                    {recipientTokenIds.map((id, index) => (
                      <li key={index}>{id}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {confetti && <Confetti />}
      <h3 className="text-2xl mb-8 hidden">Your Balance: {balance}</h3>
      <h3 className="text-2xl mb-8 hidden">Your Balance: {network}</h3>
      <h3 className="text-2xl mb-8 hidden">Your Balance: {tokenIds}</h3>
    </div>
  );
};

export default NftAirdrop;
