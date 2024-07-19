pragma solidity ^0.8.0;

import "./interfaces/IEightPepenFCRenderer.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract EightPepenFCNFT is ERC721 {
    uint16 public maxSupply = 16000;
    uint public totalSupply; 
    uint public mintPrice = 0.00003 ether;
    IEightPepenFCRenderer public renderer;
    uint64 public setSupply;
    uint public imageSupply;
    uint public collabReqCount;
    struct Set{
        string name;
        string description;
        IEightPepenFCRenderer renderer;
        bool hasRenderer;
    }
    struct EightPepenFCData{
        uint256[2] pixelColors;
        uint24 bgColor;
        uint64 setId;
        bool revealed;
        uint16 count;
    } 
    struct TokenData{
        uint256 imageId;
        uint256 secondId;
    }
    mapping(uint256 => Set) public sets;
    mapping(uint256 => uint32) public votes;
    mapping(uint256 => EightPepenFCData) public images;
    mapping(uint256 => TokenData) public tokens;
    mapping(uint256 => TokenData) public collabReq;

    event AddImage(uint256 indexed _id, uint256 indexed _setId, uint16 count,address artist);
    event AddSet (uint256 indexed _id, address artist);
    event Opt_In(uint256 indexed _tokenId, uint256 indexed _imageId);
    event Published(uint256 indexed _id, uint256 indexed _setId, uint16 count,address artist);
    event CollabReq(uint256 indexed _id, uint256 indexed firstToken, uint256 indexed secondToken);
    event CollabAccept(uint256 indexed _id, uint256 indexed firstToken, uint256 indexed secondToken);
    constructor(IEightPepenFCRenderer _renderer)ERC721("Eight Pepen Full Color", "8PEPEN"){
        renderer = _renderer;
        EightPepenFCData memory firstImage;
        firstImage.pixelColors[0]= 0xffffffffffffffffffffffffffff000000ffffffffffffffffffffffffffffff;
        firstImage.pixelColors[1]= 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000;
        firstImage.bgColor= 0x000000;
        firstImage.count= maxSupply+1;
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
        emit AddImage(imageSupply,_setId,_image.count,msg.sender);
    }
    function addSet(EightPepenFCData memory _nftData,Set memory _setData) internal {
        setSupply++;
        sets[setSupply] = _setData;
        addImage(_nftData, setSupply);
        emit AddSet(setSupply,msg.sender);
    }
    function addSet(EightPepenFCData[] memory _nftDatas,Set memory _setData) public {
        setSupply++;
        sets[setSupply] = _setData;
        for(uint i=0;i<_nftDatas.length;i++){
            addImage(_nftDatas[i], setSupply);
        }
        emit AddSet(setSupply,msg.sender);
    }
    function mint() public payable {
        // Require token ID to be between 1 and maxSupply (111)
        require(totalSupply < maxSupply, "Sold out");
        // Make sure the amount of ETH is equal or larger than the minimum mint price
        require(msg.value >= mintPrice, "Not enough ETH sent");
        ++totalSupply;
        uint256 tokenId = totalSupply;
        tokens[tokenId].imageId = 1;
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
        emit Opt_In(_tokenId,_imageId);
    }
    function collab_req(uint256 _ownedToken,uint256 _secondToken)public {
        require(_ownedToken>0 && _ownedToken<=totalSupply,"token not found");
        require(_secondToken>0 && _secondToken<=totalSupply,"token not found");
        require(images[tokens[_ownedToken].imageId].revealed,"token not revealed");
        require(images[tokens[_secondToken].imageId].revealed,"token not revealed");
        require(ownerOf(_ownedToken)== msg.sender,"you are not the owner of token");
        collabReqCount++;
        collabReq[collabReqCount].imageId = _ownedToken;
        collabReq[collabReqCount].secondId = _secondToken;
        emit CollabReq(collabReqCount,_ownedToken,_secondToken);
    }
    function accept_req(uint256 _collabReqId)public{
        //check collab_req exist 
        // check ownership 
        require(_collabReqId>0 && _collabReqId<=collabReqCount, "collab not found");
        TokenData memory collab = collabReq[_collabReqId];
        require(ownerOf(collab.secondId)== msg.sender,"you are not the owner of token");
        tokens[collab.imageId].secondId = tokens[collab.secondId].imageId;
        tokens[collab.secondId].secondId = tokens[collab.imageId].imageId;
        emit CollabAccept(_collabReqId,collab.imageId,collab.secondId);

    }
    function unsafe_opt_in(uint256 _imageId,uint256 _tokenId) internal {
        tokens[_tokenId].imageId = _imageId;
        votes[_imageId] ++;
        if(votes[_imageId]==images[_imageId].count){
            images[_imageId].revealed = true;
            emit Published(_imageId,images[_imageId].setId,images[_imageId].count,msg.sender);
        }
    }
    function tokenURI(uint tokenId)public view override returns (string memory){
        require(tokenId>0 && tokenId<=totalSupply,"Invalid tokenId");
        uint256 imageId = images[tokens[tokenId].imageId].revealed?tokens[tokenId].imageId:1;
        return tokens[tokenId].secondId ==0? imageURI(imageId,tokenId) : imageURI(imageId,tokens[tokenId].secondId,tokenId);
    }
    function imageURI(uint _imageId1,uint _imageId2, uint _tokenId)public view returns(string memory){
        require(_imageId1>0 && _imageId1<=imageSupply,"Invalid imageId");
        require(_imageId2>0 && _imageId2<=imageSupply,"Invalid imageId");
        IEightPepenFCRenderer customRenderer = (_imageId1!=0 && sets[images[_imageId1].setId].hasRenderer)?sets[images[_imageId1].setId].renderer:renderer;
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "Eight Pepen #',
                                Strings.toString(_tokenId),
                                '", "description": "Eight Pepen is a collection of 888 fully on-chain, randomly generated'
                                '", "image":"data:image/svg+xml;base64,',
                                Base64.encode(bytes(customRenderer.getSVG(images[_imageId1].pixelColors,images[_imageId1].bgColor,images[_imageId2].pixelColors,images[_imageId2].bgColor))),
                                // '", "attributes": ""',
                                // '}'
                                '", "attributes": [',
                                getAttributes(_imageId1),
                                ']}'
                            )
                        )
                    )
                )
            );
    }
    function imageURI(uint _imageId,uint _tokenId)public view returns (string memory){
        require(_imageId>0 && _imageId<=imageSupply,"Invalid imageId");
        IEightPepenFCRenderer customRenderer = (_imageId!=0 && sets[images[_imageId].setId].hasRenderer)?sets[images[_imageId].setId].renderer:renderer;
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "Eight Pepen #',
                                Strings.toString(_tokenId),
                                '", "description": "Eight Pepen is a collection of 888 fully on-chain, randomly generated'
                                '", "image":"data:image/svg+xml;base64,',
                                Base64.encode(bytes(customRenderer.getSVG(images[_imageId].pixelColors,images[_imageId].bgColor))),
                                // '", "attributes": ""',
                                // '}'
                                '", "attributes": [',
                                getAttributes(_imageId),
                                ']}'
                            )
                        )
                    )
                )
            );
    }
    function getAttributes(uint _imageId) internal view returns (string memory){
        return string(
                abi.encodePacked(
                    '{"trait_type":"Set", "value": "',
                    sets[images[_imageId].setId].name,
                    '"},{"trait_type":"Revealed", "value": "',
                    images[_imageId].revealed?"True":"False",
                    '"},{"trait_type":"Renderer", "value": "',
                    IEightPepenFCRenderer(sets[images[_imageId].setId].renderer).name(),
                    '"},{"trait_type":"Edition Size", "value": "',
                    Strings.toString(images[_imageId].count),'"}'
                )
        );
    }
}