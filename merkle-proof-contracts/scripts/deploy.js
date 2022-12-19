const { Contract, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

async function main() {
  const MerkleNFT = await ethers.getContractFactory("MerkleNFT");
  const merkleNFT = await MerkleNFT.deploy(nativeToUsd[network], euroToUsd[network]);
  await merkleNFT.deployed();
  console.log("MerkleNFT Address: ", merkleNFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
