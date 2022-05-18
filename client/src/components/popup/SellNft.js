import React, {useState} from 'react';
import { ethers } from 'ethers';
import { utils } from 'ethers';
import MyTokenContract from "../../contracts/MyToken.json"
import Marketplace from "../../contracts/Marketplace.json";

function SellNft(props) {
    const [open,setOpen] = useState(false);
    const [price,setPrice] = useState("");

    const handlePriceChange = (event) => {
        console.log(price);
        setPrice(event.target.value);
    }

    const sellNft = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        let overrides = {value: utils.parseEther("1")}
        console.log(signer);

        let marketplaceContract = new ethers.Contract(props.marketAddress, Marketplace.abi, provider);
        let myNftContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);
        myNftContract.connect(signer).approve(props.marketAddress, 1).then(function (res) {
            marketplaceContract.connect(signer).createMarketItem(props.tokenAddress,1,utils.parseEther('1'),overrides).then(function (res) {
                console.log(res);
            })
           
        })

       

    }

    return (
        <div className='sellNft'>
            <button onClick={()=>setOpen(!open)}></button>

            {open && (
            <div className="sendNft-popUp">
                <div>
                    <h5>Please enter NFT Price</h5>
                    <input onChange={handlePriceChange} className="mt-3" type="number"></input>
                </div>
                <div className="sendNftDiv">
                <button onClick={sellNft} className="btn btn-primary btn-sm">Sell</button>
                <button onClick={()=>setOpen(false)} className="mt-1 btn btn-secondary btn-sm">Cancel</button>
                </div>
            </div>
        )}
        </div>
    )
}

export default SellNft