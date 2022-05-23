import React, {useEffect, useState, useRef} from "react";
import { ethers } from "ethers";
import MyTokenContract from "../../contracts/MyToken.json"
import './SendNft.scss';
import { showErrorMessage } from "../../utils/TriggerSnackbar";

const PopUp = (props) => {
    const [open,setOpen] = useState(false);
    const [toAddress,setToAddress] = useState("");
    const wrapperRef = useRef(null);

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
    },[,open]);

    const handleTextChange = (event) => {
        console.log(toAddress);
        setToAddress(event.target.value);
    }

    const sendNft = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();

        if(ethers.utils.isAddress(toAddress)){
            var myNftContract = new ethers.Contract(props.tokenAddress,MyTokenContract.abi, provider);
            myNftContract.connect(signer).sendNft(toAddress,props.tokenId).then(function(res){
                window.location.reload()
                console.log(res)
            })
        } else {
            showErrorMessage("Oops!","You must enter a valid address");
        }
        
      
    }


    return(


        <div className="popup" ref={wrapperRef}>    
        <button onClick={() => setOpen(!open)}>
            Send NFT
        </button>
        {open && (
            <div className="nft-popUp">
                <div className="popup-content">
                <div>
                    <h5>Please insert a valid address</h5>
                    <input onChange={handleTextChange} className="mt-3" type="text"></input>
                </div>
                <div className="actions">
                <button onClick={sendNft} className="btn btn-primary btn-sm">Send</button>
                <button onClick={()=>setOpen(false)} className="mt-1 btn btn-secondary btn-sm">Cancel</button>
                </div>
                </div>
            </div>
        )}
        </div>

    )
}

export default PopUp;