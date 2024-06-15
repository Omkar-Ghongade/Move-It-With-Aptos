import React from 'react';

export default function connectWallet() {

  const connectWallet = async () => {
    try {
      await window.fewcha.connect();
      window.location.reload();
    } catch (error) {
      console.error('Error connecting or fetching balance:', error);
    }
  };

  return (
    <div className="bg-image min-h-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center space-y-4">
      <img src="/Logo.png" alt="Pokémon Logo" className="w-auto h-48" />
      <img  src="/Frame_1.png" alt="Poké Ball" className="w-auto h-32 animate-bounce" />
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={connectWallet}
      >
        Connect
      </button>
    </div>
  )
}
