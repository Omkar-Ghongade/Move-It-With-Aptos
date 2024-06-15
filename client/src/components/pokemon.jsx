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
    <div>
      {cards.map(card => (
        <div key={card.id} style={{ marginBottom: '20px' }} className='flex'>
          {/* <h3>{card.name}</h3> */}
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <img src={card.images.small} alt={`${card.name} small`} />
            {/* <img src={card.images.large} alt={`${card.name} large`} /> */}
          </div>
        </div>
      ))}
    </div>
  );
}
