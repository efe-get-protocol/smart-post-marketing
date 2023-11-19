// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {HubRestricted} from 'lens/HubRestricted.sol';
import {Types} from 'lens/Types.sol';
import {IPublicationActionModule} from './interfaces/IPublicationActionModule.sol';
import {IDiscount10PercentNFT} from './DiscountNFT.sol';
import {IERC6551Registry} from './ERC6551Registry.sol';
import {IBrandABCLoyalty} from './BrandABCLoyalty.sol';

interface ILensHub {
    function getProfile(uint256 profileId) external view returns (Types.Profile memory);
}

interface IMirrorModule {
function accountAddress(address user) external
        returns (address);
        }
contract MirrorModule is HubRestricted, IPublicationActionModule {
    address public brandLoyaltyAddress = 0x80612bffe3Af883087b3144CB59608609010AbBd;
    address public registryAddress = 0x000000006551c19487814612e58FE06813775758;
    address public implementationAddress = 0x55266d75D1a14E4572138116aF39863Ed6596E7F;
    bytes32 public salt = 0x0000000000000000000000000000000000000000000000000000000000000000;
        mapping(address => address) public accounts;    
        mapping(uint256 => address) public users;
function accountAddress(address user) external
        returns (address) {
            return accounts[user];
        }
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
        
        uint256 tokenId = IBrandABCLoyalty(brandLoyaltyAddress).getTokenId();
        
        IBrandABCLoyalty(brandLoyaltyAddress).awardItem(params.actorProfileOwner, "");

        address newAccount = IERC6551Registry(registryAddress).createAccount(implementationAddress, salt, 137, brandLoyaltyAddress, tokenId);
        accounts[params.actorProfileOwner] = newAccount;
        return abi.encode(newAccount);
    }
}