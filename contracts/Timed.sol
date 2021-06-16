// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

contract Timed {
    uint256 public immutable OPENING_TIME;
    uint256 public immutable CLOSING_TIME;
    enum Status {REG, CLAIM, END}

    constructor(uint256 _openingTime, uint256 _closingTime) {
        require(block.timestamp <= _openingTime);
        require(_openingTime < _closingTime);
        OPENING_TIME = _openingTime;
        CLOSING_TIME = _closingTime;
    }

    modifier onlyWhileOpen() {
        require(
            block.timestamp >= OPENING_TIME && block.timestamp <= CLOSING_TIME
        );
        _;
    }

    function hasOpened() public view virtual returns (bool) {
        return block.timestamp >= OPENING_TIME;
    }

    function hasClosed() public view virtual returns (bool) {
        return block.timestamp > CLOSING_TIME;
    }
}
