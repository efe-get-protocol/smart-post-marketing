// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

interface IDiscount10PercentNFT {
 function awardItem(address user, string memory tokenURI)
        external
        returns (uint256);
            function getTokenId() external returns(uint256);

}
contract Discount10PercentNFT is ERC721URIStorage {
    uint256 public tokenIds;
    constructor() ERC721("Brand-ABC 10%", "ABC10P") {}

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