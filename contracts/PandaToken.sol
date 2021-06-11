// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "./GenericToken.sol";

contract PandaToken is GenricToken {
    constructor(address _router, address _airdrop, address _whiteList) 
    GenricToken(
        "Hungry Panda Token",
        "HUNGRYPANDA",
        10000000000 * 10**3 * 10**9,
        7,
        10,
        _router,
        _airdrop,
        _whiteList
    ){}
}