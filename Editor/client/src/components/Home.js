import React, {useState, useEffect } from "react";
import MyTokenContract from "../contracts/MyToken.json";
import getWeb3OnLoad from "../getWeb3onLoad.js"
import "../App.css";
import List from "../components/List";
import Form from "../components/Form";
import Web3 from "web3";

const Home = (props) => {
   
  const [account,setAccount] = useState("");

  const [ownedNfts, setOwnedNfts] = useState([]);

  useEffect (() => {
   loadBlockchainData();
}, [account, ownedNfts])

  
  const loadBlockchainData = async () => {

    console.log("LOADING BC DATA")
    
     const web3 = new Web3(window.ethereum);

      var myContract = new web3.eth.Contract(MyTokenContract.abi,props.tokenAddress);
  
      const accounts = await web3.eth.getAccounts();
  
      const tokenIds = await myContract.methods.balanceOf(accounts[0]).call();

      console.log("on loading blockchain data : " + accounts[0] + tokenIds)

      setAccount(accounts[0]);
      setOwnedNfts(tokenIds);

      
   

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