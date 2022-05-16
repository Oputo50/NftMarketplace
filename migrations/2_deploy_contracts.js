var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MyToken = artifacts.require("./MyToken.sol");
var Marketplace = artifacts.require("./Marketplace.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(MyToken);
  deployer.deploy(Marketplace);
};
