import React, { useState, useEffect } from 'react';
import "./Actions.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';
import { showErrorMessage, showSuccessMessage } from '../../utils/TriggerSnackbar';
import { ethers } from 'ethers';
import Marketplace from "../../contracts/Marketplace.json";

function ReList(props) {
  const [price, setPrice] = useState("");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const marketplaceContract = new ethers.Contract(props.marketAddress, Marketplace.abi, provider);

  useEffect(() => {
    marketplaceContract.provider.polling = false;
    provider.on("block",() => {
      marketplaceContract.on("ItemPriceChanged", () => {
        props.openModal(false);
        props.startLoader(false);
        showSuccessMessage("Yay!", "The price of your NFT have been succefully changed.");
        props.triggerReload();
      })
    })
  }, [props])

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  }

  const changePrice = async () => {
    try {
      props.startLoader(true,"Waiting for transaction...");
      await marketplaceContract.connect(signer).changeItemPrice(props.itemId, ethers.utils.parseEther(price));
    } catch (error) {
      showErrorMessage(error.message);
      props.startLoader(false);
    }
  }



  return (


    <div className="actions-content">
      <div>
        <p>{"Please enter " + props.name + "'s new price"}</p>
        <input onChange={handlePriceChange} className="mt-3" type="number" step="0.01" min="0"></input>
        <FontAwesomeIcon style={{ 'marginLeft': '10px' }} icon={faEthereum} size={"2x"} />
      </div>
      <div className='actions'>
        <button className='action-btn' onClick={changePrice}>Change Price</button>
      </div>
    </div>

  )
}

export default ReList