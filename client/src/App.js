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
import { showErrorMessage } from "./utils/TriggerSnackbar";


const App = () => {
  const tokenAddress = "0x2996A553F2bedEce3a7009251Aacc89521b8A247";
  const marketAddress = "0x63eD3670F09A62CBC5c7DDF98FAB09C84D4e936A";
  const [listingPrice, setListingPrice] = useState();

  const [isConnected, setIsConnected] = useState(false);

  const [chainId, setChainId] = useState(0);

  const [isMmInstalled, setIsMmInstalled] = useState(false);

  useEffect(() => {


    if (typeof window.ethereum !== 'undefined') {
      setIsMmInstalled(true);
    }

    if (isMmInstalled) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const marketplaceContract = new ethers.Contract(marketAddress, MarketplaceContract.abi, provider);
        const signer = provider.getSigner();
        getCurrNetwork();

        provider.listAccounts().then((accounts) => {

          if (accounts.length === 0) {
            setIsConnected(false)
          } else {
            setIsConnected(true);
            marketplaceContract.connect(signer).getListingPrice().then((price) => {
              price = ethers.utils.formatEther(price.toString());
              setListingPrice(price);
            })
          }

        })

      } catch (error) {
        setIsConnected(false);
      }
    }

  }, [isConnected,isMmInstalled,listingPrice])

  useEffect(() => {

    console.log("If you're seeing this log: Have a great day :D");

  }, [chainId]);

  try {
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload();
    })

    window.ethereum.on('networkChanged', function(networkId){
      window.location.reload();
    });
  } catch (error) {
    showErrorMessage(error.message);
  }

  const getCurrNetwork = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    let { chainId } = await provider.getNetwork();
    setChainId(chainId);

    if (chainId !== 5) {
      showErrorMessage("Wrong network!", "Please make sure you are connected to Goerli network.");
    }

  }


  const connectOnClick = async () => {
    try {
      let accountAddress = await window.ethereum.enable();
      if (accountAddress !== undefined) {
        setIsConnected(true);
      }
    } catch (error) {
      showErrorMessage("",error.message);
    }

  }


  return (
    <>

      <div className="App">
        <Router>
          {isConnected && <NavBar />}
          {isConnected && <AccountStatus isConnected={isConnected} />}
          <Routes>
            <Route exact path="/" element={<Home isMmInstalled = {isMmInstalled} tokenAddress={tokenAddress} connectOnClick={connectOnClick} isConnected={isConnected} />} />
            <Route path="/mint" element={<Mint tokenAddress={tokenAddress} />} />
            <Route path="/myNfts" element={<OwnedNfts tokenAddress={tokenAddress} marketAddress={marketAddress} listingPrice={listingPrice} />} />
            <Route path="/marketplace" element={<Marketplace tokenAddress={tokenAddress} marketAddress={marketAddress} />} />
          </Routes>
        </Router>
      </div>

    </>

  );

}

export default App;
