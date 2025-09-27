// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MedicineRegistry.sol";
import "./PharmacyRegistry.sol";
import "./PrescriptionRegistry.sol";

contract OathRegistry {
    mapping(address => bool) public manufacturers;
    
    address public admin;
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Enroll a new manufacturer and deploy their medicine registry
     * @param _manufacturerAddress Address of the manufacturer
     */
    function enrollManufacturer(
        address _manufacturerAddress
    ) public onlyAdmin {
        require(!manufacturers[_manufacturerAddress], "Manufacturer already enrolled");
        
        // Deploy new MedicineRegistry for this manufacturer
        MedicineRegistry newRegistry = new MedicineRegistry();
        
        // Set the manufacturer in the new registry
        newRegistry.setManufacturer(_manufacturerAddress);
        
        emit ManufacturerEnrolled(_manufacturerAddress, address(newRegistry));
    }

    /**
     * @dev Deactivate a manufacturer (admin only)
     * @param _manufacturerAddress Address of the manufacturer to deactivate
     */
    function deactivateManufacturer(address _manufacturerAddress) public onlyAdmin {
        require(manufacturers[_manufacturerAddress], "Manufacturer not active");
        manufacturers[_manufacturerAddress] = false;
    }

    /**
     * @dev Transfer admin role to new address
     * @param _newAdmin Address of the new admin
     */
    function transferAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        admin = _newAdmin;
    }
}
