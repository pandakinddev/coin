// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

contract Timed {
    uint256 public immutable INIT_TIME;
    uint256 public immutable REG_TIME;
    uint256 public immutable CLAIM_TIME;
    enum Status {REG, CLAIM, END }

    constructor(uint256 _REG_TIME, uint256 _CLAIM_TIME){
        INIT_TIME = block.timestamp;
        REG_TIME = _REG_TIME;
        CLAIM_TIME = _CLAIM_TIME;
    }

    modifier onlyWhen(Status s) {
        require(_status() == s, "status condition was not met");
        _;
    }

    function _status() internal view returns(Status) {
        uint256 since = block.timestamp - INIT_TIME;
        if(since <= REG_TIME){
            return Status.REG;
        }
        if(since > REG_TIME && since <= REG_TIME + CLAIM_TIME){
            return Status.CLAIM;
        }
        return Status.END;
    }

    function status() external view virtual returns(Status){
        return _status();
    }
}