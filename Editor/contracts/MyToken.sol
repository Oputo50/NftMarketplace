// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyToken is Ownable, ERC721, ERC721Enumerable, ERC721URIStorage{

     using SafeMath for uint256;

    constructor() ERC721("MyFile","FIL"){}

    struct Metadata{
        string text;
    }

    mapping (uint256 => Metadata) id_to_text;

    mapping (address => uint) ownerNftCount;

   mapping(string => uint8) hashes;

    uint public tokensCount;

    string private _currentBaseURI;


    function mint(string memory hash, string memory metadata) external {
        require(hashes[hash] != 1);

        uint256 tokenId = tokensCount++;

        hashes[hash] = 1;

        ownerNftCount[msg.sender] = ownerNftCount[msg.sender].add(1);

        id_to_text[tokenId] = Metadata(metadata);

        _safeMint(msg.sender, tokenId);

         _setTokenURI(tokenId,metadata);

    }

    function getNftText(uint _tokenId) public view returns (string memory){
        return id_to_text[_tokenId].text;
    }

    function getOwnedNfts() public view returns(uint[] memory){

        uint userBalance = balanceOf(msg.sender);
        uint[] memory tokenIds = new uint[](userBalance);
        for(uint i = 0; i < userBalance; i++){
          uint currTokenId = tokenOfOwnerByIndex(msg.sender,i);
          tokenIds[i] = currTokenId;
        }

        return tokenIds; 
    }

    function sendNft(address to, uint tokenId) public{
        require(ownerOf(tokenId) == msg.sender);
        ownerNftCount[msg.sender] = ownerNftCount[msg.sender].sub(1);
        ownerNftCount[to] = ownerNftCount[to].add(1);
        _beforeTokenTransfer(msg.sender, to, tokenId);
        transferFrom(msg.sender,to,tokenId);

    }

     function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721,ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721,ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

     function tokenURI(uint256 tokenId) public view virtual override(ERC721,ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

      function _burn(uint256 tokenId) internal virtual override(ERC721,ERC721URIStorage) {
          super._burn(tokenId);
      }

}

