import React from "react";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Form from "./components/Form";
import List from "./components/List";


const App = () => {
  const tokenAddress = "0x583e4f14c76129aDA162444199740f524D85e3D0";

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
