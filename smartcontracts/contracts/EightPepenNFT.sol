pragma solidity ^0.8.0;

import "./interfaces/IEightPepenRenderer.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract EightPepenNFT is ERC721 {
    uint constant maxSupply = 888; // max number of tokens
    uint public totalSupply = 0; // number of tokens minted
    uint public mintPrice = 0.00003 ether;
    IEightPepenRenderer public renderer;
    struct EightPepenData{
        uint256 pixelColors;
        uint256 colorPalette;
    }
    mapping(uint256 => EightPepenData) imageData;
    constructor(IEightPepenRenderer _renderer)ERC721("Eight Pepen", "8PEPEN"){
        renderer = _renderer;
    }
    function mint() public payable {
        // Require token ID to be between 1 and maxSupply (111)
        require(totalSupply < maxSupply, "Sold out");
        // Make sure the amount of ETH is equal or larger than the minimum mint price
        require(msg.value >= mintPrice, "Not enough ETH sent");
        uint256 tokenId = totalSupply+1;
        imageData[tokenId].pixelColors= uint256(keccak256(abi.encodePacked(block.basefee, block.timestamp)));
        imageData[tokenId].colorPalette= uint256(keccak256(abi.encodePacked(tokenId, block.timestamp)));
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
                                Base64.encode(bytes(renderer.getSVG(imageData[tokenId].pixelColors,imageData[tokenId].colorPalette))),
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}