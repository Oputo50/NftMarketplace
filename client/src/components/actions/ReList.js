import React, {useEffect, useState, useRef} from 'react';
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

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    }

    const changePrice = async () => {
      try {
        await marketplaceContract.connect(signer).changeItemPrice(props.itemId, ethers.utils.parseEther(price));
        props.triggerReload();
        showSuccessMessage("Yay!","The price of your NFT have been succefully changed.");
      } catch (error) {
        showErrorMessage(error.message)
      }
    }

  return (
  
       
            <div className="actions-content">
                <div>
                <h5>{"Please enter " + props.name + " #"+ props.tokenId + "'s price"}</h5>
                    <input onChange={handlePriceChange} className="mt-3" type="number" step="0.01" min="0"></input>
                    <FontAwesomeIcon style={{'marginLeft':'10px'}} icon={faEthereum}/>
                </div>
                <div className='actions'>
                    <button onClick={changePrice}>Change Price</button>
                </div>
            </div>

  )
}

export default ReList