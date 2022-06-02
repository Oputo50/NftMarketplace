// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

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

    constructor() ERC721("PutoMarketPlace Token", "PTT") {}

    struct Metadata {
        string text;
    }

    mapping(uint256 => Metadata) id_to_text;

    mapping(address => uint256) ownerNftCount;

    mapping(string => uint8) hashes;

    string private _currentBaseURI;

    event tokenMint (uint256 tokenId);

    event TokenSent (uint256 tokenId, address sentFrom, address sentTo);

    function mint(string memory hash, string memory metadata)
        external
        returns (uint256 tokenId)
    {
        require(hashes[hash] != 1);

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        hashes[hash] = 1;

        ownerNftCount[msg.sender] = ownerNftCount[msg.sender].add(1);

        id_to_text[newItemId] = Metadata(metadata);

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, metadata);

        emit tokenMint(newItemId);

        return newItemId;
    }

    function getNftText(uint256 _tokenId) public view returns (string memory) {
        return id_to_text[_tokenId].text;
    }

    function getOwnedNfts() public view returns (uint256[] memory) {
        uint256 userBalance = balanceOf(msg.sender);
        uint256[] memory tokenIds = new uint256[](userBalance);
        for (uint256 i = 0; i < userBalance; i++) {
            uint256 currTokenId = tokenOfOwnerByIndex(msg.sender, i);
            tokenIds[i] = currTokenId;
        }

        return tokenIds;
    }

    function getLastTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    function sendNft(address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender);
        ownerNftCount[msg.sender] = ownerNftCount[msg.sender].sub(1);
        ownerNftCount[to] = ownerNftCount[to].add(1);
        _beforeTokenTransfer(msg.sender, to, tokenId);
        transferFrom(msg.sender, to, tokenId);
        emit TokenSent(tokenId, msg.sender, to);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }
}
