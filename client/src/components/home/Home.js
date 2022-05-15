import React, { useState, useEffect } from "react";
import MyTokenContract from "../../contracts/MyToken.json";
import { Contract, ethers } from "ethers";
import './Home.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop, faWallet } from "@fortawesome/free-solid-svg-icons";

const Home = (props) => {

  const [account, setAccount] = useState("");

  const [ownedNfts, setOwnedNfts] = useState([]);

  useEffect(() => {
    loadBlockchainData();
  }, [account, ownedNfts])


  const loadBlockchainData = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    var myContract = new Contract(props.tokenAddress, MyTokenContract.abi, provider);

    const signer = provider.getSigner();

    signer.getAddress().then(function (res) {
      setAccount(res);
    })

    const totalTokens = await myContract.balanceOf(account);

    console.log("on loading blockchain data : " + account)

    setOwnedNfts(totalTokens.toNumber());

  };

  return (
    <>
      <div className="home">
        <div className="title">
          <h1>Welcome to NFT CREATOR!</h1>
        </div>


        <div className="wrapper">
          <div className="left">
            <div className="icon">
              <FontAwesomeIcon icon={faShop} size={"3x"}></FontAwesomeIcon>
            </div>

          </div>

          <div className="right">
            <div className="icon">
              <FontAwesomeIcon icon={faWallet} size={"3x"}></FontAwesomeIcon>
            </div>

          </div>
        </div>
      </div>

    </>
  );

}

export default Home;