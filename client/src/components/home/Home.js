import React, {useEffect } from "react";
import './Home.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop, faWallet, faHammer } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons/faEthereum";
import { Link } from "react-router-dom";

const Home = (props) => {


  useEffect(() => {
  
  }, [props.isConnected])

  return (
    <>
      {props.isConnected &&
        <div className="home">
          <div className="title">
            <h1>Welcome to Puto's NFT Marketplace!</h1>
          </div>

          <div className="balance"><span> Marketplace balance: {props.marketBalance}</span> <FontAwesomeIcon icon={faEthereum}/></div>
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
      }

      {
        !props.isConnected && props.isMmInstalled && <div className="home-disabled">
          <h1>Please connect to a metamask wallet</h1>
          <button onClick={() => { props.connectOnClick() }}>Connect</button>
        </div>
      }
      {
        !props.isMmInstalled && <div className="home-disabled">
          <h4>To access the marketplace you must have metamask installed. You can install it here:</h4>
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer"><p>https://metamask.io/download/</p></a>
        </div>
      }

    </>
  );

}

export default Home;