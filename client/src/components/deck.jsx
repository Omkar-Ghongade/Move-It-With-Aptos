import React, { useEffect, useState } from 'react';

export default function Deck() {
  const [ownedCards, setOwnedCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    fetch('/response.json')  // Assuming response.json is in the public directory
      .then(response => response.json())
      .then(data => {
        const allCards = data.data;
        const randomCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 6);
        setOwnedCards(randomCards);
        setFilteredCards(randomCards);
      })
      .catch(error => {
        console.error("There was an error fetching the owned cards!", error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredCards(ownedCards);
    } else {
      setFilteredCards(ownedCards.filter(card => card.name.toLowerCase().includes(e.target.value.toLowerCase())));
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
        <h1 className="text-4xl justify-between font-bold text-center">My Deck</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Pokémon"
          className="p-2 rounded-lg border-2 border-gray-300"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCards.map(card => (
          <div key={card.id} className="flex flex-col justify-center items-center p-2">
            <img src={card.images.large} alt={card.name} className="mb-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
