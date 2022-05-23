import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import "./MarketItem.scss";
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';
import { ethers } from 'ethers';
import { showErrorMessage, showSuccessMessage } from '../../utils/TriggerSnackbar';

function MarketItem(props) {

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const onBuyClick = async () => {
    try {
      await props.marketPlace.connect(signer).sellMarketItem(props.tokenAddress,props.item.itemId,{value:ethers.utils.parseEther(props.item.price)});
      showSuccessMessage("Comgratulations!","You have successfully bought " + props.item.name + " NFT.");
    } catch (error) {
      showErrorMessage("Something went wrong!",error.message);
    }
  }

  return (
    <div className="content">
      <div className="item">
        <div className="nft">
          <div className="nft-name">
            <span>{props.item.name + ' #' + props.item.tokenId} </span>
          </div>
          <div className="nft-image">
            <img className="image" src={"https://gateway.pinata.cloud/ipfs/" + props.item.hash}></img>
          </div>
          <div className="nft-actions">
            <button onClick={onBuyClick}>Buy</button>
            <div className="price">
              <span>{"Price: " + props.item.price}</span>
              <FontAwesomeIcon icon={faEthereum} className="icon"/>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MarketItem