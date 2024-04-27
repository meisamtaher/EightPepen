// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IEightPepenRenderer{
  // svg rendering
function getSVG(uint256 pixelColors,uint256 colorPalette) external pure returns (string memory);
//   function getUnrevealedSVG(uint256 seed) external view returns (string memory);
//   function getDeadSVG(uint256 seed) external view returns (string memory);

//   // metadata
//   function getTraitsMetadata(uint256 seed, bool showBasedPlatform) external view returns (string memory);
}