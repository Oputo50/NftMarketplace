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
    const overrides = { value: utils.parseEther(props.listingPrice) };
    const [isApproved, setIsApproved] = useState();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const marketplaceContract = new ethers.Contract(props.marketAddress, Marketplace.abi, provider);
    let myNftContract = new ethers.Contract(props.tokenAddress, ERC721.abi, provider);
    const signer = provider.getSigner();

    useEffect(() => {

        marketplaceContract.provider.polling = false;
        myNftContract.provider.polling = false;
        
        myNftContract.on("Approval", async () => {
            showSuccessMessage("Success!", "Approved.");
            setIsApproved(true);
            props.startLoader(false);
        })

        marketplaceContract.on("MarketItemCreated", ({ tokenId }) => {
            Array.from(document.getElementsByClassName("root")).forEach(
                el => (el.click())
            );
            props.startLoader(false);
            showSuccessMessage("Yay!", "You NFT was successfully listed!");
            props.triggerReload();
        })
    }, [isApproved]);

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    }

    const approveToken = async () => {
        props.startLoader(true);
        try {
            await myNftContract.connect(signer).approve(props.marketAddress, props.tokenId);
        } catch (error) {
            props.startLoader(false);
            showErrorMessage(error.message);
        }

        showWarningMessage("", "Approving...");

    }

    const sellNft = async () => {


        if (validatePrice()) {
            props.startLoader(true);

            if (isApproved) {
                try {
                    await marketplaceContract.connect(signer).createMarketItem(props.tokenAddress, props.tokenId, utils.parseEther(price), overrides);
                } catch (error) {
                    props.startLoader(false);
                    showErrorMessage(error.message);
                    props.triggerReload();
                }

            }

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
            {isApproved && <div>
                <p>{"Please enter " + props.name + "'s price"}</p>
                <input onChange={handlePriceChange} className="mt-3" type="number" step="0.01" min="0"></input>
                <FontAwesomeIcon style={{ 'marginLeft': '10px' }} icon={faEthereum} size={"2x"} />
            </div>
            }

            {!isApproved &&
                <div>
                    <p>{"Please approve the marketplace to move your token."}</p>
                </div>
            }

            <div className='actions'>
                {isApproved ? <button className='action-btn' onClick={() => sellNft()}>Sell</button> : <button className='action-btn' onClick={() => approveToken()}>Approve</button>}
            </div>
        </div>

    )
}

export default SellNft