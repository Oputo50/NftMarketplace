import React, { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import { utils } from 'ethers';
import MyTokenContract from "../../contracts/MyToken.json"
import Marketplace from "../../contracts/Marketplace.json";
import "./SendNft.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';
import { showErrorMessage } from '../../utils/TriggerSnackbar';


function SellNft(props) {
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState("");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const marketplaceContract = new ethers.Contract(props.marketAddress, Marketplace.abi, provider);
    const wrapperRef = useRef(null);

    const handlePriceChange = (event) => {
        console.log(price);
        setPrice(event.target.value);
    }

    useEffect(() => {

        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target) && open) {
              setOpen(false);
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };

    }, [open])


    marketplaceContract.on("MarketItemCreated", ({tokenId}) => {
        console.log(tokenId);
    })


    const sellNft = async () => {

        if(validatePrice()){
            const signer = provider.getSigner();

            let overrides = { value: utils.parseEther(props.listingPrice) };
          
            let myNftContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);
    
            const result = await myNftContract.connect(signer).approve(props.marketAddress, props.tokenId);
    
            await marketplaceContract.connect(signer).createMarketItem(props.tokenAddress, props.tokenId, utils.parseEther(price), overrides);
    
        } else {
            showErrorMessage("Oops!","NFT price must be greater than 0 ether");
        }
     
      

    }

    const validatePrice = () => {
        if(price <= 0){
            return false;
        } else {
            return true;
        }
    }

    return (
        <div className='popup' ref={wrapperRef}>
            <button onClick={() => setOpen(!open)}>Sell NFT</button>

            {open && ( 
                <div className="nft-popUp">
                    <div className="popup-content">
                        <div>
                        <h5>{"Please enter " + props.name + " #"+ props.tokenId + "'s price"}</h5>
                            <input onChange={handlePriceChange} className="mt-3" type="number" step="0.01" min="0"></input>
                            <FontAwesomeIcon style={{'marginLeft':'10px'}} icon={faEthereum}/>
                        </div>
                        <div className='actions'>
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