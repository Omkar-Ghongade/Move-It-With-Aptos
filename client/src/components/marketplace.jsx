import React, { useEffect, useState } from 'react';

export default function Marketplace() {
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetch('/response.json')  // Assuming response.json is in the public directory
      .then(response => response.json())
      .then(data => {
        setCards(data.data);
        setFilteredCards(data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the cards!", error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredCards(cards);
    } else {
      setFilteredCards(cards.filter(card => card.name.toLowerCase().includes(e.target.value.toLowerCase())));
    }
  };

  const handleBuyClick = (card) => {
    setSelectedCard(card);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedCard(null);
  };

  return (
    <div className="mp-bg-image relative min-h-screen p-4" style={{ fontFamily: "'Press Start 2P', cursive" }}>
      <div className="fixed top-4 left-4">
        <button
          onClick={() => window.history.back()}
          className="bg-green-800 rounded-full"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '16px' }}
        >
          <img src="/bb.png" alt="Back" className="w-16 h-16" />
        </button>
      </div>
      <div className="fixed top-4 right-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Pokémon"
          className="p-2 rounded-lg border-2 border-gray-300"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
        {filteredCards.map(card => (
          <div key={card.id} className="flex flex-col justify-center items-center p-2">
            <img src={card.images.large} alt={card.name} className="mb-2 transform hover:scale-105 transition-transform duration-300" />
            <div className="flex justify-between items-center w-full">
              <div className="w-4/6 h-full bg-yellow-300 text-center text-xl py-1 px-2 font-bold rounded-l-lg">0.1 APTOS</div>
              <button
                className="w-2/6 bg-blue-500 text-white py-1 px-2 text-xl rounded-r-lg font-bold hover:bg-blue-700 transition-colors duration-300"
                onClick={() => handleBuyClick(card)}
              >
                BUY
              </button>
            </div>
          </div>
        ))}
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center transform transition-transform duration-300 scale-105" style={{ width: '800px' }}>
            <img src={selectedCard.images.large} alt={selectedCard.name} className="w-1/3 rounded-l-lg" />
            <div className="flex flex-col justify-between ml-4 w-2/3">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Buy {selectedCard.name}</h2>
                <p className="text-lg">Are you sure you want to buy this card for 0.1 APTOS?</p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className="bg-gray-300 text-black py-2 px-6 rounded hover:bg-gray-400 transition-colors duration-300"
                  onClick={closePopup}
                >
                  Cancel
                </button>
                <button className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors duration-300">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
