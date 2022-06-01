import React, { useEffect, useState} from "react";
import {ethers} from "ethers";
import MyTokenContract from "../../contracts/MyToken.json"
import './Actions.scss';
import { showErrorMessage, showSuccessMessage } from "../../utils/TriggerSnackbar";

const SendNft = (props) => {
    const [toAddress, setToAddress] = useState('');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const myNftContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);
    const signer = provider.getSigner();

    useEffect(() => {

    }, [toAddress]);

    const handleTextChange = (event) => {
        console.log(toAddress);
        setToAddress(event.target.value);
    }

    const sendNft = async () => {

        if (ethers.utils.isAddress(toAddress)) {
           props.startLoader(true);
           await myNftContract.connect(signer).sendNft(toAddress, props.tokenId);
           props.startLoader(false);
           props.triggerReload();
            showSuccessMessage("Yay!", "Your NFT was successfully sent.");
        } else {
            showErrorMessage("Oops!", "You must enter a valid address");
            
        }

    }

    return (    
            <div className="actions-content">
                <div>
                    <p>Please insert a valid address</p>
                    <input onChange={handleTextChange}></input>
                </div>
                <div className="actions">
                    <button className='action-btn' onClick={sendNft}>Send</button>
                </div>
            </div>

    )
}

export default SendNft;