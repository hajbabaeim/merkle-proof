// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import { ERC721 } from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import { Counters } from '@openzeppelin/contracts/utils/Counters.sol';
import { MerkleProof } from '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import { Proof } from './Proof.sol';


contract MerkleNFT is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter public tokenIds;
    Counters.Counter public whitelistIds;

    address public owner;
    address public admin;
    bytes32 public merkleRoot;
    bytes32[] public leaves;
    uint256 maxAddresses;
    mapping(address => uint32) public leavesIndex;

    event AdminChanged(address newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyWhitelisted() {
        uint32 senderIndex = leavesIndex[msg.sender];
        uint256 addedWhitelisted = whitelistIds.current() - senderIndex;
        require(addedWhitelisted > 0, "No whitelist addresses");
        bytes32[] memory proof = new bytes32[](addedWhitelisted-1);
        for (uint256 i = 0; i < proof.length; i++) {
            proof[i] = leaves[senderIndex+i];
            if (i == senderIndex) {
                proof[i] = keccak256(abi.encodePacked(msg.sender));
            }
        }
        bytes32 leaf = Proof.generateRoot(leaves, 0, senderIndex);
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid Proof (sender)");
        _;
    }

    constructor(address _admin, uint256 _maxAddresses) ERC721("Merkle Proof Token", "MKPT") {
        admin = _admin;
        owner = msg.sender;
        maxAddresses = _maxAddresses;
        leaves = new bytes32[](_maxAddresses);
    }

    function addToWhitelist(address newAddress) public onlyAdmin {
        require(whitelistIds.current() < maxAddresses, "No capacity to add new address");
        bytes32 leaf = Proof.generateLeaf(newAddress);
        uint256 currentIndex = whitelistIds.current();
        leavesIndex[newAddress] = uint32(currentIndex);
        leaves[currentIndex] = leaf;
        merkleRoot = Proof.generateRoot(leaves, 0, whitelistIds.current());
        whitelistIds.increment();
    }

    function mint() public onlyWhitelisted() {
        uint256 tokenId = tokenIds.current();
        _mint(msg.sender, tokenId);
        tokenIds.increment();
    }

    function changeAdmin(address newAdmin) public onlyAdmin {
        admin = newAdmin;
        emit AdminChanged(newAdmin);
    }
}
