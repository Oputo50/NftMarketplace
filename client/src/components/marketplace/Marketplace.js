import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MarketplaceContract from "../../contracts/Marketplace.json";
import TokenContract from "../../contracts/MyToken.json";
import "./Marketplace.scss";
import MarketItem from './MarketItem';

function Marketplace(props) {

  const [marketItems, setMarketItems] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const marketplace = new ethers.Contract(props.marketAddress, MarketplaceContract.abi, provider);

  const signer = provider.getSigner();

  useEffect(() => {
    let objectArray = [];

    const fetchMarketItems = async () => {
      const items = await marketplace.connect(signer).fetchMarketItems();
      console.log(items);
      let tokenContract = new ethers.Contract(props.tokenAddress, TokenContract.abi, provider);

      items.forEach(async (element) => {
        const url = await tokenContract.connect(signer).tokenURI(element.tokenId);

        const response = await (await fetch("https://gateway.pinata.cloud/" + url)).json();

        let resObject = {
          name: response.name,
          hash: response.hash,
          createdBy: response.createdBy,
          tokenId: element.tokenId,
          nftContract: element.nftContract,
          itemId: element.itemId
        }

        objectArray.push(resObject);
      });

      setMarketItems(objectArray);

    }

    fetchMarketItems();
    {console.log("marketItems: ", { marketItems })};
   

  }, [])

  return (
    <div className='marketplace'>
      <div className="title">
        <h1>Marketplace</h1>
      </div>
      <div className="wrapper">
        {console.log("heeeh")}
        <div className="market-items">
          {
            marketItems &&
            marketItems.map((item) => {
              return <h2>oi</h2>
            })
          }
        </div>
      </div>


    </div>

  )
}

export default Marketplace