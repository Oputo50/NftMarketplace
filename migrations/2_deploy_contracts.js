var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MyToken = artifacts.require("./MyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(MyToken);
};
