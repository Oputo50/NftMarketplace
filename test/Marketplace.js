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

        await tokenInstance.approve(marketAddress, 1, { from: minter });

        const result = await marketInstance.createMarketItem(tokenAddress, 1, 200, { from: minter, value: 1000000000000000000, gas: 2000000 });

        assert.equal(result.receipt.status, true);

    })

    it("should fetch all market items", async () => {
        const tokenInstance = await Token.deployed();
        const marketInstance = await Marketplace.deployed();

        const marketItems = await marketInstance.fetchMarketItems.call({from:minter});

        assert.equal(marketItems.length > 0, true);
    })


})