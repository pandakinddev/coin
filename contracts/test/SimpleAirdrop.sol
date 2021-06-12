// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "../Airdrop.sol";

contract SimpleAirdrop is Airdrop {
    constructor(address _admin,address _token,uint256 _maxAirdropAmount) 
    Airdrop(_admin,_token, _maxAirdropAmount){}
}
