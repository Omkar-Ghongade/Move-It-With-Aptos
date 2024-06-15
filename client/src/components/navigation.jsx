import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './home';
import Marketplace from './marketplace';
import Login from './login';

export default function AHome() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const userBalance = localStorage.getItem('balance');
    if (userBalance) {
      setBalance(userBalance);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={balance !== null ? <Home /> : <Login />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
    </BrowserRouter>
  );
}
