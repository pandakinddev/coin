// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "./Timed.sol";
import "./Airdrop.sol";

contract TimedAirdrop is Airdrop, Timed {
    constructor(
        address _admin,
        address _token,
        uint256 _maxAirdropAmount,
        uint256 _openingTime,
        uint256 _closingTime
    )
        Airdrop(_admin, _token, _maxAirdropAmount)
        Timed(_openingTime, _closingTime)
    {}

    function claimTokens(uint256 amount, bytes calldata signature)
        external
        override
        onlyWhileOpen
    {
        _claimTokens(msg.sender, amount, signature);
    }
}
