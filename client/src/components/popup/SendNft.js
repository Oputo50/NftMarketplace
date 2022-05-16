import React, {useState} from "react";
import { ethers } from "ethers";
import MyTokenContract from "../../contracts/MyToken.json"
import Marketplace from "../../contracts/Marketplace.json";
import './SendNft.scss';
//#ffb6c1

const PopUp = (props) => {
    const [open,setOpen] = useState(false);
    const [toAddress,setToAddress] = useState("");

    const handleTextChange = (event) => {
        console.log(toAddress);
        setToAddress(event.target.value);
    }

    const sendNft = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();
        
        var myNftContract = new ethers.Contract(props.tokenAddress,MyTokenContract.abi, provider);
        myNftContract.connect(signer).sendNft(toAddress,props.tokenId).then(function(res){
            window.location.reload()
            console.log(res)
        })
    }


    return(


        <div>    
        <button
          className ="btn btn-secondary"
          onClick={() => setOpen(!open)}
        >
            Send NFT
        </button>
        {open && (
            <div className="sendNft-popUp">
                <div>
                    <h5>Please enter the token receiver address</h5>
                    <input onChange={handleTextChange} className="mt-3" type="text"></input>
                </div>
                <div className="sendNftDiv">
                <button onClick={sendNft} className="btn btn-primary btn-sm">Send</button>
                <button onClick={()=>setOpen(false)} className="mt-1 btn btn-secondary btn-sm">Cancel</button>
                </div>
            </div>
        )}
        </div>

    )
}

export default PopUp;