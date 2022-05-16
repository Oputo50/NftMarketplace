import React, { PureComponent, useEffect, useState } from 'react';
import MyTokenContract from "../../contracts/MyToken.json";
import Web3 from "web3";
import "./Form.scss"
import axios from "axios";
import {PinataKeys} from "../../utils/PinataKeys";


function Form(props) {

   const [nftName,setNftName] = useState("");

   const [uploadedFile,setUploadedFile] = useState(null);

   const [imageUrl, setImageUrl] = useState("");

   const [artistName,setArtistName] = useState("");

   useEffect(() => {
    
   },[uploadedFile, imageUrl])

   

    const mintNft = async (nftHash,metadataHash) => {
    
        const web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.getAccounts();

        const myContract = new web3.eth.Contract(MyTokenContract.abi,props.tokenAddress);
        console.log("Nft will mint with nftHash: " + nftHash + " metadata hash: " +metadataHash);
        try {
            await myContract.methods.mint(nftHash,metadataHash).send({from: accounts[0], to: props.tokenAddress});
        } catch (error) {
            console.log(error);
        }
      
        console.log("it minted")

        };

    const handleNftNameOnChange = (event) => {
        setNftName(event.target.value)
    }

    const handleArtistNameOnChange = (event) => {
        setArtistName(event.target.value);
    }

    const handleSubmit = (event) => {

        try {
            pinFileToIPFS(uploadedFile);
        } catch (error) {
            console.log(error);
        }
       
       
       
    }

    const fileOnChange = (event) => {
        event.preventDefault();

        let reader = new FileReader();
    
        let file = event.target.files[0];

        setUploadedFile(file)

        reader.onloadend = () => {
            console.log("reading file");
             setImageUrl(reader.result);
        }

        reader.readAsDataURL(file);

    }

    const pinFileToIPFS = async (file) => {
        const fileUrl = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        const jsonUrl = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

        let nftImage = new FormData();

        nftImage.append("file", file);

       
        axios.post(fileUrl, nftImage, {
          maxContentLength: "Infinity", 
          headers: {
            "Content-Type": `multipart/form-data; boundary=${nftImage._boundary}`,
            pinata_api_key: PinataKeys[0].apiKey, 
            pinata_secret_api_key: PinataKeys[0].apiSecret,
          }
        }).then(function(response){
            console.log(response.data.IpfsHash)

            return response.data.IpfsHash
          
        }).then(function(hash){
    
            axios.post(jsonUrl, {
                "name": nftName,
                "hash": hash,
                "Created By": artistName
            }, {
                headers: {
                  pinata_api_key: PinataKeys[0].apiKey, 
                  pinata_secret_api_key: PinataKeys[0].apiSecret,
                }
              }).then(function(response){
                  console.log(response);
                  console.log(response.data);
                 const metadataHash = "ipfs/"+response.data.IpfsHash;

                  mintNft(hash,metadataHash);
              }).catch(function(error){
                  console.log(error);
              })
        })

        
        
       
      }; 
    

    return(
                <div className="form">
                    <div className="inputBox">
                    <label className="boldFont">Type your NFT name here: </label>
                    <input type="text" onChange={handleNftNameOnChange} className="inputField"></input>
                    </div>
                    <div className="inputBox">
                    <label className="boldFont">Upload your NFT image</label>
                    <input type="file" onChange={fileOnChange} className="inputField"></input>
                    </div>
                    <div className="inputBox">
                    <label className="boldFont">Artist Name</label>
                    <input type="text" onChange={handleArtistNameOnChange} className="inputField"></input>
                    </div>
                     {imageUrl && <img src={imageUrl}></img>} 
                    <button onClick={handleSubmit} className=" mintbtn m-5 btn btn-primary btn-sm">Mint</button>
                </div>
    )
}

export default Form