import React, { useEffect, useState } from 'react';

export default function Deck() {
  const [ownedCards, setOwnedCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [editingDeck, setEditingDeck] = useState(null);
  const [currentDeckCards, setCurrentDeckCards] = useState([]);
  const [decks, setDecks] = useState([
    { id: 1, name: 'Deck 1', cards: [] },
    { id: 2, name: 'Deck 2', cards: [] },
    { id: 3, name: 'Deck 3', cards: [] },
    { id: 4, name: 'Deck 4', cards: [] },
  ]);

  useEffect(() => {
    fetch('/response.json')  // Assuming response.json is in the public directory
      .then(response => response.json())
      .then(data => {
        const allCards = data.data;
        const randomCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 12); // Fetching 12 cards for 4 decks
        setOwnedCards(randomCards);
        setFilteredCards(randomCards);
        getMyCards();
        getDecks();
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
  };

  const getDecks = async () => {
    try {
      const user = await window.fewcha.account();
      const response = await fetch('http://localhost:3000/userstorage/getdeck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: user.data.address }),
      });
      const data = await response.json();
      console.log('Decks:', data);
      for(let i=0;i<data.length;i++){
        decks[i].cards=data[i];
      }
      console.log(decks)// Ensure data.decks is defined and matches the expected format
    } catch (error) {
      console.error("There was an error fetching the decks!", error);
    }
  };

  const handleEdit = (deckId) => {
    setEditingDeck(deckId);
    const deck = decks.find(deck => deck.id === deckId);
    setCurrentDeckCards(deck.cards);
  };

  const handleSave = async () => {
    if (currentDeckCards.length !== 3) {
      alert('A deck must contain exactly 3 cards.');
      return;
    }
    try {
      const user = await window.fewcha.account();
      console.log('User:', user.data.address);
      const response = await fetch('http://localhost:3000/userstorage/addtodeck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: user.data.address, deck: currentDeckCards, deck_n: editingDeck - 1 }),
      });
      const data = await response.json();
      console.log('Deck:', data);
      decks[editingDeck - 1].cards = currentDeckCards;
    } catch (err) {
      console.log(err);
    }
    console.log(`Deck ${editingDeck} Cards:`, currentDeckCards);
    setEditingDeck(null);
  };

  const handleRemoveCard = (index) => {
    setCurrentDeckCards(currentDeckCards.filter((_, i) => i !== index));
  };

  const handleReplaceCard = (index, newCard) => {
    // Ensure no duplicate cards
    if (currentDeckCards.some(card => card.id === newCard.id)) {
      alert('Cannot add duplicate cards to the deck.');
      return;
    }
    const updatedCards = currentDeckCards.map((card, i) => i === index ? newCard : card);
    setCurrentDeckCards(updatedCards);
  };

  const handleAddCard = (newCard) => {
    if (currentDeckCards.length >= 3) {
      alert('A deck can only contain 3 cards.');
      return;
    }
    // Ensure no duplicate cards
    if (currentDeckCards.some(card => card.id === newCard.id)) {
      alert('Cannot add duplicate cards to the deck.');
      return;
    }
    setCurrentDeckCards([...currentDeckCards, newCard]);
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
          {allCards && allCards.length > 0 ? (
            allCards.map(card => (
              <div key={card.id} className="p-2">
                <img src={card.images.large} alt={card.name} className="w-48 h-auto" />
                {editingDeck !== null && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleReplaceCard(currentDeckCards.findIndex(c => c.id === card.id), card)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg mr-2"
                    >
                      Replace
                    </button>
                    <button
                      onClick={() => handleAddCard(card)}
                      className="bg-green-500 text-white px-2 py-1 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No cards available</p>
          )}
        </div>
      </div>
      <div className="space-y-8">
        {decks.map((deck, index) => (
          <div key={deck.id} className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-left text-2xl font-bold">{deck.name}</h2>
              {editingDeck === deck.id ? (
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(deck.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  disabled={index > 0 && decks[index - 1].cards.length !== 3} // Disable if previous deck is incomplete
                >
                  Edit
                </button>
              )}
            </div>
            <div className="flex justify-left space-x-4">
              {(editingDeck === deck.id ? currentDeckCards : deck.cards)?.map((card, index) => (
                <div key={card.id} className="p-2 relative">
                  <img src={card.images.large} alt={card.name} className="w-96 h-auto" />
                  {editingDeck === deck.id && (
                    <button
                      onClick={() => handleRemoveCard(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
