import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function Metamask() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        accountChanged(accounts[0]);
      } catch (error) {
        setErrorMessage("Failed to connect to MetaMask");
      }
    } else {
      setErrorMessage("MetaMask not found");
    }
  };

  const accountChanged = async (account) => {
    setAccount(account);
    await getBalance(account);
  };

  const getBalance = async (account) => {
    try {
        window.ethereum.request({method : "eth_getBalance", params : [String(account), "latest"]})
        .then((result) => {
            setBalance(ethers.formatEther(result));
        });
    } catch (error) {
      setErrorMessage("Failed to fetch balance");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
      >
        Connect to MetaMask
      </button>
      <h3 className="text-lg text-gray-700">Address: {account}</h3>
      <h3 className="text-lg text-gray-700">Current Balance: {balance} ETH</h3>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
