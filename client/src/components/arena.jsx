import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Apply the app element for accessibility
Modal.setAppElement('#root');

function Arena() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [playerDecks, setPlayerDecks] = useState([]);
  const [selectedPlayerDeck, setSelectedPlayerDeck] = useState([]);
  const [opponentDeck, setOpponentDeck] = useState([]);
  const [playerCard, setPlayerCard] = useState(null);
  const [opponentCard, setOpponentCard] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [isBattleInProgress, setIsBattleInProgress] = useState(false);
  const [allDecks, setAllDecks] = useState([]);
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState('');

  const setCardHPTo100 = (deck) => {
    return deck.map(card => ({ ...card, hp: 100, maxHp: 100 }));
  };

  const getRandomCards = (deck, num) => {
    const shuffled = deck.flat().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const user = await window.fewcha.account();
        setWalletAddress(user.data.address);
        fetchPlayerDecks(user.data.address);
      } catch (error) {
        console.error('Error fetching wallet address:', error);
      }
    };

    const fetchPlayerDecks = async (address) => {
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
        console.log('Player Decks:', data);
        const adjustedDecks = data.filter(deck => deck.length !== 0).map(setCardHPTo100);
        setAllDecks(adjustedDecks);
        setPlayerDecks(adjustedDecks);
      } catch (error) {
        console.error('Error fetching player decks:', error);
      }
    };

    fetchWalletAddress();
  }, []);

  useEffect(() => {
    if (opponentDeck.length > 0) {
      const randomOpponentCard = opponentDeck[Math.floor(Math.random() * opponentDeck.length)];
      setOpponentCard(randomOpponentCard);
    }
  }, [opponentDeck]);

  const handlePlayerDeckChoice = (deck) => {
    console.log('Selected Player Deck:', deck);
    setSelectedPlayerDeck(deck);
    localStorage.setItem('selectedPlayerDeck', JSON.stringify(deck));
  };

  const handlePlayerCardChoice = (card) => {
    if (!isBattleInProgress) {
      setPlayerCard(card);
      setSelectedAttack(null); // Reset selected attack when a new card is chosen
    }
  };

  const handleAttackChoice = (attack) => {
    if (!isBattleInProgress) {
      setSelectedAttack(attack);
    }
  };

  const playerAttack = () => {
    if (!playerCard || !opponentCard || !selectedAttack || isBattleInProgress) return;

    setIsBattleInProgress(true);

    let battleSequence = [...battleLog];
    let playerHp = playerCard.hp;
    let opponentHp = opponentCard.hp;

    const playerAttackDamage = parseInt(selectedAttack.damage);
    opponentHp -= playerAttackDamage;
    battleSequence.push(`${playerCard.name} uses ${selectedAttack.name} on ${opponentCard.name} for ${playerAttackDamage} damage.`);

    if (opponentHp <= 0) {
      battleSequence.push(`${opponentCard.name} has been defeated!`);
      setOpponentDeck(opponentDeck.filter(c => c.id !== opponentCard.id));
      setOpponentCard(null);
      setBattleLog(battleSequence);
      setIsBattleInProgress(false);
      checkEndGame();
      return;
    }

    setOpponentCard(prev => ({ ...prev, hp: opponentHp }));
    setBattleLog(battleSequence);
    opponentAttack(playerHp, opponentHp, battleSequence);
  };

  const opponentAttack = (playerHp, opponentHp, battleSequence) => {
    setTimeout(() => {
      const opponentAttackDamage = parseInt(opponentCard.attacks[0].damage);
      playerHp -= opponentAttackDamage;
      battleSequence.push(`${opponentCard.name} uses ${opponentCard.attacks[0].name} on ${playerCard.name} for ${opponentAttackDamage} damage.`);

      if (playerHp <= 0) {
        battleSequence.push(`${playerCard.name} has been defeated!`);
        setSelectedPlayerDeck(selectedPlayerDeck.filter(c => c.id !== playerCard.id));
        setPlayerCard(null);
        setSelectedAttack(null);
        setBattleLog(battleSequence);
        setIsBattleInProgress(false);
        checkEndGame();
        return;
      }

      setPlayerCard(prev => ({ ...prev, hp: playerHp }));
      setBattleLog(battleSequence);
      setIsBattleInProgress(false);
    }, 1000);
  };

  const checkEndGame = () => {
    if (selectedPlayerDeck.length === 0) {
      setWinner('Opponent');
      setIsModalOpen(true);
    } else if (opponentDeck.length === 0) {
      setWinner('Player');
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (selectedPlayerDeck.length === 0 || opponentDeck.length === 0) {
      checkEndGame();
    }
  }, [selectedPlayerDeck, opponentDeck]);

  const startMatch = () => {
    setIsMatchStarted(true);
    const randomOpponentDeck = setCardHPTo100(getRandomCards(allDecks, 3));
    setOpponentDeck(randomOpponentDeck);
    localStorage.setItem('selectedPlayerDeck', JSON.stringify(selectedPlayerDeck));
    localStorage.setItem('opponentDeck', JSON.stringify(randomOpponentDeck));
  };

  const renderCard = (card, isPlayer) => {
    const hpPercentage = (card.hp / card.maxHp) * 100;
    const hpColor = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500';

    return (
      <div key={card.id} className="mb-4 p-2">
        <div className="w-full bg-gray-300 rounded-full h-6 mb-2">
          <div
            className={`${hpColor} h-6 rounded-full`}
            style={{ width: `${hpPercentage}%` }}
          ></div>
        </div>
        <img
          src={card.images.large}
          alt={card.name}
          className={`w-96 h-auto transform ${isPlayer ? 'cursor-pointer' : ''} hover:scale-105 transition-transform duration-300`}
          onClick={() => isPlayer && !isBattleInProgress && handlePlayerCardChoice(card)}
        />
      </div>
    );
  };

  return (
    <div className="arena-bg-image h-screen relative p-4 text-white" style={{ fontFamily: "'Press Start 2P', cursive", overflow: 'hidden' }}>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2 className="text-2xl mb-4">{winner === 'Player' ? 'Congratulations!' : 'Defeat!'}</h2>
        <p className="mb-4">{winner} wins the game!</p>
        <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-800 border border-white rounded-lg text-white">
          Close
        </button>
      </Modal>

      <div className="flex">
        {!isMatchStarted && (
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <h2 className="text-center mb-4 flex-shrink-0">Select Player Deck</h2>
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              <div className="flex flex-col items-center">
                {playerDecks.map((deck, index) => (
                  <button
                    key={deck.id}
                    onClick={() => handlePlayerDeckChoice(deck)}
                    className="mb-4 p-2 bg-gray-700 border border-white rounded-lg m-2 text-white flex items-center hover:bg-gray-800 transform hover:scale-105 transition-transform"
                  >
                    <span className="mr-2 font-bold">{index + 1}</span>
                    {deck.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <h2 className="text-center mb-4 flex-shrink-0">Player Deck</h2>
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col items-center">
              {selectedPlayerDeck.map(card => renderCard(card, true))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between items-center flex-1 mt-16 h-screen ">
          <div className="text-center p-4 border border-white outline outline-offset-2 outline-4 rounded-lg relative mb-16 w-full">
            {playerCard && isMatchStarted && (
              <>
                <h3 className="absolute left-4 top-0 transform -translate-y-1/2 bg-gray-800 px-2 text-xl">Select Attack</h3>
                {playerCard.attacks && playerCard.attacks.filter(attack => attack.damage).map((attack, index) => (
                  <button key={index} onClick={() => handleAttackChoice(attack)} className={`p-2 bg-gray-700 border border-white rounded-lg m-2 text-base ${selectedAttack === attack ? 'bg-yellow-300' : ''}`}>
                    {attack.name}: {attack.damage} damage
                  </button>
                ))}
                <button onClick={playerAttack} className="p-2 bg-red-600 border border-white rounded-lg m-2 text-base" disabled={isBattleInProgress}>Attack</button>
              </>
            )}
            {!isMatchStarted && selectedPlayerDeck.length > 0 && (
              <button onClick={startMatch} className="p-2 bg-green-600 border border-white rounded-lg m-2 text-base">
                Start Match
              </button>
            )}
          </div>
          <div className="overflow-y-scroll hide-scrollbar border border-white outline outline-offset-2 outline-4 rounded-lg p-4 relative w-full h-screen mb-24">
            <div className="text-base">
              {battleLog.map((log, index) => (
                <p key={index}>{log}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <h2 className="text-center mb-4 flex-shrink-0">Opponent Deck</h2>
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col items-center">
              {opponentDeck.map(card => renderCard(card, false))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg">
        <p>Player Cards Left: {selectedPlayerDeck.length}</p>
        <p>Opponent Cards Left: {opponentDeck.length}</p>
      </div>
    </div>
  );
}

export default Arena;
