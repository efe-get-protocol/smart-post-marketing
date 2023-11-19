// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
interface IBrandABCLoyalty {

    function awardItem(address user, string memory tokenURI)
        external
        returns (uint256);
    function getTokenId() external returns(uint256);
}
contract BrandABCLoyalty is ERC721URIStorage {
    uint256 public tokenIds;
    constructor() ERC721("BrandABCLoyalty", "ABCLOYAL") {}

    function awardItem(address user, string memory tokenURI)
        external
        returns (uint256)
    {
        uint256 newItemId = tokenIds;
        _mint(user, newItemId);
        _setTokenURI(newItemId, tokenURI);

        tokenIds = tokenIds + 1;
        return newItemId;
    }
    function getTokenId() external returns(uint256) {return tokenIds;}
}