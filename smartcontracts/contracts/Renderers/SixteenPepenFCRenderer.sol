pragma solidity ^0.8.0;

import "hardhat/console.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
contract SixteenPepenFCRenderer  {
    // using these two variables(pixels) to render our 8pepen svg
    function getSVG(uint256[8] calldata pixelColors, uint24 bgColor) public pure returns (string memory) {
                //        X
        //       - - - ->
        //     |
        //     |
        //  Y  |
        //     \/ 
        //  in the colors variable we have 8 colors each need 24 bit that show color in hex
        //  in the pixels varialbe we have 64 pixels each needs 3 bit ...
        //  that shows the color index in the colors variable 
        string memory image = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges" width="512" height="512">',
            '<rect width="100%" height="100%" fill="#',toHexString(bgColor,6) , '"/>'
            ));
        for(uint256 x=0; x<8; x++){ 
            for(uint256 y=0;y<10;y++){
                    // get color position of a pixel in the uint256 pixel number = (y*8 + x )*3
                    uint256 pixelColorPosition = (((y)<<3) + (x)) * 24;
                    uint24 color;
                    console.log("x: ",x,"y:", y);
                    console.log( "position: ",pixelColorPosition);
                    uint8 decade = uint8(pixelColorPosition/240);
                    pixelColorPosition = pixelColorPosition%240;
                    console.log("decade: ", decade);
                    color = uint24(((pixelColors[decade]) & (0xffffff<<pixelColorPosition))>>pixelColorPosition);
                    console.log( "position: ",pixelColorPosition);
                    image = string( abi.encodePacked(image, _getPixel(x+4,y+4+((y>>3)<<1),color))); // calc exact position of x & y in the 8pepen image
                    // console.log("HELlo");
                    // console.log("x: ",x,"y:", y);
                    // console.log( "position: ",pixelColorPosition);
                    // console.log("color Position:", colorPosition, ",color: #",toHexString(color,6));
            }
        }
        image = string (abi.encodePacked(image, '</svg>'));
        return image;
    }
    function _getPixel(uint256 x, uint256 y , uint24 color) internal pure returns (string memory){
        return string( abi.encodePacked('<rect width="1" height="1" x="', Strings.toString(x), '" y="', Strings.toString(y), '" fill="#',toHexString(color,6), '"/>'));
    }
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(length);
        for (uint256 i = length ; i > 0; i--) {
            buffer[i-1] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }
}