import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { utils } from 'ethers';
import ERC721 from "../../contracts/ERC721.json";
import Marketplace from "../../contracts/Marketplace.json";
import "./Actions.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';
import { showErrorMessage, showSuccessMessage, showWarningMessage } from '../../utils/TriggerSnackbar';


function SellNft(props) {
    const [price, setPrice] = useState("");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const marketplaceContract = new ethers.Contract(props.marketAddress, Marketplace.abi, provider);
    let myNftContract = new ethers.Contract(props.tokenAddress, ERC721.abi, provider);
    const signer = provider.getSigner();
    const overrides = { value: utils.parseEther(props.listingPrice)};

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    }

    const sellNft = async () => {

        if (validatePrice()) {
            await myNftContract.connect(signer).approve(props.marketAddress, props.tokenId);

            showWarningMessage("", "Approving...");

            props.startLoader(true);

            myNftContract.on("Approval", async () => {
                showSuccessMessage("Success!", "Approved.")
        
                try {
                   await marketplaceContract.connect(signer).createMarketItem(props.tokenAddress, props.tokenId, utils.parseEther(price), overrides);
                } catch (error) {
                    props.startLoader(false);
                    showErrorMessage(error.message);
                    props.triggerReload();
                }
            })
        
            marketplaceContract.on("MarketItemCreated", ({ tokenId }) => {
                props.startLoader(false);
                showSuccessMessage("Yay!", "You NFT was successfully listed!");
                props.triggerReload();
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
                <p>{"Please enter " + props.name + "'s price"}</p>
                <input onChange={handlePriceChange} className="mt-3" type="number" step="0.01" min="0"></input>
                <FontAwesomeIcon style={{ 'marginLeft': '10px' }} icon={faEthereum} size={"2x"} />
            </div>
            <div className='actions'>
                <button className='action-btn' onClick={() => sellNft()}>Sell</button>
            </div>
        </div>

    )
}

export default SellNft