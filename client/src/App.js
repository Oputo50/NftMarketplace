import React from "react";
import "./App.css";
import Home from "./components/home/Home.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import Form from "./components/form/Form";
import List from "./components/myNfts/NftList";
import AccountStatus from "./components/account/AccountStatus";
import { useEffect, useState } from "react";


const App = () => {
  const tokenAddress = "0x42e977953e7bfbe865D0cE0083B813cd28DA4B10";
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
      </Routes>
      </Router>
    }
    </>
   
  );

}

export default App;
