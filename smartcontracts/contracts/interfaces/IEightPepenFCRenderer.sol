// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IEightPepenFCRenderer{
  // svg rendering
function getSVG(uint256[2] calldata pixelColors, uint24 bgColor) external pure returns (string memory);
}