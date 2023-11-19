// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Errors} from './Errors.sol';

abstract contract HubRestricted {
    address public immutable HUB;

    modifier onlyHub(){
        if(msg.sender != HUB){
            revert Errors.NotHub();
        }
        _;
    }

    constructor(address hub) {
        HUB = hub;
    }
}