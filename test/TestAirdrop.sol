// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "truffle/DeployedAddresses.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "truffle/Assert.sol";
import "../contracts/Token.sol";
import "../contracts/Airdrop.sol";
import "../contracts/WhiteList.sol";

contract AddressMaker {
    function makeAddress(uint256 _salt) internal view returns (address) {
        bytes32 hash =
            keccak256(
                abi.encodePacked(
                    bytes1(0xff),
                    address(this),
                    _salt,
                    abi.encode(block.timestamp)
                )
            );
        return address(uint160(uint256(hash)));
    }
}
// TODO: test that only airdrop can transfer tokens
// TODO: test that airdrop can transfer not more than maxAllowen tokens
// TODO: test airdrop sign verification flow
// TODO: test that only whitelisted addresses can buy while paused


contract TestAirdrop is AddressMaker {
    Token private token;
    Airdrop private airdrop;
    WhiteList private whiteList;

    constructor() {
        airdrop = Airdrop(DeployedAddresses.Airdrop());
        whiteList = WhiteList(DeployedAddresses.WhiteList());
        token = Token(DeployedAddresses.Token());
    }

    function testAirdropSupply() public {
        Assert.equal(
            uint256(token.totalSupply()),
            uint256(1000000 ether),
            "totalSupply must be 1000000 ether"
        );
        Assert.equal(
            uint256(airdrop.maxAirdropAmount()),
            uint256(1000 ether),
            "maxAmount must be 1000 ether"
        );
    }
}
