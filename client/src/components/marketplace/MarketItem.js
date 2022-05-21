import React from 'react';
import "./MarketItem.scss";

function MarketItem(props) {

  return (
    <div className="content">
      <div className="item">
        <div className="nft">
          <div className="nft-name">
            <span>{props.name + ' #' + props.tokenId} </span>
          </div>
          <div className="nft-image">
            <img className="image" src={"https://gateway.pinata.cloud/ipfs/" + props.hash}></img>
          </div>
          <div className="nft-actions">
            <button>Buy</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MarketItem