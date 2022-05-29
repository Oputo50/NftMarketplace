import React, { useState, useEffect } from "react";
import MyTokenContract from "../../contracts/MyToken.json";
import MarketplaceContract from "../../contracts/Marketplace.json";
import { ethers } from "ethers";
import "./OwnedNfts.scss";
import { showErrorMessage, showSuccessMessage } from "../../utils/TriggerSnackbar";
import Loader from "../loader/Loader";
import PopUp from "../popup/PopUp";
import ReList from "../actions/ReList";
import SellNft from "../actions/SellNft";
import SendNft from "../actions/SendNft";

const OwnedNfts = (props) => {

    const [nftData, setNftData] = useState();

    const [listedItems, setListedItems] = useState();

    const [unlistedItems, setUnlistedItems] = useState();

    const [activeTab, setActiveTab] = useState("UI");

    const [triggerUseEffect, setTriggerUseEffect] = useState(false);

    const [triggerLoader, setTriggerLoader] = useState(false);

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const tokenContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);

    const marketplaceContract = new ethers.Contract(props.marketAddress, MarketplaceContract.abi, provider);

    const signer = provider.getSigner();

    const account = provider.listAccounts()[0];


    useEffect(() => {
        setTriggerLoader(true);
        fetchOwnedNfts();
        fetchListedItems();

    }, [triggerUseEffect])

    useEffect(() => {
        if (activeTab === "LI") {
            setNftData(listedItems)
        } else {
            setNftData(unlistedItems);
        }
    }, [activeTab])

    useEffect(() => {

    }, [triggerLoader])


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

        setUnlistedItems(tokensList);
        setNftData(tokensList);
    }

    const fetchListedItems = async () => {
        const items = await marketplaceContract.connect(signer).getListedItemsBySeller();

        let listedNfts = [];

        listedNfts = await Promise.all(items.map(async ({ tokenId, itemId, seller, owner }) => {
            tokenId = tokenId.toNumber();
            itemId = itemId.toNumber();

            console.log(owner, seller,itemId, tokenId);

            const url = await tokenContract.connect(signer).tokenURI(tokenId);

            const { name, hash, createdBy } = await (await fetch("https://gateway.pinata.cloud/" + url)).json();

            return {
                name,
                hash,
                createdBy,
                tokenId,
                itemId
            }

        }));

        setListedItems(listedNfts);
        setTriggerLoader(false);
    }

    const cancelItem = async (itemId) => {
        const accounts = await provider.listAccounts();
        let account = accounts[0];

        try {
            await marketplaceContract.connect(signer).cancelListing(props.tokenAddress, itemId, { from: account });
            window.location.reload();
            showSuccessMessage("Success!", "Your item was unlisted.")
            setTriggerUseEffect(!triggerUseEffect);


            window.location.reload();
        } catch (error) {
            showErrorMessage(error.message);
            console.log(error);
        }


    }


    return (
        <>
            <Loader isActive={triggerLoader} />
            <div className="ownedNfts">
                <div className="title">
                    <h1>Your NFT's</h1>
                </div>
                <div className="listingPrice">
                    {'Listing price is ' + props.listingPrice + " ether"}
                </div>
                {listedItems && unlistedItems && <div className="tabs">
                    <div className={activeTab === "UI" ? "tab active" : "tab"} onClick={() => { setActiveTab("UI") }}>{"Unlisted items (" + unlistedItems.length + ")"}</div>
                    <div className={activeTab === "LI" ? "tab active" : "tab"} onClick={() => { setActiveTab("LI") }}>{"Listed items (" + listedItems.length + ")"}</div>
                </div>}
                <div className="wrapper">
                    {nftData && (
                        <div className="content-list">
                            {
                                nftData.map((nft, index) => (

                                    <div className="content" key={index}>
                                        <div className="item">
                                            <div className="nft">
                                                <div className="nft-name">
                                                    <h4>{nft.name}</h4>
                                                </div>
                                                <div className="nft-image">
                                                    <img className="image" loading="lazy" src={"https://gateway.pinata.cloud/ipfs/" + nft.hash}></img>
                                                </div>
                                                <div className="nft-actions">
                                                    {
                                                        activeTab === "UI" && <>
                                                            <PopUp buttonLabel={'Sell NFT'} content={<SellNft tokenAddress={props.tokenAddress} marketAddress={props.marketAddress} tokenId={nft.tokenId} name={nft.name} listingPrice={props.listingPrice} triggerReload={setTriggerUseEffect} />}/>
                                                            <PopUp buttonLabel={'Send NFT'}  content={<SendNft tokenAddress={props.tokenAddress} triggerReload={setTriggerUseEffect} />}/>
                                                        </>
                                                    }
                                                    {
                                                        activeTab === "LI" && <>
                                                             <PopUp buttonLabel={'Change   Price'} content={ <ReList tokenAddress={props.tokenAddress} marketAddress={props.marketAddress} name={nft.name} tokenId={nft.tokenId} itemId={nft.itemId} triggerReload={setTriggerUseEffect} />}/>  
                                                            <button onClick={() => { cancelItem(nft.itemId) }}>Cancel <br/> Listing</button>
                                                        </>
                                                    }

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

        </>

    )


}

export default OwnedNfts;

