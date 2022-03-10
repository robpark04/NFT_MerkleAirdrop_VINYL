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
const TEST_WALLET_PRIVATE_KEY = "YOUR_TEST_WLLET_PRIVATE_KEY";
const ALCHMY_KEY = "ALCHMY_KEY";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {

    rinkeby: {
      url: `${ALCHMY_KEY}`,
      accounts: [`${TEST_WALLET_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      mainnet: "YOUR_API_KEY",
      rinkeby: "YOUR_API_KEY",
    }
  }
};
