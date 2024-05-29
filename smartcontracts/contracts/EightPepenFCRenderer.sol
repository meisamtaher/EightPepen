pragma solidity ^0.8.0;

import "./interfaces/IEightPepenFCRenderer.sol";
import "hardhat/console.sol";
contract EightPepenFCRenderer  {
    // using these two variables(pixels) to render our 8pepen svg
    function getSVG(uint256[2] calldata pixelColors, uint24 bgColor) public pure returns (string memory) {
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
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges" width="512" height="512">',
            '<rect width="100%" height="100%" fill="#',toHexString(bgColor,6) , '"/>'
            ));
        for(uint256 x=0; x<4; x++){ 
            for(uint256 y=0;y<5;y++){
                    // get color position of a pixel in the uint256 pixel number = (y*4 + x + 1)*3
                    uint256 pixelColorPosition = (((y)<<2) + (x)) * 24;
                    uint24 color;
                    console.log("x: ",x,"y:", y);
                    console.log( "position: ",pixelColorPosition);
                    if(pixelColorPosition<240)
                        color= uint24((pixelColors[0] & (0xffffff<<pixelColorPosition))>>pixelColorPosition);
                    else {
                        pixelColorPosition -= 240;
                        color = uint24((pixelColors[1] & (0xffffff<<pixelColorPosition))>>pixelColorPosition);
                    }
                    console.log( "position: ",pixelColorPosition);
                    image = string( abi.encodePacked(image, _getPixel(x+2,y+2+(y>>2),color))); // calc exact position of x & y in the 8pepen image
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
        return string( abi.encodePacked('<rect width="1" height="1" x="', _uint2str(x), '" y="', _uint2str(y), '" fill="#',toHexString(color,6), '"/>'));
    }
    // just for numbers from 0 to 8
    function _uint2str(uint _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        string[9] memory lookup = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8'
            ];
        return lookup[_i];
    }
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";
    function toHexString(uint256 value, uint256 length) public pure returns (string memory) {
        bytes memory buffer = new bytes(length);
        for (uint256 i = length ; i > 0; i--) {
            buffer[i-1] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }
}