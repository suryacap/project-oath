// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MedicineRegistry.sol";
import "./PharmacyRegistry.sol";
import "./PrescriptionRegistry.sol";
import "./MedicineENSRegistrar.sol";

contract OathRegistry {
    mapping(address => bool) public manufacturers;
    mapping(address => address) public medicineRegistries;
    
    address public admin;
    address public ensRegistrar; // ENS subname registrar contract
    string public parentDomain; // Parent domain for ENS subnames (e.g., "oath.eth")
    
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Set the ENS registrar contract
     * @param _ensRegistrar Address of the ENS registrar contract
     */
    function setENSRegistrar(address _ensRegistrar) public onlyAdmin {
        require(_ensRegistrar != address(0), "Invalid ENS registrar address");
        ensRegistrar = _ensRegistrar;
        emit ENSRegistrarSet(_ensRegistrar);
    }
    
    /**
     * @dev Set the parent domain for ENS subnames
     * @param _parentDomain The parent domain (e.g., "oath.eth")
     */
    function setParentDomain(string memory _parentDomain) public onlyAdmin {
        require(bytes(_parentDomain).length > 0, "Parent domain cannot be empty");
        parentDomain = _parentDomain;
    }
    
    /**
     * @dev Enroll a new manufacturer and deploy their medicine registry
     * @param _manufacturerAddress Address of the manufacturer
     * @param _manufacturerName The manufacturer name for ENS
     */
    function enrollManufacturer(
        address _manufacturerAddress,
        string memory _manufacturerName
    ) public onlyAdmin {
        require(!manufacturers[_manufacturerAddress], "Manufacturer already enrolled");
        require(bytes(_manufacturerName).length > 0, "Manufacturer name cannot be empty");
        
        // Deploy new MedicineRegistry for this manufacturer
        MedicineRegistry newRegistry = new MedicineRegistry();
        medicineRegistries[_manufacturerAddress] = address(newRegistry);
        
        // Set the manufacturer in the new registry
        newRegistry.setManufacturer(_manufacturerAddress);
        
        // Set manufacturer name in the registry
        newRegistry.setManufacturerName(_manufacturerName);
        
        // Set ENS registrar and parent domain if available
        if (ensRegistrar != address(0)) {
            newRegistry.setENSRegistrar(ensRegistrar);
            newRegistry.setParentDomain(parentDomain);
        }
        
        manufacturers[_manufacturerAddress] = true;
    }
    
    /**
     * @dev Assign ENS subname to a manufacturer's medicine registry
     * @param _manufacturerAddress The manufacturer address
     * @param _manufacturerName The manufacturer name for ENS
     */
    function assignENSSubnameToManufacturer(
        address _manufacturerAddress,
        string memory _manufacturerName
    ) public payable onlyAdmin {
        require(manufacturers[_manufacturerAddress], "Manufacturer not enrolled");
        require(ensRegistrar != address(0), "ENS registrar not set");
        require(bytes(_manufacturerName).length > 0, "Manufacturer name cannot be empty");
        
        address registryAddress = medicineRegistries[_manufacturerAddress];
        require(registryAddress != address(0), "Medicine registry not found");
        
        MedicineRegistry registry = MedicineRegistry(registryAddress);
        require(!registry.hasRegistryENSSubname(), "Registry already has ENS subname");
        
        // Set manufacturer name in registry
        registry.setManufacturerName(_manufacturerName);
        
        // Register manufacturer subdomain
        MedicineENSRegistrar registrar = MedicineENSRegistrar(ensRegistrar);
        registrar.registerManufacturerSubdomain{value: msg.value}(
            registryAddress, // Registry contract is the owner
            _manufacturerName,
            address(0) // Use default resolver
        );
        
        // Set the ENS subname in the registry contract
        string memory fullName = string(abi.encodePacked(_manufacturerName, ".", parentDomain));
        registry.setRegistryENSSubname(_manufacturerName, fullName);
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
    
    /**
     * @dev Get medicine registry ENS information
     * @param _manufacturerAddress The manufacturer address
     * @return registryAddress The medicine registry address
     * @return ensSubname The ENS subname
     * @return ensFullName The full ENS name
     * @return hasENS Whether the registry has an ENS subname
     */
    function getManufacturerRegistryENSInfo(address _manufacturerAddress) public view returns (
        address registryAddress,
        string memory ensSubname,
        string memory ensFullName,
        bool hasENS
    ) {
        registryAddress = medicineRegistries[_manufacturerAddress];
        require(registryAddress != address(0), "Medicine registry not found");
        
        MedicineRegistry registry = MedicineRegistry(registryAddress);
        
        return (
            registryAddress,
            registry.getRegistryENSSubname(),
            registry.getRegistryENSFullName(),
            registry.hasRegistryENSSubname()
        );
    }
}
