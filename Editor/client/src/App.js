import React, { Component } from "react";
import MyTokenContract from "./contracts/MyToken.json";
import getWeb3OnLoad from "./getWeb3onLoad.js"
import "./App.css";
import Form from "./components/Form";
import List from "./components/List"

class App extends Component {

  constructor(props){
    super(props);
    this.state = {account: '',ownedNfts: [], tokenAddress: "", isLoading: true};
  }
  
  loadBlockchainData = async () => {


      const web3 = await getWeb3OnLoad();

      const nftAddress = "0xe0849C57488104ECD5af8525d3D6dE281a5F2319"

      var myContract = new web3.eth.Contract(MyTokenContract.abi,nftAddress);
  
      const accounts = await web3.eth.getAccounts();
  
      const tokenIds = await myContract.methods.balanceOf(accounts[0]).call();

      return{
        account: accounts[0], 
        ownedNfts: tokenIds, 
        tokenAddress: nftAddress
      }

    };

    componentDidMount(){
     this.loadBlockchainData().then((res) => {
      this.setState({account: res.account, ownedNfts: res.ownedNfts, tokenAddress: res.tokenAddress, isLoading: false});
     })
    }

  render() {
   
    return (
      <div className="App">
        <h1>Welcome to NFT CREATOR!</h1>
        <div>Your account:  {this.state.account}</div>
        <div>Number of FIL tokens owned by you: {this.state.ownedNfts}</div>
        <Form />
        {!this.state.isLoading &&  <List tokenAddress={this.state.tokenAddress} />}
      </div>
    );
  }
}

export default App;
