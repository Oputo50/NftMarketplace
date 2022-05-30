import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import "./MarketItem.scss";
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';
import { ethers } from 'ethers';
import { showErrorMessage, showSuccessMessage } from '../../utils/TriggerSnackbar';

function MarketItem(props) {

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const [userAccount, setUserAccount] = useState("");


  useEffect(() => {
    provider.listAccounts().then((accounts) => {
      setUserAccount(accounts[0]);
    })


  }, [userAccount])

  const onBuyClick = async () => {
    console.log(userAccount);
    try {
      await props.marketPlace.connect(signer).sellMarketItem(props.tokenAddress, props.item.itemId, { value: ethers.utils.parseEther(props.item.price) });
      showSuccessMessage("Comgratulations!", "You have successfully bought " + props.item.name + " NFT.");
      props.triggerReload();
    } catch (error) {
      showErrorMessage("Something went wrong!", error.message);
    }
  }

  return (
    <div className="content">
      <div className="item">
        <div className="market-item">
          <div className="market-item-name">
            <h4>{props.item.name + ' #' + props.item.tokenId} </h4>
          </div>
          <div className="market-item-image">
            <img className="image" src={"https://gateway.pinata.cloud/ipfs/" + props.item.hash}></img>
          </div>
          <div className="market-item-actions">
            {
              props.seller !== userAccount && <button onClick={onBuyClick}>Buy</button>
            }

            <div className="price">
              <span>{"Price: " + props.item.price}</span>
              <FontAwesomeIcon icon={faEthereum} className="icon" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MarketItem