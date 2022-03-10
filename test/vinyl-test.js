const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploying a Vinyl Airdrop Contract and test their functionalities ", function () {

  it("Should instantiate the created VINYL and call its functions", async () => {
    const [owner] = await ethers.getSigners();
    // ContractFactory in ethers.js is an abstraction used to deploy new smart contracts, so Token here is a factory for instances of our token contract.
    const VINYL = await ethers.getContractFactory('VINYL');
    const temp_addr = "0xbb663a09ff63f77f462c990f055b04eeaf46e665";
    // deploy bank factory
    const vinyl = await VINYL.deploy();
    await vinyl.deployed();
    console.log("\n")
    console.log(owner.address);
    console.log("\n")
    console.log("~~~~~~~~~~~~ACTIVE TEST~~~~~~~~~~~~~~~~~~~")

    const toggleActiveTx = await vinyl.toggleActive();
    const isActive = await vinyl.isActive();
    console.log("isActive", isActive);
    expect(isActive).to.equal(true);

    console.log("\n")
    console.log("~~~~~~~~~~~~MERKLE ROOT TEST~~~~~~~~~~~~~~~~~~~")

    const newMerkleRoot = "0xc791a47aa98fda004cc4fce05d37ed8f68caa22b639a789fd584d7fce3fcffb9";
    const merkleRootTx = await vinyl.setMerkleRoot(newMerkleRoot);
    const merkleRoot = await vinyl.merkleRoot();
    console.log("merkleRoot", merkleRoot);
    expect(merkleRoot).to.equal("0xc791a47aa98fda004cc4fce05d37ed8f68caa22b639a789fd584d7fce3fcffb9");

    console.log("\n")
    console.log("~~~~~~~~~~~~URI TEST~~~~~~~~~~~~~~~~~~~")

    const newBaseURI = "https://gateway.pinata.cloud/ipfs/QmYVGQyhxkpCU9Yxr6f1iGnGiixRSdDCtfukfGK3LJymRe/";
    const setURITx = await vinyl.setURI(newBaseURI);
    const baseURI_token_1 = await vinyl.uri(1);
    console.log("Token 1 URI: ", baseURI_token_1);
    expect(baseURI_token_1).to.equal("https://gateway.pinata.cloud/ipfs/QmYVGQyhxkpCU9Yxr6f1iGnGiixRSdDCtfukfGK3LJymRe/1.json");

    console.log("\n")
    console.log("~~~~~~~~~~~~Mint TEST~~~~~~~~~~~~~~~~~~~")

    const type = 4;
    const index = 2443;
    const proofs = ["0x0b56f7b46b9a97d1d85e8d4d7faa6359c92513afe2b9ce0b55bf234d87e97ae1",
    '0x9e75b336af81f12124ef5fbc5a5478ebd233f241a9ceb4af8f1adb2ff245acd1',
    '0xec727cd0ef3faad3a58606a8c063008e3bfa68a4464ce4e6b2cfb15d100c2373',
    '0x9017d08bb8e29d37bfe04960093a25c7342c0b191018cd2d166e532064e43058',
    '0xff0af738b55dd9b379fa9a10ad8c4a20710b8a40e14828e0baf1cd9f578a083d',
    '0xabf5b27d3b2ab9e59823a825587af7e02caf2d9610ff17be3c8085b86344d3df'];
    const mintTx = await vinyl.mintNFT(index, type, proofs);
    const balance_Mint = await vinyl.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",0);
    const balance_Gold = await vinyl.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",1);
    console.log("User1 -> Mint VINYL Balance: ", balance_Mint);
    console.log("User1 -> Gold VINYL Balance: ", balance_Gold);
    expect(balance_Mint).to.equal(4);
    expect(balance_Gold).to.equal(2);

    console.log("\n")
    console.log("~~~~~~~~~~~~Double Mint TEST~~~~~~~~~~~~~~~~~~~")

    const check_index = 2443;
    const doubleMintTx = await vinyl.checkDoubleMint(check_index);
    console.log("return value(doubleMint) ", doubleMintTx);
    expect(doubleMintTx).to.equal(false);

    console.log("\n")
    console.log("~~~~~~~~~~~~Transfer TEST~~~~~~~~~~~~~~~~~~~")

    const safeTransferTx = await vinyl.safeTransferFrom(owner.address.toString(), temp_addr.toString(), 0, 1, []);
    const balance_User1_Mint = await vinyl.balanceOf(owner.address.toString(),0);
    const balance_User2_Mint = await vinyl.balanceOf(temp_addr.toString(),0);
    console.log("User1 -> Mint VINYL Balance: ", balance_User1_Mint);
    console.log("User2 -> Mint VINYL Balance: ", balance_User2_Mint);
    expect(balance_User1_Mint).to.equal(3);
    expect(balance_User2_Mint).to.equal(1);

    console.log("\n")
    console.log("~~~~~~~~~~~~Burn TEST~~~~~~~~~~~~~~~~~~~")

    const burnTx = await vinyl.burn(0, 1);
    const balance_User1_Mint_afterBurn = await vinyl.balanceOf(owner.address.toString(),0);
    console.log("User1 -> Mint VINYL Balance: ", balance_User1_Mint_afterBurn);
    expect(balance_User1_Mint_afterBurn).to.equal(2);
  })

});