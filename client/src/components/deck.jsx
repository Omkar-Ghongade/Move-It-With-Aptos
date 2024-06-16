import React, { useEffect, useState } from 'react';

export default function Deck() {
  const [ownedCards, setOwnedCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [allCards, setAllCards] = useState([]);

  useEffect(() => {
    fetch('/response.json')  // Assuming response.json is in the public directory
      .then(response => response.json())
      .then(data => {
        const allCards = data.data;
        const randomCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 12); // Fetching 12 cards for 4 decks
        setOwnedCards(randomCards);
        setFilteredCards(randomCards);
        getMyCards();
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

  const decks = [
    { id: 1, name: 'Deck 1', cards: filteredCards.slice(0, 3) },
    { id: 2, name: 'Deck 2', cards: filteredCards.slice(3, 6) },
    { id: 3, name: 'Deck 3', cards: filteredCards.slice(6, 9) },
    { id: 4, name: 'Deck 4', cards: filteredCards.slice(9, 12) },
  ];

  const getMyCards = async () => {
    try {
      const user = await window.fewcha.account();
      console.log('User:', user.data.address);
      const response = await fetch('http://localhost:3000/userstorage/mycards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: user.data.address }),
      });
      const data = await response.json();
      console.log('My Cards:', data);
      setAllCards(data); // Ensure data.cards is defined
    } catch (error) {
      console.error("There was an error fetching the owned cards!", error);
    }
  }

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
        <h1 className="text-4xl font-bold text-center flex-grow">My Deck</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Pokémon"
          className="p-2 rounded-lg border-2 border-gray-300"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        />
      </div>
      <div className="p-4">
        <h2 className="text-left text-2xl font-bold mb-4">All Cards</h2>
        <div className="flex justify-left space-x-4 flex-wrap">
          {allCards && allCards.map(card => (
            <div key={card.id} className="p-2">
              <img src={card.images.large} alt={card.name} className="w-48 h-auto" />
              <p className="text-center">{card.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-8">
        {decks.map(deck => (
          <div key={deck.id} className="p-4">
            <h2 className="text-left text-2xl font-bold mb-4">{deck.name}</h2>
            <div className="flex justify-left space-x-4">
              {deck.cards.map(card => (
                <div key={card.id} className="p-2">
                  <img src={card.images.large} alt={card.name} className="w-96 h-auto" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
