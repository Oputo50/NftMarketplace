import React from "react";
import "./App.css";
import Home from "./components/home/Home.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import Mint from "./components/mint/Mint";
import OwnedNfts from "./components/myNfts/OwnedNfts";
import Marketplace from "./components/marketplace/Marketplace";
import MarketplaceContract from "./contracts/Marketplace.json";
import AccountStatus from "./components/account/AccountStatus";
import { useEffect, useState } from "react";
import { ethers } from "ethers";


const App = () => {
  const tokenAddress = "0x7b637b6Eb1196a4d1047223d892E7Add2C35d709";
  const marketAddress = "0x687d7fdc486161FF340EFB2F10EDc1D7A836DcEd";

  const [listingPrice,setListingPrice] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const marketplaceContract = new ethers.Contract(marketAddress, MarketplaceContract.abi, provider);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum === undefined) {
      setIsConnected(false)
    } else {
      setIsConnected(true);
      marketplaceContract.connect(signer).getListingPrice().then((price) => {
        price = ethers.utils.formatEther(price.toString());
        setListingPrice(price);
        console.log(price);
      })
    }
  }, [])

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
        <div className="App">
          <Router>
            <NavBar />
            <AccountStatus isConnected={isConnected} />
            <Routes>
              <Route exact path="/" element={<Home tokenAddress={tokenAddress} />} />
              <Route path="/mint" element={<Mint tokenAddress={tokenAddress} />} />
              <Route path="/myNfts" element={<OwnedNfts tokenAddress={tokenAddress} marketAddress={marketAddress} listingPrice={listingPrice}/>} />
              <Route path="/marketplace" element={<Marketplace tokenAddress={tokenAddress} marketAddress={marketAddress} />} />
            </Routes>
          </Router>
        </div>

      }
    </>

  );

}

export default App;
