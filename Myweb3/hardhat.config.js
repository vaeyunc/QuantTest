require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
require("@chainlink/env-enc").config();
// require("@nomicfoundation/hardhat-verify");
// require("./tasks/deploy-fundme");
require("./tasks");

const {PRIVATE_KEY, SEPOLIA_URL, ETHERSCAN_API_KEY, PRIVATE_KEY_1, AVAFUJI_URL} = process.env
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // defaultNetwork: "hardhat", # if you want to use a different network change it
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
      timeout: 20000, // timeout for the request 20 seconds,
      chainId:11155111,
      
    },
    avaFuji: {
      url: AVAFUJI_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
      chainId: 43113,
    }
  },
  etherscan: {
    apiKey: {
      sepolia:ETHERSCAN_API_KEY
    }
  }
};
