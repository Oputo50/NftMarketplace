import React, { useState, useEffect } from "react";
import MyTokenContract from "../../contracts/MyToken.json";
import MarketplaceContract from "../../contracts/Marketplace.json";
import { ethers } from "ethers";
import SendNft from "../popup/SendNft";
import SellNft from "../popup/SellNft";
import "./OwnedNfts.scss";
import { showSuccessMessage } from "../../utils/TriggerSnackbar";


const OwnedNfts = (props) => {

    const [nftData, setNftData] = useState();

    const [listedItems, setListedItems] = useState();

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const tokenContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);

    const marketplaceContract = new ethers.Contract(props.marketAddress, MarketplaceContract.abi, provider);

    const signer = provider.getSigner();

    const account = provider.listAccounts()[0];


    useEffect(() => {
        fetchOwnedNfts();
        fetchListedItems();
    }, [])


    const fetchOwnedNfts = async () => {
        const items = await tokenContract.connect(signer).getOwnedNfts();

        let tokensList = [];

        tokensList = await Promise.all(items.map(async (tokenId) => {
            tokenId = tokenId.toNumber();
            console.log(tokenId);

            const url = await tokenContract.connect(signer).tokenURI(tokenId);

            const { name, hash, createdBy } = await (await fetch("https://gateway.pinata.cloud/" + url)).json();

            return {
                name,
                hash,
                createdBy,
                tokenId
            }

        }));
    
        setNftData(tokensList);
    }

    const fetchListedItems = async () => {
        const items = await marketplaceContract.connect(signer).getListedItemsBySeller({from: account});

        let listedNfts = [];

        listedNfts = await Promise.all(items.map(async ({tokenId}) => {
            tokenId = tokenId.toNumber();
            console.log(tokenId);

            const url = await tokenContract.connect(signer).tokenURI(tokenId);

            const { name, hash, createdBy } = await (await fetch("https://gateway.pinata.cloud/" + url)).json();

            return {
                name,
                hash,
                createdBy,
                tokenId
            }

        }));
    
        setListedItems(listedNfts);
    }


    return (
        <div className="ownedNfts">
            <div className="title">
                <h1>Your NFT's</h1>
            </div>
            <div className="listingPrice">
                {'Listing price is ' + props.listingPrice + " ether" }
            </div>
            <div className="wrapper">

                {nftData && (
                    <div className="content-list">
                            {
                                nftData.map((nft, index) => (

                                    <div className="content">
                                        <div className="item">
                                            <div className="nft" key={index}>
                                                <div className="nft-name">
                                                    <h2>{nft.name}</h2>
                                                </div>
                                                <div className="nft-image">
                                                    <img className="image" src={"https://gateway.pinata.cloud/ipfs/" + nft.hash}></img>
                                                </div>
                                                <div className="nft-actions">
                                                    <SellNft tokenAddress={props.tokenAddress} marketAddress={props.marketAddress} tokenId={nft.tokenId} name={nft.name} listingPrice={props.listingPrice} />
                                                    <SendNft tokenAddress={props.tokenAddress} />
                                                </div>
                                            </div>

                                        </div>
                                    </div>


                                ))
                            }
                        
                    </div>

                )}


            </div>

        </div>

    )


}

export default OwnedNfts;

