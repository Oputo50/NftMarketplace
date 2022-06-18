
# NFT Marketplace

This is a Dapp (Decentralized Application) that let users mint, buy and sell Non Fungible Tokens (NFTs)
in the blockchain.

This project was developed in order to improve my skills and knowledge on Web3.0 development.

The technologies i have used are:

- Solidity - To develop the blockchain smart contracts.

- Truffle - To test, compile and deploy the smart contracts.

- Ganache - To run a test blockchain on localhost.

- Ethers - To connect the front-end to the blockchain smart contracts.

- React, HTML, CSS, Javascript - To develop UI and UX.

- Vercel - To deploy and host front-end code.

- Pinata and IPFS - To store NFTs' data in InterPlanetary File System.

- Visual Studio Code - To write code.

- GIT - To manage version controls.



## Contracts

[MyToken.sol](https://github.com/Oputo50/NftMarketplace/blob/main/contracts/MyToken.sol): Contract of the ERC721 (NFT) that can be minted, transfered and burned.

[Marketplace.sol](https://github.com/Oputo50/NftMarketplace/blob/main/contracts/Marketplace.sol): NFT Marketplace contract that can hold the NFTs and transfer them when a certain
wallet pays the pre-defined price of the token. The contract lets you edit the price of your token and also cancel its listing.



## Features that can be added:
- Collection creation - All the tokens minted on the Dapp will be PTT tokens but it is possible to develop a new contract (ex: CollectionCreator.sol) that let wallets deploy new instances of MyToken.sol and store them associated to the wallet that created them (we can consider it as the "Collection artist").
- Artist Royalities - It is possible to add logic in a way that every time a NFT is traded on the marketplace, the artist of that NFT would receive a pre-defined percentage of the transfered amount. For example: If you had first feature implemented, on the Marketplace contract, you could send 5% of the NFT price to its artist and send to the seller (price - 5%) ether.
- Market History - These contracts already have events emition implemented on almost every core function so just by fetching the event's logs from the blockchain you could build a Token Detail screen to display information about their past transactions on the marketplace.

