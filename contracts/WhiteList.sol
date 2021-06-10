// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract WhiteList {
    address private admin;

    IERC20 private token;
    constructor(address _admin){
        admin = _admin;
    }

    modifier onlyAdmin {
        require(msg.sender == admin,"only admin");
        _;
    }

    function initialize(address _token) external onlyAdmin {
        token = IERC20(_token);
    }
}