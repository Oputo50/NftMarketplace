// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol'; 
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/// @title Marketplace
/// @notice Simple ERC721 tokens Marketplace contract that let listing a token, cancel, change its price and buy it.
/// @dev Pedro
contract Marketplace is ReentrancyGuard, ERC721Holder{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsCancelled;

    /**
      * @notice Contract owner
     */
    address payable owner;

    /**
      * @notice Price to list a NFT
     */
    uint256 listingPrice = 0.001 ether;

    /**
      * @notice The Marketplace constructor
     */
    constructor(){
        owner = payable(msg.sender);
    }

     /**
      * @notice Struct that will hold the information about a market item
     */
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isCancelled;
    }

     /**
      * @notice To keep track of all market items
     */
    mapping(uint256 => MarketItem) private idToMarketItem;

    /**
      * @notice Event to emit every time a market item is created
     */
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );

      /**
      * @notice Event to emit every time a market item's price is replaced
     */
    event ItemPriceChanged (
        address indexed nftContract,
        uint indexed tokenId,
        uint price
    );

      /**
      * @notice Event to emit every time a market item is cancelled
     */
    event ItemCancelled (
        address indexed nftContract,
        uint indexed tokenId,
        uint itemId
    );

     /**
      * @notice Event to emit every time a market item is cancelled
     */
    event ItemBuy (
        address indexed nftContract,
        uint indexed tokenId,
        uint itemId
    );

      /**
      * @notice A method to list a nft on the marketplace
      * @param nftContract The nft contract address
      * @param tokenId The nft token id
      * @param price The price wich the item will be listed
     */
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

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, address(0), price);
    }

     /**
      * @notice Event to emit every time a market item is created
      * @param nftContract The nft contract address
      * @param itemId The market item Id of the item that will be sold
     */ 
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
        IERC721(nftContract).transferFrom(address(this),msg.sender,tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
        emit ItemBuy(nftContract, tokenId, itemId);
    }

    /**
    * @notice Method to retrieve all available market items
    */ 
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

    /**
      * @notice Method that retrieves all items listed by the address who calls this function
     */ 
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

    /**
      * @notice Method to cancel a market item listing
      * @param nftContract The nft contract address
      * @param marketItemId The market item Id of the item that will be sold
     */ 
    function cancelListing(address nftContract, uint256 marketItemId) public {
        require(idToMarketItem[marketItemId].seller == msg.sender,"You must be the seller in order to cancel the listing.");
        require(idToMarketItem[marketItemId].isCancelled == false, "This item has already been cancelled.");
         IERC721(nftContract).transferFrom(address(this),msg.sender,idToMarketItem[marketItemId].tokenId);
         idToMarketItem[marketItemId].isCancelled = true;
         _itemsCancelled.increment();
         emit ItemCancelled(nftContract,idToMarketItem[marketItemId].tokenId, marketItemId);
    }

    /**
      * @notice Method to cancel a market item listing
      * @param marketItemId The market item Id of the item that will be sold
      * @param price The new item price that will replace the current price
     */
    function changeItemPrice(uint256 marketItemId, uint256 price) public {
        require(idToMarketItem[marketItemId].seller == msg.sender,"You must be the seller in order to cancel the listing");
        idToMarketItem[marketItemId].price = price;
        emit ItemPriceChanged(idToMarketItem[marketItemId].nftContract, idToMarketItem[marketItemId].tokenId, price);
    }

     /**
      * @notice Method that retrieves the price of listing a nft 
     */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }


}