// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oath {
    mapping(address => bool) public manufacturers;

    address public admin;
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function enrollManufacturer(
        address _manufacturerAddress
    ) public onlyAdmin {
        require(!manufacturers[_manufacturerAddress], "Manufacturer already enrolled");
        manufacturers[_manufacturerAddress] = true;
    }

    function deactivateManufacturer(address _manufacturerAddress) public onlyAdmin {
        require(manufacturers[_manufacturerAddress], "Manufacturer not active");
        manufacturers[_manufacturerAddress] = false;
    }
}