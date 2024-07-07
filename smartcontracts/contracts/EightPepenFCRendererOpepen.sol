pragma solidity ^0.8.0;

import "./interfaces/IEightPepenFCRenderer.sol";
import "hardhat/console.sol";
contract EightPepenFCRendererOpepen  {
    // using these two variables(pixels) to render our 8pepen svg
    function getSVG(uint256[2] calldata pixelColors1,uint24 bgColor1,uint256[2] calldata pixelColors2,uint24 bgColor2 ) public pure returns (string memory){
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
            '<rect width="100%" height="100%" fill="#',toHexString(bgColor1,6) , '"/>'
            '<rect width="4" height="8" x="4" y="0" fill="#',toHexString(bgColor2,6) , '"/>'
            ));
        uint256[2] memory pixelColors;
        pixelColors[0]= (0x0000000000000000ffffffffffff000000000000ffffffffffff000000000000 & pixelColors1[0]) |
                        (0x0000ffffffffffff000000000000ffffffffffff000000000000ffffffffffff & pixelColors2[0]);
        pixelColors[1]= (0x0000ffffffffffff000000000000ffffffffffff000000000000ffffffffffff & pixelColors1[1]) |
                        (0x0000000000000000ffffffffffff000000000000ffffffffffff000000000000 & pixelColors2[1]);
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
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="geometricPrecision" width="512" height="512">',
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
        string memory pathStart = string(abi.encodePacked('<path d="m ', _uint2str(x), ' ', _uint2str(y), ' '));
        string memory tl = ' m  1  1   l   -1  0   a 1 1 0 0 1    1 -1  z';
        string memory tr = ' m  0  1   l    0 -1   a 1 1 0 0 1    1  1  z';
        string memory bl = ' m  1  0   l    0  1   a 1 1 0 0 1   -1 -1  z';
        string memory br = ' m  0  0   l    1  0   a 1 1 0 0 1   -1  1  z';
        string memory end = string(abi.encodePacked('" fill="#', toHexString(color, 6), '"/>'));
        if ((x == 4 && y == 2) || (x == 2 && y == 7))
          return string(abi.encodePacked(pathStart, tl, end));
        if ((x == 3 && y == 2) || (x == 5 && y == 2) || (x == 5 && y == 7))
          return string(abi.encodePacked(pathStart, tr, end));
        if ((x == 2 && y == 3) || (x == 4 && y == 3) || (x == 2 && y == 5))
          return string(abi.encodePacked(pathStart, bl, end));
        if ((x == 3 && y == 3) || (x == 5 && y == 3) || (x == 5 && y == 5))
          return string(abi.encodePacked(pathStart, br, end));
        return string(abi.encodePacked('<rect width="1" height="1" x="', _uint2str(x), '" y="', _uint2str(y), end));
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