import React from "react";
import "./App.css";
import Home from "./components/home/Home.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import Form from "./components/form/Form";
import List from "./components/myNfts/NftList";
import Marketplace from "./components/marketplace/Marketplace";
import AccountStatus from "./components/account/AccountStatus";
import { useEffect, useState } from "react";


const App = () => {
  const tokenAddress = "0x3940a533DcD1ccCC21DdCc66cEF8ba72D9BAa0d8";
  const marketAddress = "0xAC29532e324c850811A70d213F9c14b321ACF0EF";
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum === undefined) {
      setIsConnected(false)
    } else {
      setIsConnected(true);
    }
  })

  try {
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload();
    })
  } catch (error) {
    console.log(error);
  }


  return (
    <>
    {
      isConnected && 
      <Router>
      <NavBar />
      <AccountStatus isConnected={isConnected} />
      <Routes>
        <Route exact path="/" element={<Home tokenAddress={tokenAddress} />} />
        <Route path="/mint" element={<Form tokenAddress={tokenAddress} />} />
        <Route path="/myNfts" element={<List tokenAddress={tokenAddress} />} />
        <Route path="/marketplace" element={<Marketplace tokenAddress={tokenAddress} marketAddress={marketAddress} />} />
      </Routes>
      </Router>
    }
    </>
   
  );

}

export default App;
