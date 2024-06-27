// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISixteenPepenFCRenderer{
  // svg rendering
function getSVG(uint256[8] calldata pixelColors, uint24 bgColor) external pure returns (string memory);
}