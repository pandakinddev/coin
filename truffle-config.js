// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = new HDWalletProvider({
  mnemonic,
  providerOrUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
});
module.exports = {
  networks: {
    test: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    bscTest: {
      provider: () => provider,
      network_id: "97",
      gas: 2000000,
      skipDryRun: true,
    },
    bsc: {
      host: "",
      port: 8777,             // Custom port
      network_id: 1342,       // Custom network
      // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
      // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
      // from: <address>,        // Account to send txs from (default: accounts[0])
      // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",
      // docker: true,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    }
  },
  db: {
    enabled: false
  }
};
