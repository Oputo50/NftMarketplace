import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MarketplaceContract from "../../contracts/Marketplace.json";
import ERC721Contract from "../../contracts/ERC721.json";
import "./Marketplace.scss";
import MarketItem from './MarketItem';

function Marketplace(props) {

  const [marketItems, setMarketItems] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const marketplace = new ethers.Contract(props.marketAddress, MarketplaceContract.abi, provider);

  const signer = provider.getSigner();

  useEffect(() => {

    fetchMarketItems();

    { console.log("marketItems: ", { marketItems }) };

  }, [])

  const fetchMarketItems = async () => {
    const items = await marketplace.connect(signer).fetchMarketItems();
    let tokenContract = new ethers.Contract(props.tokenAddress, ERC721Contract.abi, provider);
    let tokensList = [];

    tokensList = await Promise.all(items.map(async ({ tokenId, nftContract, itemId, price }) => {

      const url = await tokenContract.connect(signer).tokenURI(tokenId);

      price = price.toString();

      const { name, hash, createdBy } = await (await fetch("https://gateway.pinata.cloud/" + url)).json();

      return {
        name,
        hash,
        createdBy,
        tokenId,
        nftContract,
        itemId,
        price
      }

    }));


    setMarketItems(tokensList);
  }

  return (
    <div className='marketplace'>
      <div className="title">
        <h1>Marketplace</h1>
      </div>
      <div className="searchDiv">
        <div className="left">
          <span>Search</span>
        </div>
        <div className="right">
          <input></input>
        </div>
      </div>
      <div className="wrapper">
        <div className="market-items">
          {
            marketItems &&
            marketItems.map((item) => {
              return <MarketItem price={item.price} name={item.name} hash={item.hash} createdBy={item.createdBy} tokenId={item.tokenId}></MarketItem>
            })
          }
        </div>
      </div>


    </div>

  )
}

export default Marketplace