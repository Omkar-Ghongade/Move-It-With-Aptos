import React, { useEffect, useState } from 'react';

export default function Marketplace() {
  const [cards, setCards] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetch('/response.json')  // Assuming response.json is in the public directory
      .then(response => response.json())
      .then(data => {
        setCards(data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the cards!", error);
      });
  }, []);

  const handleBuyClick = (card) => {
    setSelectedCard(card);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedCard(null);
  };

  return (
    <div className="mp-bg-image relative min-h-screen p-4" style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.id} className="flex flex-col justify-center items-center p-2">
            <img src={card.images.large} alt={card.name} className="mb-2" />
            <div className="flex justify-between items-center w-full">
              <div className="w-1/2 bg-gray-200 text-center py-1 px-2 rounded">0.1 APTOS</div>
              <button
                className="w-1/2 bg-blue-500 text-white py-1 px-2 rounded"
                onClick={() => handleBuyClick(card)}
              >
                BUY
              </button>
            </div>
          </div>
        ))}
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center" style={{ width: '800px' }}>
            <img src={selectedCard.images.large} alt={selectedCard.name} className="w-1/3 rounded-l-lg" />
            <div className="flex flex-col justify-between ml-4 w-2/3">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Buy {selectedCard.name}</h2>
                <p className="text-lg">Are you sure you want to buy this card for 0.1 APTOS?</p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className="bg-gray-300 text-black py-2 px-6 rounded"
                  onClick={closePopup}
                >
                  Cancel
                </button>
                <button className="bg-blue-500 text-white py-2 px-6 rounded">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
