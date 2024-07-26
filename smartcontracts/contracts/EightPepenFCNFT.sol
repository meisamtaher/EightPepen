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
        address artist;
        uint256[] images;
        bool revealed;
    }
    struct SetData{
        string name;
        string description;
        IEightPepenFCRenderer renderer;
        bool hasRenderer;
        address artist;
    }
    struct ImageData{
        uint256[2] pixelColors;
        uint24 bgColor;
        uint16 count;
    }
    struct Image{
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
    mapping(uint256 => Image) public images;
    mapping(uint256 => TokenData) public tokens;
    mapping(uint256 => TokenData) public collabReq;

    event ImageAdded (uint256 indexed _id, uint256 indexed _setId, uint16 count,address artist);
    event SetSubmitted (uint256 indexed _id, address artist);
    event TokenOptedIn (uint256 indexed _tokenId, uint256 indexed _imageId);
    event SetPublished (uint256 indexed _id, uint256 indexed _setId, uint16 count,address artist);
    event CollabRequested (uint256 indexed _id, uint256 indexed firstToken, uint256 indexed secondToken);
    event CollabAccepted (uint256 indexed _id, uint256 indexed firstToken, uint256 indexed secondToken);
    constructor(IEightPepenFCRenderer _renderer)ERC721("Eight Pepen Full Color", "8 PEPEN"){
        renderer = _renderer;
        ImageData memory firstImage;
        firstImage.pixelColors[0]= 0xffffffffffffffffffffffffffff000000ffffffffffffffffffffffffffffff;
        firstImage.pixelColors[1]= 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000;
        firstImage.bgColor= 0x000000;
        firstImage.count= maxSupply+1;
        SetData memory  firstSet;
        firstSet.name = "-";
        firstSet.description = "-";
        firstSet.hasRenderer = false;
        firstSet.renderer = _renderer;
        addSet(firstImage,firstSet);
    }
    function submitSet(ImageData[] calldata nftDatas,SetData calldata setData) public{
        require(!setData.hasRenderer || address(setData.renderer)!= address(0),"Bad renderer config");
        // check if renderer is has correct Interface!!!!!
        addSet(nftDatas,setData);
    }
    function addImage(ImageData memory _image,uint64 _setId, address _artist) internal {
        imageSupply++;
        images[imageSupply].pixelColors = _image.pixelColors;
        images[imageSupply].bgColor = _image.bgColor;
        images[imageSupply].count = _image.count;
        images[imageSupply].setId = _setId;
        emit ImageAdded (imageSupply, _setId, _image.count, _artist);
    }
    function addSet(ImageData memory _nftData,SetData memory _setData) internal {
        setSupply++;
        sets[setSupply].name = _setData.name;
        sets[setSupply].description = _setData.description;
        sets[setSupply].renderer = _setData.renderer;
        sets[setSupply].hasRenderer = _setData.hasRenderer;
        sets[setSupply].artist = _setData.artist;
        addImage(_nftData, setSupply, _setData.artist);
        sets[setSupply].images.push(imageSupply);
        emit SetSubmitted(setSupply, _setData.artist);
    }
    function addSet(ImageData[] memory _nftDatas,SetData memory _setData) public {
        setSupply++;
        sets[setSupply].name = _setData.name;
        sets[setSupply].description = _setData.description;
        sets[setSupply].renderer = _setData.renderer;
        sets[setSupply].hasRenderer = _setData.hasRenderer;
        sets[setSupply].artist = _setData.artist;
        for(uint i=0;i<_nftDatas.length;i++){
            addImage(_nftDatas[i], setSupply, _setData.artist);
            sets[setSupply].images.push(imageSupply);
        }
        emit SetSubmitted(setSupply,_setData.artist);
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
        emit TokenOptedIn(_tokenId,_imageId);
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
        emit CollabRequested (collabReqCount,_ownedToken,_secondToken);
    }
    function accept_req(uint256 _collabReqId)public{
        //check collab_req exist 
        // check ownership 
        require(_collabReqId>0 && _collabReqId<=collabReqCount, "collab not found");
        TokenData memory collab = collabReq[_collabReqId];
        require(ownerOf(collab.secondId)== msg.sender,"you are not the owner of token");
        tokens[collab.imageId].secondId = tokens[collab.secondId].imageId;
        tokens[collab.secondId].secondId = tokens[collab.imageId].imageId;
        emit CollabAccepted(_collabReqId,collab.imageId,collab.secondId);

    }
    function unsafe_opt_in(uint256 _imageId,uint256 _tokenId) internal {
        tokens[_tokenId].imageId = _imageId;
        votes[_imageId] ++;
        if(votes[_imageId]==images[_imageId].count){
            images[_imageId].revealed = true;
            if(isSetfullyOpt_int(images[_imageId].setId)){
                sets[images[_imageId].setId].revealed = true;
                emit SetPublished (_imageId,images[_imageId].setId,images[_imageId].count,msg.sender);
            }
        }
    }
    //////////////////////////////// URI getters ///////////////////
    function tokenURI(uint tokenId)public view override returns (string memory){
        require(tokenId>0 && tokenId<=totalSupply,"Invalid tokenId");
        uint256 imageId = sets[images[tokens[tokenId].imageId].setId].revealed?tokens[tokenId].imageId:1;
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
    function imageURI(uint _imageId)public view returns (string memory){
        require(_imageId>0 && _imageId<=imageSupply,"Invalid imageId");
        IEightPepenFCRenderer customRenderer = (_imageId!=0 && sets[images[_imageId].setId].hasRenderer)?sets[images[_imageId].setId].renderer:renderer;
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "',
                                sets[images[_imageId].setId].name,
                                '", "description": "',
                                sets[images[_imageId].setId].description,
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
    /////////////////////// Getter Functions //////////////////
    function getVotes(uint256 _setId) public view returns(uint32 setVotes){
        require(_setId>0 && _setId<=setSupply,"Invalid setId");
        for(uint i=0;i<sets[_setId].images.length;i++){
            setVotes += votes[sets[_setId].images[i]];  
        }
        return setVotes;
    }
    function isSetfullyOpt_int(uint256 _setId) private view returns(bool result){
        require(_setId>0 && _setId<=setSupply,"Invalid setId");
        for(uint i=0;i<sets[_setId].images.length;i++){
            if(!images[sets[_setId].images[i]].revealed){
                return false;
            }
        }
        return true;
    }
    function getCounts(uint256 _setId) public view returns(uint16 setCounts){
        require(_setId>0 && _setId<=setSupply,"Invalid setId");
        for(uint i=0;i<sets[_setId].images.length;i++){
            setCounts += images[sets[_setId].images[i]].count;  
        }
        return setCounts;
    }
}