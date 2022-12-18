
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library Proof {
    function generateLeaf(address whitelistedAddress) public pure returns (bytes32) {
        bytes32 leaf = keccak256(abi.encodePacked(whitelistedAddress));
        return leaf;
    }

    function processProof(bytes32[] memory proof, bytes32 leaf) public pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    function generateRoot(bytes32[] calldata leaves, uint256 from, uint256 end) public pure returns (bytes32) {
        bytes32 computedHash = leaves[from];
        for (uint256 i = from; i < end; i++) {
            computedHash = _hashPair(computedHash, leaves[i]);
        }
        return computedHash;
    }

    function hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(b, a));
    }

    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? _efficientHash(a, b) : _efficientHash(b, a);
    }

    function _efficientHash(bytes32 a, bytes32 b) private pure returns (bytes32 value) {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            value := keccak256(0x00, 0x40)
        }
    }
}