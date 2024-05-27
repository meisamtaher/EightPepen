pragma solidity ^0.8.0;

import "./interfaces/IEightPepenRenderer.sol";

contract EightPepenRenderer  {
    // using these two variables(pixels) to render our 8pepen svg
    function getSVG(uint256 pixelColors,uint256 colorPalette) public pure returns (string memory) {
                //        X
        //       - - - ->
        //     |
        //     |
        //  Y  |
        //     \/ 
        //  in the colors variable we have 8 colors each need 24 bit that show color in hex
        //  in the pixels varialbe we have 64 pixels each needs 3 bit ...
        //  that shows the color index in the colors variable 
        uint24 bgColor = uint24(colorPalette & 0xffffff);
        string memory image = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges" width="512" height="512">',
            '<rect width="100%" height="100%" fill="#',toHexString(bgColor,6) , '"/>'
            ));
        for(uint256 x=0; x<8; x++){
            for(uint256 y=0;y<8;y++){
                if( (x>1 && x<6) && (y==7 || (y>1 && y<6) ) ){///if it was the main pixels for 8 pepen
                    // get color position of a pixel in the uint256 pixel number = (y*8 + x)*3
                    uint256 pixelPosition = ((y<<3) + x) * 4;
                    
                    uint256 colorPosition = (uint256(pixelColors & uint256(0x7)<<pixelPosition)>>pixelPosition) * 24;
                    uint24 color = uint24((colorPalette & (0xffffff<<colorPosition))>>colorPosition);
                    image = string( abi.encodePacked(image, _getPixel(x,y,color)));
                    // console.log("HELlo");
                    // console.log("x: ",x,"y:", y);
                    // console.log( "position: ",pixelPosition);
                    // console.log("color Position:", colorPosition, ",color: #",toHexString(color,6));
                }
                // else{ // if it was background pixels
                //     image = string( abi.encodePacked(image, _getPixel(x,y,color)));
                // }
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