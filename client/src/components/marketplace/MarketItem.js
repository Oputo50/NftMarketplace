import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import "./MarketItem.scss";
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';
import { ethers } from 'ethers';
import { showSuccessMessage } from '../../utils/TriggerSnackbar';

function MarketItem(props) {

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [userAccount, setUserAccount] = useState("");

  const [sellerAddress_toShow, setSellerAddress] = useState("");

  useEffect(() => {
    setSellerAddress(props.item.seller.substring(0, 8));
    provider.listAccounts().then((accounts) => {
      setUserAccount(accounts[0]);
    })

  }, [userAccount])

  const onBuyClick = async (item) => {
    await props.buyItem(item);
  }

  const copySellerToClipboard = (seller) => {
    navigator.clipboard.writeText(seller);
    showSuccessMessage("", "Seller address copied to clipboard");
  }

  return (
    <div className="content">
      <div className="item">
        <div className="market-item">
          <div className="market-item-name">
            <span>{props.item.name}</span>
          </div>
          <div className="market-item-image">
            <img className="image" alt='NFT' src={"https://gateway.pinata.cloud/ipfs/" + props.item.hash} onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "https://gateway.pinata.cloud/ipfs/QmTRN3uCaZAhDPpaL1Rudqar2JXH54ZmzypQoBogZMzfxM";
            }}></img>
          </div>
          <div className="market-item-actions">
            {
              props.seller !== userAccount && <button onClick={() => onBuyClick(props.item)}>Buy</button>
            }

            <div className="market-item-info">
              <span>Seller: <span style={{ "fontSize": "15px", "cursor": "pointer" }} onClick={() => copySellerToClipboard(props.item.seller)}>{sellerAddress_toShow + "..."}</span></span>
              <div className="price">
                <span>{"Price: " + props.item.price}</span>
                <FontAwesomeIcon icon={faEthereum} className="icon" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MarketItem