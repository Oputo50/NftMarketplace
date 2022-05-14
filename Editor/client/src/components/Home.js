import React, {useState, useEffect } from "react";
import MyTokenContract from "../contracts/MyToken.json";
import "../App.css";
import {Contract, ethers} from "ethers";

const Home = (props) => {
   
  const [account,setAccount] = useState("");

  const [ownedNfts, setOwnedNfts] = useState([]);

  useEffect (() => {
   loadBlockchainData();
}, [account, ownedNfts])

  
  const loadBlockchainData = async () => {

      const provider = new ethers.providers.Web3Provider(window.ethereum);
    
      var myContract = new Contract(props.tokenAddress,MyTokenContract.abi,provider);
  
      const signer = provider.getSigner();

      signer.getAddress().then(function(res){
        setAccount(res);
      })
  
      const totalTokens = await myContract.balanceOf(account);

      console.log("on loading blockchain data : " + account)

      setOwnedNfts(totalTokens.toNumber());

    };

    return (
      <div className="App">
        <h1>Welcome to NFT CREATOR!</h1>
        <div>Your account:  {account}</div>
        <div>Number of FIL tokens owned by you: {ownedNfts}</div>
      </div>
    );
  
}

export default Home;