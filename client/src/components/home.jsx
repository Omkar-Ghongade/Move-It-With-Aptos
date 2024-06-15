import React from 'react';

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
            <nav className="flex space-x-6 text-lg" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              <a href="/deck" className="hover:underline">Cards Deck</a>
              <img src="/pokeball.png" alt="Pokeball" className="h-8 my-auto" /> {/* Increase size */}
              <a href="/marketplace" className="hover:underline">Market Place</a>
              <img src="/pokeball.png" alt="Pokeball" className="h-8 my-auto" /> {/* Increase size */}
              <a href="/arena" className="hover:underline">Battle Arena</a>
              <img src="/pokeball.png" alt="Pokeball" className="h-8 my-auto" /> {/* Increase size */}
              <a href="/league" className="hover:underline">League Events</a>
            </nav>
            <div className="flex items-center bg-black bg-opacity-60 px-4 py-2 rounded-lg w-80">
              <span className="text-white mr-3">2.000</span>
              <img src="/aptoslogo.png" alt="Logo" className="h-10" />
              <button 
                onClick={handleDisconnect} 
                className="ml-4 px-2 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
              >
                Disconnet
              </button>
            </div>
          </div>
        </header>
        <div className="flex flex-grow justify-center items-center relative">
          <img src="/ash.png" alt="Ash with Pokeball" className="h-auto max-w-xs transform translate-y-10" />
          <div className="absolute left-0 top-full transform -translate-y-[135%] translate-x-[370%]">
            <img src="/Pokemon-3.png" alt="Pikachu" className="h-auto" style={{ maxHeight: '200px' }} />
          </div>
          <div className="absolute left-0 top-full transform -translate-y-[142%] translate-x-[220%]">
            <img src="/Pokemon-2.png" alt="Squirtle" className="h-auto" style={{ maxHeight: '200px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
