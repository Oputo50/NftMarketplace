import React, { PureComponent, useEffect, useState } from 'react';
import MyTokenContract from "../../contracts/MyToken.json";
import "./Mint.scss"
import axios from "axios";
import { PinataKeys } from "../../utils/PinataKeys";
import { ethers, utils } from 'ethers';
import { showErrorMessage, showSuccessMessage } from '../../utils/TriggerSnackbar';


function Mint(props) {

    const [nftName, setNftName] = useState("");

    const [uploadedFile, setUploadedFile] = useState(null);

    const [imageUrl, setImageUrl] = useState("");

    const [artistName, setArtistName] = useState("");

    const [canMint, setCanMint] = useState(false);

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const myContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);

    useEffect(() => {
        checkCanMint();
    }, [artistName, imageUrl, nftName, canMint])


    const mintNft = async (nftHash, metadataHash) => {

        try {
            await myContract.connect(signer).mint(nftHash, metadataHash);

            myContract.on("tokenMint", (tokenId) => {

                showSuccessMessage("Congratulations!", "NFT successfully minted!");
                reloadFields();
            })

        } catch (error) {
            showErrorMessage(error.message);
        }

    };

    const handleNftNameOnChange = (event) => {
        setNftName(event.target.value);

    }

    const handleArtistNameOnChange = (event) => {
        setArtistName(event.target.value);
    }

    const placeholderOnClick = () => {
        document.getElementById('uploadImage').click();
    }

    const handleSubmit = () => {

        try {
            pinFileToIPFS(uploadedFile);
        } catch (error) {
            showErrorMessage("Something went wrong!", error.message);
        }

    }

    const checkCanMint = () => {
        if (nftName !== "" && artistName !== "" && imageUrl !== "") {
            setCanMint(true);
        }

        if (canMint && (nftName === '' || artistName === '' || imageUrl === '')) {
            setCanMint(false);
        }
    }

    const reloadFields = () => {

        setUploadedFile(null);
        setNftName("");
        setArtistName("");
        setImageUrl("");

        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
          );
       
    }

    const fileOnChange = (event) => {
        event.preventDefault();

        let reader = new FileReader();

        let file = event.target.files[0];

        setUploadedFile(file);

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
        }).then(function (response) {
            console.log(response.data.IpfsHash)

            return response.data.IpfsHash

        }).then(function (hash) {

            axios.post(jsonUrl, {
                "name": nftName,
                "hash": hash,
                "createdBy": artistName
            }, {
                headers: {
                    pinata_api_key: PinataKeys[0].apiKey,
                    pinata_secret_api_key: PinataKeys[0].apiSecret,
                }
            }).then(function (response) {

                const metadataHash = "ipfs/" + response.data.IpfsHash;

                mintNft(hash, metadataHash);
            }).catch(function (error) {
                console.log(error);
            })
        })

    };


    return (
        <div className="mint">
            <div className="title">
                <h1>Mint Your NFT</h1>
            </div>
            <div className="main">
                <div className="wrapper">
                    <div className="left">
                        <div className="inputBox">
                            <label className="boldFont">Type your NFT name</label>
                            <input type="text" onKeyUp={handleNftNameOnChange} className="inputField"></input>
                        </div>


                        <input id='uploadImage' type="file" onChange={fileOnChange} className="inputField imageInput"></input>

                        <div className="inputBox">
                            <label className="boldFont">Artist Name</label>
                            <input type="text" onKeyUp={handleArtistNameOnChange} className="inputField"></input>
                        </div>
                    </div>

                    <div className="right">
                        <div className="imageCtn">
                            {imageUrl && <img src={imageUrl} className="image"></img>}
                            {imageUrl === '' && <div className="image" onClick={placeholderOnClick}><h1>Please upload an image</h1></div>}
                        </div>
                    </div>
                </div>

                <div className="button">
                    <div onClick={canMint ? handleSubmit : undefined} className={canMint ? 'mintBtn' : "mintBtn-disabled"}><span>Mint</span></div>
                </div>
            </div>

        </div>
    )
}

export default Mint