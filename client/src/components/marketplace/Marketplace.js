import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MarketplaceContract from "../../contracts/Marketplace.json";
import ERC721Contract from "../../contracts/ERC721.json";
import "./Marketplace.scss";
import MarketItem from './MarketItem';
import Loader from '../loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function Marketplace(props) {

  const [marketItems, setMarketItems] = useState([]);

  const [filteredList, setFilteredList] = useState([]);

  const [search, setSearch] = useState("");

  const [triggerReload,setTriggerReload] = useState(false);

  const [triggerLoader, setTriggerLoader] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const marketplace = new ethers.Contract(props.marketAddress, MarketplaceContract.abi, provider);

  const signer = provider.getSigner();


  useEffect(() => {
    setTriggerLoader(true);
    fetchMarketItems();

  }, [triggerReload])

  useEffect(() => {

  }, [triggerLoader]);

  useEffect(() => {
    if(marketItems.length !== 0){
    const filteredList = marketItems.filter((item) => {
      let all_str = `${item.tokenId} ${item.name}`.toLowerCase();
   
      return all_str.indexOf(search) > -1 
    });
    setFilteredList(filteredList);
  }

  }, [search,marketItems])

  const refreshComponent = () => {
    setTriggerReload(!triggerReload);
}

  const fetchMarketItems = async () => {
    const items = await marketplace.connect(signer).fetchMarketItems();
    let tokenContract = new ethers.Contract(props.tokenAddress, ERC721Contract.abi, provider);
    let tokensList = [];

    tokensList = await Promise.all(items.map(async ({ tokenId, nftContract, itemId, price, seller, owner }) => {

      const url = await tokenContract.connect(signer).tokenURI(tokenId);

      price = ethers.utils.formatEther(price);

      price = price.toString();

      const { name, hash, createdBy } = await (await fetch("https://gateway.pinata.cloud/" + url)).json();

      return {
        name,
        hash,
        createdBy,
        tokenId,
        nftContract,
        itemId,
        price,
        seller
      }

    }));

    setMarketItems(tokensList);
    setFilteredList(filteredList);
    setTriggerLoader(false);

  }

  const onKeyUpHandler = (event) => {
    setSearch(event.target.value.toLowerCase());
  }

  return (
    <>
    <Loader isActive={triggerLoader} />
    <div className='marketplace'>
      <div className="title">
        <h1>Marketplace</h1>
      </div>
      <div className="searchDiv">
        <div className="left">
        <input type="text" placeholder="Search By Name" onKeyUp={(e)=>(onKeyUpHandler(e))}></input>
        </div>
        <div className="right">
          <span><FontAwesomeIcon icon={faMagnifyingGlass}/></span>
        </div>
      </div>
        <div className="market-items">
          {
            filteredList &&
            filteredList.map((item) => {
              return <MarketItem triggerReload={refreshComponent}  startLoader={setTriggerLoader} item={item} marketPlace={marketplace} key={item.itemId} tokenAddress={props.tokenAddress} seller={item.seller} ></MarketItem>
            })
          }
      </div>


    </div>
    </>
  )
}

export default Marketplace