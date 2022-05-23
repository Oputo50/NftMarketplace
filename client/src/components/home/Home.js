import React, { useState, useEffect } from "react";
import MyTokenContract from "../../contracts/MyToken.json";
import { Contract, ethers } from "ethers";
import './Home.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop, faWallet, faHammer } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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

          <Link to={"/marketplace"} className="tab">
          <div className="tab-1">
            <div className="message-1">
              <h1>Marketplace</h1>
            </div>
            <div className="icon">
              <FontAwesomeIcon icon={faShop} size={"3x"} />
            </div>
          </div>
          </Link>

          <Link to={"/mint"} className="tab">
                 
          <div className="tab-2">
            <div className="message-2">
              <h1>Mint Your NFT</h1>
            </div>
            <div className="icon">
              <FontAwesomeIcon icon={faHammer} size={"3x"} />
            </div>
          </div>

          </Link>

          <Link to={"/myNfts"} className="tab">
          <div className="tab-3">
            <div className="message-3">
              <h1>Your NFTs</h1>
            </div>
            <div className="icon">
              <FontAwesomeIcon icon={faWallet} size={"3x"} />
            </div>

          </div>
          </Link>
 
        </div>
      </div>

    </>
  );

}

export default Home;