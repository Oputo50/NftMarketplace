// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol'; 
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract Marketplace is ReentrancyGuard, ERC721Holder{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsCancelled;

    address payable owner;
    uint256 listingPrice = 0.001 ether;

    constructor(){
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isCancelled;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );

    event ItemPriceChanged (
        address indexed nftContract,
        uint indexed tokenId,
        uint price
    );

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice,"You must send the listing price amount in order to create a sale.");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).safeTransferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, address(0), price);
    }

    function sellMarketItem(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        bool isCancelled = idToMarketItem[itemId].isCancelled;
        address seller = idToMarketItem[itemId].seller;

        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        require(isCancelled == false, "This listing has been cancelled");
        require(msg.sender != seller,"You cannot buy your own NFT");

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).safeTransferFrom(address(this),msg.sender,tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint availableItemCount = itemCount - _itemsSold.current() - _itemsCancelled.current();
        uint currIndex = 0;

        MarketItem[] memory items = new MarketItem[](availableItemCount);

        for(uint i = 0; i < itemCount; i++){
            if(idToMarketItem[i+1].owner == address(0) && idToMarketItem[i+1].isCancelled == false){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem memory currentItem = idToMarketItem[currentId];
                items[currIndex] = currentItem;
                currIndex += 1;
            }
        }
        return items;
    }

    function getListedItemsBySeller() public view returns (MarketItem[] memory){
        uint itemCount = _itemIds.current();
        uint256 sellerItems = 0;
        uint currIndex = 0;

        for(uint i = 0; i < itemCount; i++){
            if(idToMarketItem[i+1].seller == msg.sender && idToMarketItem[i+1].isCancelled == false && idToMarketItem[i+1].owner == address(0)){
                sellerItems += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](sellerItems);

          for(uint i = 0; i < itemCount; i++){
            if(idToMarketItem[i+1].seller == msg.sender && idToMarketItem[i+1].isCancelled == false && idToMarketItem[i+1].owner == address(0)){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem memory currentItem = idToMarketItem[currentId];
                items[currIndex] = currentItem;
                currIndex += 1;
            }
        }

      return items;

    }

    function cancelListing(address nftContract, uint256 marketItemId) public {
        require(idToMarketItem[marketItemId].seller == msg.sender,"You must be the seller in order to cancel the listing");
         IERC721(nftContract).safeTransferFrom(address(this),msg.sender,idToMarketItem[marketItemId].tokenId);
         idToMarketItem[marketItemId].isCancelled = true;
         _itemsCancelled.increment();
    }

    function changeItemPrice(uint256 marketItemId, uint256 price) public {
        require(idToMarketItem[marketItemId].seller == msg.sender,"You must be the seller in order to cancel the listing");
        idToMarketItem[marketItemId].price = price;
        emit ItemPriceChanged(idToMarketItem[marketItemId].nftContract, idToMarketItem[marketItemId].tokenId, price);
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }


}