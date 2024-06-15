import React, { useEffect, useState } from 'react';

export default function Deck() {
  const [ownedCards, setOwnedCards] = useState([]);

  useEffect(() => {
    fetch('/response.json')  // Assuming response.json is in the public directory
      .then(response => response.json())
      .then(data => {
        const allCards = data.data;
        const randomCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 6);
        setOwnedCards(randomCards);
      })
      .catch(error => {
        console.error("There was an error fetching the owned cards!", error);
      });
  }, []);

  return (
    <div className="deck-bg-image relative min-h-screen p-4" style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}>
      <h1 className="text-4xl font-bold mb-4 text-center">My Deck</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ownedCards.map(card => (
          <div key={card.id} className="flex flex-col justify-center items-center p-2">
            <img src={card.images.large} alt={card.name} className="mb-2" />
            <div className="w-full bg-gray-200 text-center py-1 px-2 rounded">{card.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
