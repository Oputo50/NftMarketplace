import React, { useState } from 'react';
import { ethers } from 'ethers';
import { utils } from 'ethers';
import MyTokenContract from "../../contracts/MyToken.json"
import Marketplace from "../../contracts/Marketplace.json";
import "./SendNft.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';

function SellNft(props) {
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState("");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const marketplaceContract = new ethers.Contract(props.marketAddress, Marketplace.abi, provider);

    const handlePriceChange = (event) => {
        console.log(price);
        setPrice(event.target.value);
    }

    marketplaceContract.on("MarketItemCreated", ({tokenId}) => {
        console.log(tokenId);
    })


    const sellNft = async () => {
     
        const signer = provider.getSigner();

        let overrides = { value: utils.parseEther(props.listingPrice) };
      
        let myNftContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);

        const result = await myNftContract.connect(signer).approve(props.marketAddress, props.tokenId);

        console.log(marketplaceContract);

        const sell = await marketplaceContract.connect(signer).createMarketItem(props.tokenAddress, props.tokenId, utils.parseEther(price), overrides);

        console.log(sell);

    }

    return (
        <div className='sellNft'>
            <button onClick={() => setOpen(!open)}>Sell NFT</button>

            {open && (
                <div className="nft-popUp">
                    <div className="popup-content">
                        <div>
                        <h5>{"Please enter " + props.name + " #"+ props.tokenId + "'s price"}</h5>
                            <input onChange={handlePriceChange} className="mt-3" type="number" step="0.01" min="0"></input>
                            <FontAwesomeIcon style={{'marginLeft':'10px'}} icon={faEthereum}/>
                        </div>
                        <div className="actions">
                            <button onClick={sellNft} className="btn btn-primary btn-sm">Sell</button>
                            <button onClick={() => setOpen(false)} className="mt-1 btn btn-secondary btn-sm">Cancel</button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default SellNft