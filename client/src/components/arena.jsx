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
      setSelectedAttack(card.attacks.find(attack => attack.damage)); // Set default attack with damage
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
    <div className="arena-bg-image relative min-h-screen p-4 flex justify-between text-white" style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}>
      <div className="player-deck flex-1">
        <h2>Player Deck</h2>
        <div className="cards flex flex-col">
          {playerDeck.map(card => (
            <div key={card.id} onClick={() => handlePlayerCardChoice(card)} className={`card mb-4 p-2 border border-gray-400 rounded-lg cursor-pointer flex flex-col items-center ${isBattleInProgress ? 'opacity-50' : ''}`}>
              <img src={card.images.small} alt={card.name} className="w-20 h-auto mb-2" />
              <div className="text-center">
                <h3>{card.name}</h3>
                {card.attacks && card.attacks.filter(attack => attack.damage).map((attack, index) => (
                  <p key={index}>{attack.name}: {attack.damage} damage</p>
                ))}
              </div>
              <p className="mt-2">HP: {card.hp}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="battle-log flex-1">
        <h2>Battle Log</h2>
        <div className="log p-2 border border-gray-400 rounded-lg h-full overflow-y-auto">
          {battleLog.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
      <div className="opponent-deck flex-1">
        <h2>Opponent Deck</h2>
        <div className="cards flex flex-col">
          {opponentDeck.map(card => (
            <div key={card.id} className="card mb-4 p-2 border border-gray-400 rounded-lg flex flex-col items-center">
              <img src={card.images.small} alt={card.name} className="w-20 h-auto mb-2" />
              <div className="text-center">
                <h3>{card.name}</h3>
                {card.attacks && card.attacks.filter(attack => attack.damage).map((attack, index) => (
                  <p key={index}>{attack.name}: {attack.damage} damage</p>
                ))}
              </div>
              <p className="mt-2">HP: {card.hp}</p>
            </div>
          ))}
        </div>
      </div>
      {playerCard && (
        <div className="attack-choices text-white">
          <h3>Select an attack for {playerCard.name}</h3>
          {playerCard.attacks && playerCard.attacks.filter(attack => attack.damage).map((attack, index) => (
            <button key={index} onClick={() => handleAttackChoice(attack)} className="attack-button p-2 bg-gray-700 border border-white rounded-lg m-2">
              {attack.name}: {attack.damage} damage
            </button>
          ))}
          <button onClick={playerAttack} className="start-battle-button p-2 bg-red-600 border border-white rounded-lg m-2" disabled={isBattleInProgress}>Attack</button>
        </div>
      )}
    </div>
  );
}

export default Arena;
