import React, { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import { utils } from 'ethers';
import MyTokenContract from "../../contracts/MyToken.json"
import Marketplace from "../../contracts/Marketplace.json";
import "./Actions.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';
import { showErrorMessage, showSuccessMessage, showWarningMessage } from '../../utils/TriggerSnackbar';


function SellNft(props) {
    const [price, setPrice] = useState("");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const marketplaceContract = new ethers.Contract(props.marketAddress, Marketplace.abi, provider);

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    }

    const sellNft = async () => {

        if (validatePrice()) {
            const signer = provider.getSigner();

            let overrides = { value: utils.parseEther(props.listingPrice) };

            let myNftContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);

            await myNftContract.connect(signer).approve(props.marketAddress, props.tokenId);

            showWarningMessage("", "Approving...");

            await marketplaceContract.connect(signer).createMarketItem(props.tokenAddress, props.tokenId, utils.parseEther(price), overrides);

            marketplaceContract.on("MarketItemCreated", ({ tokenId }) => {
                window.location.reload();

                setTimeout(() => {
                    showSuccessMessage("Yay!", "Your NFT was successfully listed.");
                }, 2000);
              

            })

        } else {
            showErrorMessage("Oops!", "NFT price must be greater than 0 ether");
        }



    }

    const validatePrice = () => {
        if (price <= 0) {
            return false;
        } else {
            return true;
        }
    }

    return (

            <div className="actions-content">
                <div>
                    <h5>{"Please enter " + props.name + " #" + props.tokenId + "'s price"}</h5>
                    <input onChange={handlePriceChange} className="mt-3" type="number" step="0.01" min="0"></input>
                    <FontAwesomeIcon style={{ 'marginLeft': '10px' }} icon={faEthereum} />
                </div>
                <div className='actions'>
                    <button onClick={sellNft} className="btn btn-primary btn-sm">Sell</button>
                </div>
            </div>

    )
}

export default SellNft