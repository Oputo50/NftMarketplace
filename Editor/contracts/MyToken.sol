// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MyToken is Ownable, ERC721, ERC721Enumerable{

     using SafeMath for uint256;

    constructor() ERC721("MyFile","FIL"){}

    struct Metadata{
        string text;
    }

    mapping (uint256 => Metadata) id_to_text;

    mapping (address => uint) ownerNftCount;

   // mapping (address => uint256[]) nftsOwned;

    uint public tokensCount;

    string private _currentBaseURI;

    function setBaseURI(string memory baseURI) public onlyOwner {
        _currentBaseURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _currentBaseURI;
    }

    function mint(string memory text) external {

        uint256 tokenId = tokensCount++;

        ownerNftCount[msg.sender] = ownerNftCount[msg.sender].add(1);

        id_to_text[tokenId] = Metadata(text);
        
        //increases array length
       // nftsOwned[msg.sender].length.add(1);

       // uint256 arrLength = nftsOwned[msg.sender].length;

        //adds token to array of tokens of curr address
        //nftsOwned[msg.sender][arrLength - 1] = tokenId;

        id_to_text[tokenId] = Metadata(text);
        tokensCount++;
        _safeMint(msg.sender, tokenId);

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

     function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721,ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721,ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}

