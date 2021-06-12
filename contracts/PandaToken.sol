// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "./GenericToken.sol";

contract PandaToken is GenericToken {
    constructor(address _router) 
    GenericToken(
        "Hungry Panda Token",
        "HUNGRYPANDA",
        10000000000 * 10**3 * 10**9,
        5,
        10,
        _router
    ){}
}