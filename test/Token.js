const { assert } = require('chai');

require('chai');

const Token = artifacts.require("MyToken");

contract("Token", (accounts) => {
    const minter = accounts[0];
    it("should mint a token", async () => {
        const token1 = { hash: "hash1", metadata: "metadata" }

        const contractInstance = await Token.deployed();

        const result = await contractInstance.mint(token1.hash, token1.metadata, { from: minter });

        const lastTokenId = await contractInstance.getLastTokenId.call({ from: minter });

        assert.equal(lastTokenId, parseInt(1).toString());

        assert.equal(result.receipt.status, true);
    })

    it("should fail when minting with repeated hash", async () => {

        try {
            const token1 = { hash: "hash1", metadata: "metadata" }

            const contractInstance = await Token.deployed();

            await contractInstance.mint(token1.hash, token1.metadata, { from: minter });

        } catch (error) {
            assert.include(error.message,"revert");
        }

    })

    it("should return owned nfts", async () => {
         const contractInstance = await Token.deployed();

         const token2 = { hash: "hash2", metadata: "metadata2" }

         const ownedTokenIds = [1,2];

         await contractInstance.mint(token2.hash, token2.metadata, { from: minter });
            
            const nfts = await contractInstance.getOwnedNfts.call({from: minter});

            assert.equal(nfts[0].toString(),parseInt(1).toString());

            for(i = 0; i < nfts.length; i++){
                assert.equal(nfts[i].toString(),ownedTokenIds[i].toString());
            }
    })

    it("should return metadata by id", async () => {
        const contractInstance = await Token.deployed();
        const token1 = {tokenId:1, hash: "hash1", metadata: "metadata" }

        const metadata = await contractInstance.getNftText.call(token1.tokenId,{from:minter});

        assert.equal(metadata,token1.metadata);
    })

})