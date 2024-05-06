pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "../EightPepenRenderer.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Random8PepenNFT is EightPepenRenderer{
    uint256 public MAX_TOKEN_SUPPLY = 1000;
    uint public totalSupply = 0; // number of tokens minted
    uint public mintPrice = 0.003 ether;
    
    function getImage(uint256 pixelColors, uint256 colorPalette) public view returns (string memory){
        return this.getSVG(pixelColors,colorPalette);
    }
}