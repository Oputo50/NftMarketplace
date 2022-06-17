import React, { useEffect, useState} from "react";
import {ethers} from "ethers";
import MyTokenContract from "../../contracts/MyToken.json";
import './Actions.scss';
import { showErrorMessage, showSuccessMessage } from "../../utils/TriggerSnackbar";

const SendNft = (props) => {
    const [toAddress, setToAddress] = useState('');
    const [isValid, setIsValid] = useState(false);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);
    const signer = provider.getSigner();

    useEffect(()=>{
        provider.on("block",()=>{
            tokenContract.on("Transfer", () => {
                props.openModal(false);
                props.startLoader(false);
                props.triggerReload();
                showSuccessMessage("Yay!", "Your NFT was successfully sent.");
            })
        })
      
    },[])

    useEffect(()=>{

    },[isValid]);
 
    const handleTextChange = (event) => {
        let address = event.target.value;
        setToAddress(address);
        console.log(address.length);
        if(address.length === 42){
            ethers.utils.isAddress(address) ? setIsValid(true) : setIsValid(false);
        }
    }

    const sendNft = async () => {

        if (ethers.utils.isAddress(toAddress)) {
           props.startLoader(true,"Sending token...");
           try {
            await tokenContract.connect(signer).sendNft(toAddress, props.tokenId);
           } catch (error) {
            props.startLoader(false);
            props.triggerReload();
            showErrorMessage(error.message);
           }
          
        } else {
            showErrorMessage("Oops!", "You must enter a valid address");
            
            
        }

    }

    return (    
            <div className="actions-content">
                <div>
                    <p>Please insert a valid address</p>
                    <input onChange={handleTextChange} className={isValid ? "address-input-validated" : "address-input"}></input>
                </div>
                <div className="actions">
                    <button className='action-btn' onClick={sendNft}>Send</button>
                </div>
            </div>

    )
}

export default SendNft;