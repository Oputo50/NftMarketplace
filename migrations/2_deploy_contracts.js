var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MyToken = artifacts.require("./MyToken.sol");
var Marketplace = artifacts.require("./Marketplace.sol");
const fs = require("fs");

module.exports = function (deployer) {
  object = {};
  deployer.deploy(SimpleStorage);
  deployer.deploy(MyToken).then((res) => {
    object.tokenAddress = res.address;
    console.log(object);
  })
  deployer.deploy(Marketplace).then((res) => {
    object.marketAddress = res.address;


    fs.writeFile("./client/src/utils/ContractAddresses.json", JSON.stringify(object), function (err) {
      if (err) throw err;
      console.log('complete');
    }
    );
  });


};
