// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {HubRestricted} from 'lens/HubRestricted.sol';
import {Types} from 'lens/Types.sol';
import {IPublicationActionModule} from './interfaces/IPublicationActionModule.sol';
import {IMirrorModule} from './MirrorModule.sol';
import {IDiscount10PercentNFT} from './DiscountNFT.sol';

contract CommentModule is HubRestricted, IPublicationActionModule {
    address public mirrorModuleAddress = 0xB07A3EB67065006DEeb481d35643B868b655106C;
    address public discountAddress = 0xaE9B980e98d83d0cE07643cCAF698Fb32CBAC920;
     enum PublicationType {
    Nonexistent,
    Post,
    Comment,
    Mirror,
    Quote
}
    constructor() HubRestricted(0xC1E77eE73403B8a7478884915aA599932A677870) {
    }

    function initializePublicationAction(
        uint256 profileId,
        uint256 pubId,
        address /* transactionExecutor */,
        bytes calldata data
    ) external override onlyHub returns (bytes memory) {
        return data;
    }

    function processPublicationAction(
        Types.ProcessActionParams calldata params
    ) external override onlyHub returns (bytes memory) {
        for (uint i = 0; i < params.referrerPubTypes.length; i++) {
            if(uint256(params.referrerPubTypes[i]) == uint256(PublicationType.Mirror)){
                address erc6551Account = IMirrorModule(mirrorModuleAddress).accountAddress(params.actorProfileOwner);
                IDiscount10PercentNFT(discountAddress).awardItem(erc6551Account, "");
                return abi.encode(discountAddress);
            }
        }
        
    }
}