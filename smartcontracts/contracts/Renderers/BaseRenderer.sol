pragma solidity ^0.8.0;

contract BaseRenderer {
    string private _name ;
    constructor(string memory name){
        _name= name;
    }
    function name() public view returns (string memory) {
        return _name;
    }
}