import React, { useState, useEffect } from 'react';

export default function LuckyPack() {
  const [cards, setCards] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);

  useEffect(() => {
    fetch('/response.json')  // Assuming response.json is in the public directory
      .then(response => response.json())
      .then(data => {
        setCards(data.data);
      })
      .catch(error => {
        console.error('There was an error fetching the cards!', error);
      });
  }, []);

  const handlePackOpen = () => {
    if (cards.length > 0) {
      const shuffledCards = [...cards].sort(() => 0.5 - Math.random());
      setDrawnCards(shuffledCards.slice(0, 3));
    }
  };

  return (
    <div className="mp-bg-image relative min-h-screen p-4" style={{ fontFamily: "'Press Start 2P', cursive" }}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => window.history.back()}
          className="bg-green-800 rounded-full"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '16px' }}
        >
          <img src="/bb.png" alt="Back" className="w-16 h-16" />
        </button>
        <h1 className="text-4xl font-bold text-center flex-grow">PokéPack Opening</h1>
      </div>

      {drawnCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mb-8">
            <img src="pokemonpack.png" alt="Back" className="w-96 h-96 " />
          <button
            onClick={handlePackOpen}
            className="bg-yellow-500 text-white py-2 px-6 rounded-lg text-xl hover:bg-yellow-600 transition-colors duration-300 mt-4"
          >
            Open Pack!
          </button>
        </div>
      ) : (
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-4">Congratulations!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-9">
            {drawnCards.map(card => (
              <div key={card.id} className="flex flex-col justify-center items-center p-2 w-96 h-full">
                <img
                  src={card.images.large}
                  alt={`${card.name} card`}
                  className="mb-2 transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
