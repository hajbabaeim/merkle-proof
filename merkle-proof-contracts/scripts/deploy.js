const { Contract, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

async function main() {
  const PriceConsumer = await ethers.getContractFactory("PriceConsumerV3");
  const priceConsumer = await PriceConsumer.deploy(nativeToUsd[network], euroToUsd[network]);
  await priceConsumer.deployed();
  console.log("🚀 PriceConsumer Address", priceConsumer.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
