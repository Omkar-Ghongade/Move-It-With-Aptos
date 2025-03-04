import React, { useState, useEffect } from 'react';
import Home from './components/home';
import Marketplace from './components/marketplace';
import Arena from './components/arena';
import Deck from './components/deck';
import Login from './components/login';
import Pokefortune from './components/pokefortune'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const balanceResponse = await window.fewcha.getBalance();
        console.log('Balance:', balanceResponse);
        if(balanceResponse.data !== undefined) 
          setBalance(balanceResponse.data);
      } catch (error) {
        console.error('Error connecting or fetching balance:', error);
      }
    }
    fetchBalance();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={balance !== null ? <Home /> : <Login />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/pokefortune" element={<Pokefortune/>} />
      </Routes>
    </BrowserRouter>
  );
}