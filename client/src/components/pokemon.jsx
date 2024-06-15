import React, { useEffect, useState } from 'react';

export default function Pokemon() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch('https://api.pokemontcg.io/v2/cards?q=name:gardevoir')
      .then(response => response.json())
      .then(data => {
        setCards(data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the cards!", error);
      });
  }, []);

  return (
    <div className="p-4" style={{ fontFamily: "'Press Start 2P', cursive" }}>
      {cards.map(card => (
        <div key={card.id} className="flex justify-center mb-4">
          <img src={card.images.small} alt={`${card.name} small`} className="transform hover:scale-105 transition-transform duration-300" />
        </div>
      ))}
    </div>
  );
}
