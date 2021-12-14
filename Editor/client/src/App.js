import React from "react";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import getWeb3OnLoad from "./getWeb3onLoad";
import Form from "./components/Form";
import List from "./components/List";


const App = () => {
  const tokenAddress = "0x92F3A9Ac177a548d155Bc09DB3B3B24C50b2cE79";

  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload();
  })

    return (
        <Router>
       <NavBar/>
        <Routes>
          <Route exact path="/home" element={<Home tokenAddress={tokenAddress}/>}/>
          <Route path="/mint" element={<Form tokenAddress={tokenAddress}/>}/>
          <Route path="/myNfts" element={<List tokenAddress ={tokenAddress}/>}/>
        </Routes>
        </Router>
    );
  
}

export default App;
