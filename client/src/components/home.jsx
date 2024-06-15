import React from 'react';
import ashImage from '../../public/ash.png'; // Adjust the path as necessary
import pikachuImage from '../../public/Pokemon-3.png'; // Adjust the path as necessary
import squirtleImage from '../../public/Pokemon-2.png'; // Adjust the path as necessary
import aptos from '../../public/aptoslogo.png'; // Adjust the path as necessary

export default function Home() {
  const handleDisconnect = async () => {
    await window.fewcha.disconnect();
    window.location.reload();
  };

  return (
    <div>
      <div className="home-bg-image relative min-h-screen flex flex-col justify-between">
        <header className="w-full text-white flex justify-center pt-0 mt-0 relative">
          <div className="bg-black bg-opacity-60 px-12 py-5 flex justify-between items-center rounded-lg w-full max-w-screen-lg mx-auto">
            <nav className="flex space-x-12 text-lg" style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}>
              <a href="/deck" className="hover:underline">Cards Deck</a>
              <span>/</span>
              <a href="/marketplace" className="hover:underline">Market Place</a>
              <span>/</span>
              <a href="/arena" className="hover:underline">Battle Arena</a>
              <span>/</span>
              <a href="/league" className="hover:underline">League Events</a>
            </nav>
            <div className="flex items-center bg-black bg-opacity-60 px-4 py-2 rounded-lg">
              <span className="text-white mr-2">2.000</span>
              <img src={aptos} alt="Logo" className="h-10" />
              <button 
                onClick={handleDisconnect} 
                className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg"
              >
                Disconnect
              </button>
            </div>
          </div>
        </header>
        <div className="flex flex-grow justify-center items-center relative">
          <img src={ashImage} alt="Ash with Pokeball" className="h-auto max-w-xs transform translate-y-10" /> {/* Move Ash further down */}
          <div className="absolute left-0 top-full transform -translate-y-[135%] translate-x-[370%]">
            <img src={pikachuImage} alt="Pikachu" className="h-auto" style={{ maxHeight: '200px' }} />
          </div>
          <div className="absolute left-0 top-full transform -translate-y-[142%] translate-x-[220%]">
            <img src={squirtleImage} alt="Squirtle" className="h-auto" style={{ maxHeight: '200px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}