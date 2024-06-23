pragma solidity ^0.8.0;

import "./interfaces/IEightPepenFCRenderer.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract EightPepenFCNFT is ERC721 {
    uint public maxSupply = 16000;
    uint public totalSupply; // number of tokens minted
    uint public mintPrice = 0.00003 ether;
    IEightPepenFCRenderer public renderer;
    uint64 public setSupply;
    uint public imageSupply;
    struct Set{
        bytes32 name;
        string description;
        IEightPepenFCRenderer renderer;
        bool hasRenderer;
    }
    struct EightPepenFCData{
        uint256[2] pixelColors;
        uint24 bgColor;
        uint64 setId;
        bool revealed;
        uint8 count;
    } 
    struct TokenData{
        uint256 imageId;
    }
    mapping(uint256 => Set) public sets;
    mapping(uint256 => uint32) public votes;
    mapping(uint256 => EightPepenFCData) public images;
    mapping(uint256 => TokenData) public tokens;

    event AddImage(uint256 indexed _id, uint256 indexed _setId, uint8 count,address artist);
    event AddISet (uint256 indexed _id, address artist);
    event Opt_In(uint256 indexed _tokenId, uint256 indexed _imageId);
    event Published(uint256 indexed _id, uint256 indexed _setId, uint8 count,address artist);

    constructor(IEightPepenFCRenderer _renderer)ERC721("Eight Pepen Full Color", "8PEPEN"){
        renderer = _renderer;
        EightPepenFCData memory firstImage;
        firstImage.pixelColors[0]= 0xffffffffffffffffffffffffffff000000ffffffffffffffffffffffffffffff;
        firstImage.pixelColors[1]= 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000;
        firstImage.bgColor=0x000000;
        Set memory  firstSet;
        firstSet.name = "not revealed";
        firstSet.description = "This token can opt-in to each NFT ";
        firstSet.hasRenderer = false;
        firstSet.renderer = _renderer;
        addSet(firstImage,firstSet);
    }
    function submitSet(EightPepenFCData[] calldata nftDatas,Set calldata setData) public{
        require(!setData.hasRenderer || address(setData.renderer)!= address(0),"Bad renderer config");
        // check if renderer is correct !!!!!
        addSet(nftDatas,setData);
    }
    function addImage(EightPepenFCData memory _image,uint64 _setId) internal {
        imageSupply++;
        images[imageSupply].pixelColors = _image.pixelColors;
        images[imageSupply].bgColor = _image.bgColor;
        images[imageSupply].count = _image.count;
        images[imageSupply].setId = _setId;
        images[imageSupply].revealed= false;
        emit AddImage()
    }
    function addSet(EightPepenFCData memory _nftData,Set memory _setData) internal {
        setSupply++;
        sets[setSupply] = _setData;
        addImage(_nftData, setSupply);
    }
    function addSet(EightPepenFCData[] memory _nftDatas,Set memory _setData) public {
        setSupply++;
        sets[setSupply] = _setData;
        for(uint i=0;i<_nftDatas.length;i++){
            addImage(_nftDatas[i], setSupply);
        }
    }
    function mint() public payable {
        // Require token ID to be between 1 and maxSupply (111)
        require(totalSupply < maxSupply, "Sold out");
        // Make sure the amount of ETH is equal or larger than the minimum mint price
        require(msg.value >= mintPrice, "Not enough ETH sent");
        ++totalSupply;
        uint256 tokenId = totalSupply;
        tokens[tokenId].imageId = 0;
        _mint(msg.sender, tokenId);
        
    }
    function opt_in(uint256 _imageId,uint256 _tokenId) public {
        require(_tokenId<=totalSupply && _tokenId>0,"token not found");
        require(ownerOf(_tokenId)== msg.sender,"you are not the owner of token");
        require(_imageId<=imageSupply && _imageId>0,"image not found");
        require(!images[_imageId].revealed,"image sold out");
        require(!images[tokens[_tokenId].imageId].revealed,"you can't opt-in with a revealed token");
        /// if user is changing opt-in we should change votes for latest image
        unsafe_opt_in(_imageId,_tokenId);
    }
    function unsafe_opt_in(uint256 _imageId,uint256 _tokenId) internal {
        tokens[_tokenId].imageId = _imageId;
        votes[_imageId] ++;
        if(votes[_imageId]==images[_imageId].count){
            images[_imageId].revealed = true;
        }
    }
    function tokenURI(uint tokenId)public view override returns (string memory){
        require(tokenId>0 && tokenId<=totalSupply,"Invalid tokenId");
        uint256 imageId = images[tokens[tokenId].imageId].revealed?tokens[tokenId].imageId:0;
        IEightPepenFCRenderer customRenderer = (imageId!=0 && sets[images[imageId].setId].hasRenderer)?sets[images[imageId].setId].renderer:renderer;
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
                                Base64.encode(bytes(customRenderer.getSVG(images[imageId].pixelColors,images[imageId].bgColor))),
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}