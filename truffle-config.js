require('dotenv').config();
const path = require("path");
var WalletProvider = require("@truffle/hdwallet-provider");
const { INFURA_API_URL, MNEMONIC} = process.env;

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
      networkCheckTimeout: 10000, 
      provider: function () {
       return new WalletProvider(MNEMONIC,INFURA_API_URL);
      },
      network_id: "3",
      gas: 4000000 
    },
    goerli: {
      provider: function () {
        return new WalletProvider(MNEMONIC,INFURA_API_URL);
      },
      network_id: '5', // eslint-disable-line camelcase
      gas: 4465030,
      gasPrice: 10000000000,
    }
  },
  compilers:{
    solc: {
      version: "^0.8.9"
    }
  }
};
