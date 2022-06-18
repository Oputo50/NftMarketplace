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
import Addresses from "./utils/ContractAddresses.json";


const App = () => {
  const tokenAddress = Addresses.tokenAddress;

  const marketAddress = Addresses.marketAddress;

  const [listingPrice, setListingPrice] = useState();

  const [isConnected, setIsConnected] = useState(false);

  const [chainId, setChainId] = useState(0);

  const [isMmInstalled, setIsMmInstalled] = useState(false);

  const [provider, setProvider] = useState();

  const [marketBalance, setMarketBalance] = useState(0);
  const marketplaceContract = new ethers.Contract(marketAddress, MarketplaceContract.abi, provider);

  useEffect(() => {


    if (typeof window.ethereum !== 'undefined') {
      setIsMmInstalled(true);
      setProvider(new ethers.providers.Web3Provider(window.ethereum, "any"));
    }

    if (isMmInstalled) {
      try {

        getCurrNetwork();
        checkAccounts();
        getMarketBalance();

      } catch (error) {
        setIsConnected(false);
      }
    }

  }, [isConnected, isMmInstalled, listingPrice])

  useEffect(() => {

  }, [chainId, marketBalance]);

  try {
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload();
    })

    window.ethereum.on('networkChanged', function (networkId) {
      window.location.reload();
    });
  } catch (error) {
    showErrorMessage(error.message);
  }

  const getCurrNetwork = async () => {
    if(provider !== undefined){
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

      let { chainId } = await provider.getNetwork();
      setChainId(chainId);
  
      if (chainId !== 5) {
        showErrorMessage("Wrong network!", "Please make sure you are connected to Goerli network.");
      }
    }

  }

  const checkAccounts = async () => {
    let accounts = await provider.listAccounts();
    const signer = provider.getSigner();

    if (accounts.length === 0) {
      setIsConnected(false)
    } else {
      setIsConnected(true);
      let price = await marketplaceContract.connect(signer).getListingPrice();
      price = ethers.utils.formatEther(price.toString());
      setListingPrice(price);
    }

  }

  const getMarketBalance = async () => {
    if(provider !== undefined){
      let balance = await provider.getBalance(marketAddress);
      balance = ethers.utils.formatEther(balance.toString());
      setMarketBalance(balance);
    }
  }


  const connectOnClick = async () => {
    try {
      let accountAddress = await window.ethereum.enable();
      if (accountAddress !== undefined) {
        setIsConnected(true);
      }
    } catch (error) {
      showErrorMessage("", error.message);
    }

  }


  return (
    <>

      <div className="App">
        <Router>
          {isConnected && <NavBar />}
          {isConnected && <AccountStatus isConnected={isConnected} />}
          <Routes>
            <Route exact path="/" element={<Home isMmInstalled={isMmInstalled} tokenAddress={tokenAddress} connectOnClick={connectOnClick} isConnected={isConnected} marketBalance={marketBalance} />} />
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
