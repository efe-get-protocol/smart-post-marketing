// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {IFollowModule} from './interfaces/IFollowModule.sol';
import {HubRestricted} from './HubRestricted.sol';
import {IPushCommsV2} from './interfaces/IPushComms.sol';

contract FollowModule is HubRestricted, IFollowModule {

    mapping(address => uint256) public subscriptionDate;

    constructor(address hub) HubRestricted(hub) {}
    
    address public pushProtocolAddress = 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa;
    address public channelAddress = 0x30D38078D6117285d6730F971d3F50A9004a575B;

    function initializeFollowModule(
				uint256 profileId,
        bytes calldata data
    )
        external
        override
        onlyHub
        returns (bytes memory)
    {}

    function processFollow(
		address follower,
        uint256 profileId,
        bytes calldata data
    ) external view override onlyHub() {
        IPushCommsV2(pushProtocolAddress).subscribe(channelAddress);
        subscriptionDate[msg.sender] = block.timestamp;
    }
}

