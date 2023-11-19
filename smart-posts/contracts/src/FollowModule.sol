// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {IFollowModule} from './interfaces/IFollowModule.sol';
import {HubRestricted} from './HubRestricted.sol';
import {IPushCommsV2} from './interfaces/IPushComms.sol';
import {IERC6551Registry} from './ERC6551Registry.sol';
import {IBrandABCLoyalty} from './BrandABCLoyalty.sol';

contract FollowModule is HubRestricted, IFollowModule {
    address public brandLoyaltyAddress = 0xc90c9791431FA4A5D396F5eEeD23cD8828A3e89e;
    address public registryAddress = 0x000000006551c19487814612e58FE06813775758;
    address public implementationAddress = 0x55266d75D1a14E4572138116aF39863Ed6596E7F;
    bytes32 public salt = 0x0000000000000000000000000000000000000000000000000000000000000000;
    mapping(address => address) public accounts;    
    constructor(address hub) HubRestricted(hub) {}
    event HelloWorld(uint256 num);
    function accountAddress(address user) external
        returns (address) {
            return accounts[user];
        }
    function initializeFollowModule(
		 uint256 profileId,
        address transactionExecutor,
        bytes calldata data
    )
        external
        override
        onlyHub

        returns (bytes memory)
    {
        emit HelloWorld(1);
        return data;
    }

    function processFollow(
		uint256 followerProfileId,
        uint256 followTokenId,
        address transactionExecutor,
        uint256 targetProfileId,
        bytes calldata data    ) external override onlyHub returns (bytes memory) {
                    emit HelloWorld(5);
                    return data;

        // uint256 tokenId = IBrandABCLoyalty(brandLoyaltyAddress).getTokenId();

        // IBrandABCLoyalty(brandLoyaltyAddress).awardItem(follower, "");

        // address newAccount = IERC6551Registry(registryAddress).createAccount(implementationAddress, salt, 137, brandLoyaltyAddress, tokenId);
        // accounts[follower] = newAccount;
    }
     /** 
     * @notice This is a transfer hook that is called upon follow NFT transfer in `beforeTokenTransfer. This can
     * only be called from the LensHub contract.
     *
     * NOTE: Special care needs to be taken here: It is possible that follow NFTs were issued before this module
     * was initialized if the profile's follow module was previously different. This transfer hook should take this
     * into consideration, especially when the module holds state associated with individual follow NFTs.
     *
     * @param profileId The token ID of the profile associated with the follow NFT being transferred.
     * @param from The address sending the follow NFT.
     * @param to The address receiving the follow NFT.
     * @param followNFTTokenId The token ID of the follow NFT being transferred.
     */
    function followModuleTransferHook(
        uint256 profileId,
        address from,
        address to,
        uint256 followNFTTokenId
    ) external{}

    /**
     * @notice This is a helper function that could be used in conjunction with specific collect modules.
     *
     * NOTE: This function IS meant to replace a check on follower NFT ownership.
     *
     * NOTE: It is assumed that not all collect modules are aware of the token ID to pass. In these cases,
     * this should receive a `followNFTTokenId` of 0, which is impossible regardless.
     *
     * One example of a use case for this would be a subscription-based following system:
     *      1. The collect module:
     *          - Decodes a follower NFT token ID from user-passed data.
     *          - Fetches the follow module from the hub.
     *          - Calls `isFollowing` passing the profile ID, follower & follower token ID and checks it returned true.
     *      2. The follow module:
     *          - Validates the subscription status for that given NFT, reverting on an invalid subscription.
     *
     * @param profileId The token ID of the profile to validate the follow for.
     * @param follower The follower address to validate the follow for.
     * @param followNFTTokenId The followNFT token ID to validate the follow for.
     *
     * @return true if the given address is following the given profile ID, false otherwise.
     */
    function isFollowing(
        uint256 profileId,
        address follower,
        uint256 followNFTTokenId
    ) external view returns (bool){}
}

