import React, { useState, useEffect } from "react";
import MyTokenContract from "../../contracts/MyToken.json";
import MarketplaceContract from "../../contracts/Marketplace.json";
import { ethers } from "ethers";
import "./OwnedNfts.scss";
import { showErrorMessage, showSuccessMessage } from "../../utils/TriggerSnackbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons/faEthereum";
import Loader from "../loader/Loader";
import PopUp from "../popup/PopUp";
import ReList from "../actions/ReList";
import SellNft from "../actions/SellNft";
import SendNft from "../actions/SendNft";
import Tooltip from "../tooltip/Tooltip";

const OwnedNfts = (props) => {

    const [nftData, setNftData] = useState();

    const [listedItems, setListedItems] = useState();

    const [unlistedItems, setUnlistedItems] = useState();

    const [activeTab, setActiveTab] = useState("UI");

    const [triggerReload, setTriggerReload] = useState(false);

    const [triggerLoader, setTriggerLoader] = useState(false);

    const [loaderMessage, setLoaderMessage] = useState("");

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const tokenContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);

    const marketplaceContract = new ethers.Contract(props.marketAddress, MarketplaceContract.abi, provider);

    const signer = provider.getSigner();

    useEffect(() => {
        marketplaceContract.provider.polliing = false;
        tokenContract.provider.polling = false;
        marketplaceContract.on("ItemCancelled", ({ tokenId }) => {
            setTriggerLoader(false);
            showSuccessMessage("Success!", "Your item was unlisted.");
            refreshComponent();
        })
    }, [])

    useEffect(() => {
        if (!triggerLoader) {
            setLoaderMessage("Loading your tokens...")
            setTriggerLoader(true);
            fetchOwnedNfts();
            fetchListedItems();
            setTriggerLoader(false);
        }

    }, [triggerReload, triggerLoader])

    useEffect(() => {
        if (activeTab === "LI") {
            setNftData(listedItems)
        } else {
            setNftData(unlistedItems);
        }

    }, [activeTab, nftData, triggerLoader, listedItems, unlistedItems])

    const refreshComponent = () => {
        setTriggerReload(!triggerReload);
    }

    const startLoader = (isOpen, msg) => {
        setLoaderMessage(msg);
        setTriggerLoader(isOpen);
    }

    const fetchOwnedNfts = async () => {
        const items = await tokenContract.connect(signer).getOwnedNfts();
        let tokens = items.filter((x) => { return x > 0 });
        let tokensList = [];

        tokensList = await Promise.all(tokens.map(async (tokenId) => {
            tokenId = tokenId.toNumber();

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
        setNftData(activeTab === "UI" ? tokensList : []);
    }

    const fetchListedItems = async () => {
        const items = await marketplaceContract.connect(signer).getListedItemsBySeller();

        let listedNfts = [];

        listedNfts = await Promise.all(items.map(async ({ tokenId, itemId, price }) => {
            tokenId = tokenId.toNumber();
            itemId = itemId.toNumber();
            price = ethers.utils.formatEther(price);

            const url = await tokenContract.connect(signer).tokenURI(tokenId);

            const { name, hash, createdBy } = await (await fetch("https://gateway.pinata.cloud/" + url)).json();

            return {
                name,
                hash,
                createdBy,
                tokenId,
                itemId,
                price
            }

        }));

        setListedItems(listedNfts);
        setNftData(activeTab === "LI" ? listedNfts : []);
    }

    const cancelItem = async (itemId) => {

        try {
            startLoader(true, "Cancelling...")
            await marketplaceContract.connect(signer).cancelListing(props.tokenAddress, itemId);
        } catch (error) {
            showErrorMessage(error.message);
            setTriggerLoader(false);
        }

    }


    return (
        <>
            <Loader isActive={triggerLoader} message={loaderMessage}/>
            <div className="ownedNfts">
                <div className="title">
                    <h1>Your NFT's</h1>
                </div>
                {listedItems && unlistedItems &&
                    <div className="tabs-wrapper">
                        <div className="tabs">
                            <div className={activeTab === "UI" ? "tab active" : "tab"} onClick={() => { setActiveTab("UI") }}>{"Unlisted items (" + unlistedItems.length + ")"}</div>
                            <div className={activeTab === "LI" ? "tab active" : "tab"} onClick={() => { setActiveTab("LI") }}>{"Listed items (" + listedItems.length + ")"}</div>
                        </div>
                        <div className="listing-price">
                            <div className="price-tooltip">
                                <Tooltip content={<FontAwesomeIcon icon={faCircleInfo} size={"3x"} />} text={"Listing price is " + props.listingPrice + " ether."}></Tooltip>
                            </div>

                        </div>
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
                                                    <span>{nft.name}</span>
                                                </div>
                                                <div className="nft-image">
                                                    {nft.hash !== undefined && <img alt="NFT" className="image" loading="lazy" src={"https://gateway.pinata.cloud/ipfs/" + nft.hash}></img>}
                                                    {nft.hash === undefined && <div className="eror-image"><span>Error fetching image.</span></div>}
                                                </div>
                                                <div className="nft-actions">
                                                    {
                                                        activeTab === "UI" && <>
                                                            <PopUp isLoading={triggerLoader} buttonLabel={'Sell NFT'} content={<SellNft tokenAddress={props.tokenAddress} triggerReload={refreshComponent} startLoader={startLoader} marketAddress={props.marketAddress} tokenId={nft.tokenId} itemId={nft.itemId} name={nft.name} listingPrice={props.listingPrice} />} />
                                                            <PopUp isLoading={triggerLoader} buttonLabel={'Send NFT'} content={<SendNft tokenAddress={props.tokenAddress} triggerReload={refreshComponent} startLoader={startLoader} tokenId={nft.tokenId} />} />
                                                        </>
                                                    }
                                                    {
                                                        activeTab === "LI" && <>
                                                            <div className="edit-price">
                                                                <div style={{ 'color': 'black' }}>
                                                                    <div style={{ 'fontSize': '1.2em' }}>Price:</div>
                                                                    <span style={{ 'fontSize': '1.2em' }}>{nft.price}</span>
                                                                    <FontAwesomeIcon className="edit-icon" icon={faEthereum} />
                                                                </div>
                                                                <div style={{"marginTop":"10px"}} >
                                                                    <PopUp isLoading={triggerLoader} buttonLabel={<FontAwesomeIcon icon={faPenToSquare} />} content={<ReList tokenAddress={props.tokenAddress} marketAddress={props.marketAddress} triggerReload={refreshComponent} startLoader={startLoader} name={nft.name} tokenId={nft.tokenId} itemId={nft.itemId} />} />
                                                                </div>
                                                            </div>
                                                            <div className="cancel-listing">
                                                                <button onClick={() => { cancelItem(nft.itemId) }}>Cancel Listing</button>
                                                            </div>
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

