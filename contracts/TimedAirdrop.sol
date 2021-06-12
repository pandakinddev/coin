// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "./Timed.sol";
import "./Airdrop.sol";

contract TimedAirdrop is Airdrop, Timed  {
    constructor(address _admin,address _token,uint256 _maxAirdropAmount)
        Airdrop(_admin,_token,_maxAirdropAmount)  Timed(3 days, 2 days){}
}
