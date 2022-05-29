import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import MyTokenContract from "../../contracts/MyToken.json"
import './Actions.scss';
import { showErrorMessage, showSuccessMessage } from "../../utils/TriggerSnackbar";

const SendNft = (props) => {
    const [toAddress, setToAddress] = useState("");

    const handleTextChange = (event) => {
        console.log(toAddress);
        setToAddress(event.target.value);
    }

    const sendNft = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();

        if (ethers.utils.isAddress(toAddress)) {
            var myNftContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);
            myNftContract.connect(signer).sendNft(toAddress, props.tokenId).then(function (res) {
                props.triggerReload();
                showSuccessMessage("Yay!", "Your NFT was successfully sent.");
            })
        } else {
            showErrorMessage("Oops!", "You must enter a valid address");
        }

    }

    return (    
            <div className="actions-content">
                <div>
                    <h5>Please insert a valid address</h5>
                    <input onChange={handleTextChange} className="mt-3" type="text"></input>
                </div>
                <div className="actions">
                    <button onClick={sendNft} className="btn btn-primary btn-sm">Send</button>
                </div>
            </div>

    )
}

export default SendNft;