require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const TEST_WALLET_PRIVATE_KEY = "5b40ece50cfe0ab4d33629ebbdc5081add864d655c9df430575f37d87a20701d";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {

    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/fnsX3XmIOEWWkXsjN2WUlZ1oQYP-qs9g`,
      accounts: [`${TEST_WALLET_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      mainnet: "JASQCEV9GXBSK5TD5JEVZDER389ZJ4M395",
      rinkeby: "JASQCEV9GXBSK5TD5JEVZDER389ZJ4M395",
    }
  }
};
