pragma solidity ^0.8.0;

import "./interfaces/IEightPepenFCRenderer.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract EightPepenFCNFT is ERC721 {
    IERC721 public baseNFT;
    uint public maxSupply = 1600;
    uint public totalSupply = 0; // number of tokens minted
    uint public mintPrice = 0.00003 ether;
    IEightPepenFCRenderer public renderer;
    struct EightPepenFCData{
        uint256[2] pixelColors;
        uint24 bgColor;
    }
    mapping(uint256 => EightPepenFCData) imageData;
    constructor(IEightPepenFCRenderer _renderer, IERC721 _baseNFT)ERC721("Eight Pepen Full Color", "8PEPEN"){
        renderer = _renderer;
        baseNFT = _baseNFT;
    }
    function mint(uint256[2] calldata _pixelColors, uint24 _bgColor) public payable {
        // Require token ID to be between 1 and maxSupply (111)
        require(totalSupply < maxSupply, "Sold out");
        require(baseNFT.balanceOf(msg.sender)>0,"don't have base NFT");
        // Make sure the amount of ETH is equal or larger than the minimum mint price
        require(msg.value >= mintPrice, "Not enough ETH sent");
        uint256 tokenId = totalSupply+1;
        imageData[tokenId].pixelColors= _pixelColors;
        imageData[tokenId].bgColor= _bgColor;
        // Mint token
        _mint(msg.sender, tokenId);

        // Increase minted tokens counter
        ++totalSupply;
    }
    function tokenURI(uint tokenId)public view override returns (string memory){
        require(tokenId>0 && tokenId<=totalSupply,"Invalid tokenId");
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "Eight Pepen #',
                                Strings.toString(tokenId),
                                '", "description": "Eight Pepen is a collection of 888 fully on-chain, randomly generated, ", "attributes": "", "image":"data:image/svg+xml;base64,',
                                Base64.encode(bytes(renderer.getSVG(imageData[tokenId].pixelColors,imageData[tokenId].bgColor))),
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}