pragma solidity ^0.8.0;

import {IEightPepenFCRenderer} from "../interfaces/IEightPepenFCRenderer.sol";
import {BaseRenderer} from "./BaseRenderer.sol";
import {Strings} from "../util/Strings.sol";

contract EightPepenFCRendererCircular is BaseRenderer, IEightPepenFCRenderer {
    constructor(string memory _name) BaseRenderer(_name){}
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
            '<rect width="100%" height="100%" fill="#',Strings.toHexString(bgColor1,6) , '"/>'
            '<rect width="4" height="8" x="4" y="0" fill="#',Strings.toHexString(bgColor2,6) , '"/>'
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
                    if(pixelColorPosition<240)
                        color= uint24((pixelColors[0] & (0xffffff<<pixelColorPosition))>>pixelColorPosition);
                    else {
                        pixelColorPosition -= 240;
                        color = uint24((pixelColors[1] & (0xffffff<<pixelColorPosition))>>pixelColorPosition);
                    }
                    image = string( abi.encodePacked(image, _getPixel(x+2,y+2+(y>>2),color))); // calc exact position of x & y in the 8pepen image
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
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges" width="512" height="512">',
            '<rect width="100%" height="100%" fill="#',Strings.toHexString(bgColor,6) , '"/>'
            ));
        for(uint256 x=0; x<4; x++){ 
            for(uint256 y=0;y<5;y++){
                    // get color position of a pixel in the uint256 pixel number = (y*4 + x + 1)*3
                    uint256 pixelColorPosition = (((y)<<2) + (x)) * 24;
                    uint24 color;
                    if(pixelColorPosition<240)
                        color= uint24((pixelColors[0] & (0xffffff<<pixelColorPosition))>>pixelColorPosition);
                    else {
                        pixelColorPosition -= 240;
                        color = uint24((pixelColors[1] & (0xffffff<<pixelColorPosition))>>pixelColorPosition);
                    }
                    image = string( abi.encodePacked(image, _getPixel(x+2,y+2+(y>>2),color))); // calc exact position of x & y in the 8pepen image
            }
        }
        image = string (abi.encodePacked(image, '</svg>'));
        return image;
    }
    function _getPixel(uint256 x, uint256 y , uint24 color) internal pure returns (string memory){
        return string( abi.encodePacked('<circle r="1" cx="',Strings.toString(x+x+1), '" cy="', Strings.toString(y+y+1), '" fill="#',Strings.toHexString(color,6), '"/>'));
    }
}