const { assert } = require('chai');

require('chai');

const Token = artifacts.require("MyToken");
const Marketplace = artifacts.require("Marketplace");

contract("Marketplace", (accounts) => {
    const marketOwner = accounts[0];
    const minter = accounts[1];
    const buyer = accounts[3];
   

    it("should create a market item", async () => {
        const tokenInstance = await Token.deployed();
        const marketInstance = await Marketplace.deployed();
        const tokenAddress = tokenInstance.address;
        const marketAddress = marketInstance.address;

        await tokenInstance.mint("hash", "metadata", { from: minter });

        await tokenInstance.mint("hash2", "metadata2", { from: buyer });

        await tokenInstance.approve(marketAddress, 1, { from: minter });

        await tokenInstance.approve(marketAddress, 2, { from: buyer });

        await marketInstance.createMarketItem(tokenAddress, 1, 200, { from: minter, value: web3.utils.toWei("0.2"), gas: 2000000 });

        await marketInstance.createMarketItem(tokenAddress, 2, 200, { from: buyer, value: web3.utils.toWei("0.2"), gas: 2000000 });

        const marketItems = await marketInstance.fetchMarketItems.call({from:minter});

        assert.equal(marketItems.length > 0, true);

    })

    it("should fetch all market items", async () => {
        const marketInstance = await Marketplace.deployed();

        const marketItems = await marketInstance.fetchMarketItems.call({from:minter});

        assert.equal(marketItems.length > 0, true);
    })

    it("should retrieve all market items by seller", async () => {
        const marketInstance = await Marketplace.deployed();

        const marketItems = await marketInstance.getListedItemsBySeller.call({from:minter});

        assert.equal(marketItems[0].tokenId,1);

    })

    it("should change the price of a listed item", async () => {
        const marketInstance = await Marketplace.deployed();

        await marketInstance.changeItemPrice(1, web3.utils.toWei("1"),{from: minter});

        const marketItems = await marketInstance.getListedItemsBySeller.call({from:minter});

        marketItems.forEach(element => {
            if(element.itemId === 1){
                assert.equal(element.price,  web3.utils.toWei("1") )
            }
        });

        
    })

    it("should cancel a nft listing", async () => {
        const marketInstance = await Marketplace.deployed();
        const tokenInstance = await Token.deployed();

        await marketInstance.cancelListing(tokenInstance.address,1,{from: minter});

        const marketItems = await marketInstance.fetchMarketItems.call({from:minter});

        marketItems.forEach(element => {
            if(element.itemId == 1){
                assert.equal(element.isCancelled, true);
            }
        });
    })


})