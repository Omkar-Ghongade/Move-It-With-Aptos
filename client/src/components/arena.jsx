import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Arena() {
  const [playerDeck, setPlayerDeck] = useState([]);
  const [opponentDeck, setOpponentDeck] = useState([]);
  const [playerCard, setPlayerCard] = useState(null);
  const [opponentCard, setOpponentCard] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [isBattleInProgress, setIsBattleInProgress] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('https://api.pokemontcg.io/v2/cards');
        const allCards = response.data.data;
        const shuffledCards = allCards.sort(() => 0.5 - Math.random());
        setPlayerDeck(shuffledCards.slice(0, 6));
        setOpponentDeck(shuffledCards.slice(6, 12));
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    if (opponentDeck.length > 0) {
      const randomOpponentCard = opponentDeck[Math.floor(Math.random() * opponentDeck.length)];
      setOpponentCard(randomOpponentCard);
    }
  }, [opponentDeck]);

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
        setPlayerDeck(playerDeck.filter(c => c.id !== playerCard.id));
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
    if (playerDeck.length === 0) {
      alert('Opponent wins!');
    } else if (opponentDeck.length === 0) {
      alert('Player wins!');
    }
  };

  return (
    <div className="arena-bg-image h-screen  relative p-4 text-white" style={{ fontFamily: "'Press Start 2P', cursive", overflow: 'hidden' }}>
      <div className="flex">
        {/* Player Deck */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <h2 className="text-center mb-4 flex-shrink-0">Player Deck</h2>
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col items-center">
              {playerDeck.map(card => (
                <div key={card.id} onClick={() => handlePlayerCardChoice(card)} className={`mb-4 p-2 cursor-pointer ${isBattleInProgress ? 'opacity-50' : ''}`}>
                  <img src={card.images.large} alt={card.name} className="w-96 h-auto transform hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Battle Log and Attack Menu */}
        <div className="flex flex-col justify-between items-center flex-1 mt-16 h-screen ">
          {/* Select Attack Menu */}
          <div className="text-center p-4 border border-white outline outline-offset-2 outline-4 rounded-lg relative mb-16 w-full">
            {playerCard && (
              <>
                <h3 className="absolute left-4 top-0 transform -translate-y-1/2 bg-gray-800 px-2 text-xl">Select Attack</h3>
                {playerCard.attacks && playerCard.attacks.filter(attack => attack.damage).map((attack, index) => (
                  <button key={index} onClick={() => handleAttackChoice(attack)} className={`attack-button p-2 bg-gray-700 border border-white rounded-lg m-2 text-base ${selectedAttack === attack ? 'bg-yellow-300' : ''}`}>
                    {attack.name}: {attack.damage} damage
                  </button>
                ))}
                <button onClick={playerAttack} className="start-battle-button p-2 bg-red-600 border border-white rounded-lg m-2 text-base" disabled={isBattleInProgress}>Attack</button>
              </>
            )}
          </div>
          {/* Battle Log */}
          <div className="overflow-y-scroll hide-scrollbar border border-white outline outline-offset-2 outline-4 rounded-lg p-4 relative w-full h-screen mb-24">
            <div className="log text-base">
              {battleLog.map((log, index) => (
                <p key={index}>{log}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Opponent Deck */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <h2 className="text-center mb-4 flex-shrink-0">Opponent Deck</h2>
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col items-center">
              {opponentDeck.map(card => (
                <div key={card.id} className="mb-4 p-2">
                  <img src={card.images.large} alt={card.name} className="w-96 h-auto transform hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Arena;
