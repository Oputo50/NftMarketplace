require('dotenv').config();
const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");
const { INFURA_API_URL, MNEMONIC } = process.env;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host:"127.0.0.1",
      port: 8545,
      network_id:"5777"
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, INFURA_API_URL);
      },
      network_id: 3,
      gas: 4000000 
    }
  },
  compilers:{
    solc: {
      version: "^0.8.9"
    }
  }
};
