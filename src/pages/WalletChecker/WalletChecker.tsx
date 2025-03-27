import axios from 'axios';
import React, { useState } from 'react';
import { IoIosWallet } from 'react-icons/io';

const WalletChecker: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [result, setResult] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!walletAddress.trim()) {
      setError("Please enter a wallet address");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}user/check-walletAddress`,{  params: { walletAddress },});
      setResult(data);
    } catch (err :any) {
        setError(err.response?.data?.message || "An error occurred while checking the wallet");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto items-center flex h-[500px] py-10 px-4 max-w-4xl'>
        <div className='bg-[#d9d9d9] w-full rounded-lg shadow-md p-5'>
            <div className='p-6 border-b border-black'>
                 <div className='text-center flex flex-col items-center justify-center'>
                 <IoIosWallet className='text-center text-5xl'/>
                 <h1 className="text-2xl font-bold text-gray-800 mb-2">Wallet Checker</h1>
                 <p className="text-gray-600">Enter a wallet address to check Your Phases</p>
                 <p className='text-gray-400 text-lg'>Ex: 0xA72D9836Be062943492DD9FdCA953F1B4eXXXXXX</p>
                 </div>
            </div>
            <div className='p-5'>
            <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="flex-1 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 bg-black hover:bg-black text-xl mt-2"
              >
                {isLoading ? "Checking..." : "Check Wallet"}
              </button>
            </div>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-800">Wallet Information</h3>
                <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                  <pre className="whitespace-pre-wrap break-words text-gray-800 text-lg font-semibold">
                  {result.message}
                  </pre>
                </div>
              </div>
            )}
          </form>
            </div>
        </div>
    </div>
  )
}

export default WalletChecker