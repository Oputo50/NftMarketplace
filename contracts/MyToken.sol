// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

/// @title MyToken
/// @notice Simple ERC721 token implementation
/// @dev Pedro Cabral
contract MyToken is
    Ownable,
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Holder
{
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

     /**
      * @notice Struct that will hold the NFT metadata JSON text
     */
    constructor() ERC721("PutoMarketPlace Token", "PTT") {}

    /**
      * @notice To keep track of the available NFT hashes. The hash represents the IPFS CID of the JSON metadata text.
     */
    mapping(string => uint8) hashes;

     /**
      * @notice To keep track of the available NFT hashes. The hash represents the IPFS CID of the JSON metadata text.
      * @param tokenId The token id of the token that is being minted
     */
    event tokenMint (uint256 tokenId);

     /**
      * @notice Event that will be emitted everytime a token is sent to a different address
      * @param tokenId The token id of the token that is being minted
      * @param sentFrom The address that will send the token
      * @param sentTo The address that will receive the token
     */
    event TokenSent (uint256 tokenId, address sentFrom, address sentTo);

    /**
      * @notice Method that will mint a token to the msg.sender address
      * @param hash The IPFS CID of image used as NFT whis is not stored in the contract
      * @param metadata The IPFS CID of the NFT metadata JSON text
      * @return tokenId The Id of the minted token
     */
    function mint(string memory hash, string memory metadata)
        external
        returns (uint256 tokenId)
    {
        require(hashes[hash] != 1);

        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        hashes[hash] = 1;

        _safeMint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, metadata);

        emit tokenMint(newTokenId);

        return newTokenId;
    }

    
    /**
      * @notice Method that will retrieve the id list of the tokens owned by the msg.sender
      * @return tokenIds List of owned token ids
     */
    function getOwnedNfts() public view returns (uint256[] memory) {
        uint256 userBalance = balanceOf(msg.sender);
        uint256[] memory tokenIds = new uint256[](userBalance);
        for (uint256 i = 0; i < userBalance; i++) {
            uint256 currTokenId = tokenOfOwnerByIndex(msg.sender, i);
            tokenIds[i] = currTokenId;
        }

        return tokenIds;
    }

    /**
      * @notice Method that will retrieve last minted token Id
      * @return tokenId TokenId
     */
    function getLastTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
      * @notice Method that will send a token from msg.sender to a specific address
      * @param to Address that will receive the token
      * @param tokenId Id of the token to be sent
     */
    function sendNft(address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender);
        transferFrom(msg.sender, to, tokenId);
        emit TokenSent(tokenId, msg.sender, to);
    }

     /**
      * @notice Overrided method
      * @param interfaceId interface id
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

     /**
      * @notice Overrided method that runs before every token transfer
      * @param from Address that will send the token
      * @param to Address that will receive the token
      * @param tokenId Id of the token to be sent
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

     /**
      * @notice Overrided method to fetch token URI
      * @param tokenId Id of the token to fetch URI
      * @return URI Token URI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

     /**
      * @notice Overrided method to burn tokens
      * @param tokenId Id of token to be burned
     */
    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }
}
