// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IEightPepenFCRenderer{
function name() external view returns (string memory);
  // svg rendering
function getSVG(uint256[2] calldata pixelColors, uint24 bgColor) external pure returns (string memory);
function getSVG(uint256[2] calldata pixelColors1,uint24 bgColor1,uint256[2] calldata pixelColors2,uint24 bgColor2 ) external pure returns(string memory);
}