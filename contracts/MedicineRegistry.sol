// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Medicine.sol";
import "./MedicineENSRegistrar.sol";

contract MedicineRegistry {
    mapping(string => address) public medicines; // Mapping from medicine name to Medicine contract address
    mapping(string => address) public batches; // Mapping from batchNo to contract address
    mapping(address => bool) public registeredMedicines; // Track registered medicine contracts
    address public manufacturer;
    address public ensRegistrar; // ENS subname registrar contract
    string public parentDomain; // Parent domain for ENS subnames (e.g., "oath.eth")
    string public manufacturerName; // Manufacturer name for ENS
    string public registryENSSubname; // ENS subname for this registry (e.g., "pfizer.oath.eth")
    string public registryENSFullName; // Full ENS name for this registry

    constructor() {
        manufacturer = msg.sender;
    }

    modifier onlyManufacturer() {
        require(msg.sender == manufacturer, "Caller is not manufacturer");
        _;
    }

    function setManufacturer(address _manufacturer) public onlyManufacturer {
        manufacturer = _manufacturer;
    }
    
    /**
     * @dev Set the ENS registrar contract
     * @param _ensRegistrar Address of the ENS registrar contract
     */
    function setENSRegistrar(address _ensRegistrar) public onlyManufacturer {
        require(_ensRegistrar != address(0), "Invalid ENS registrar address");
        ensRegistrar = _ensRegistrar;
    }
    
    /**
     * @dev Set the parent domain for ENS subnames
     * @param _parentDomain The parent domain (e.g., "oath.eth")
     */
    function setParentDomain(string memory _parentDomain) public onlyManufacturer {
        require(bytes(_parentDomain).length > 0, "Parent domain cannot be empty");
        parentDomain = _parentDomain;
    }
    
    /**
     * @dev Set the manufacturer name for ENS
     * @param _manufacturerName The manufacturer name
     */
    function setManufacturerName(string memory _manufacturerName) public onlyManufacturer {
        require(bytes(_manufacturerName).length > 0, "Manufacturer name cannot be empty");
        manufacturerName = _manufacturerName;
    }
    
    /**
     * @dev Set the ENS subname for this registry (only registry can call)
     * @param _subname The ENS subname
     * @param _fullName The full ENS name
     */
    function setRegistryENSSubname(string memory _subname, string memory _fullName) public onlyManufacturer {
        require(bytes(_subname).length > 0, "Subname cannot be empty");
        require(bytes(_fullName).length > 0, "Full name cannot be empty");
        
        registryENSSubname = _subname;
        registryENSFullName = _fullName;
    }
    
    /**
     * @dev Get the ENS subname for this registry
     * @return The ENS subname
     */
    function getRegistryENSSubname() public view returns (string memory) {
        return registryENSSubname;
    }
    
    /**
     * @dev Get the full ENS name for this registry
     * @return The full ENS name
     */
    function getRegistryENSFullName() public view returns (string memory) {
        return registryENSFullName;
    }
    
    /**
     * @dev Check if this registry has an ENS subname
     * @return True if registry has ENS subname, false otherwise
     */
    function hasRegistryENSSubname() public view returns (bool) {
        return bytes(registryENSSubname).length > 0;
    }

    function createMedicine(
        string memory _medicineName
    ) public onlyManufacturer returns (address) {
        require(medicines[_medicineName] == address(0), "Medicine with this name already exists");
        
        Medicine newMedicine = new Medicine(
            _medicineName, msg.sender);
        
        medicines[_medicineName] = address(newMedicine);
        registeredMedicines[address(newMedicine)] = true;
        
        return address(newMedicine);
    }
    
    /**
     * @dev Create a medicine with ENS subname
     * @param _medicineName The name of the medicine
     * @return The address of the created medicine contract
     */
    function createMedicineWithENS(
        string memory _medicineName
    ) public payable onlyManufacturer returns (address) {
        require(medicines[_medicineName] == address(0), "Medicine with this name already exists");
        require(ensRegistrar != address(0), "ENS registrar not set");
        require(bytes(manufacturerName).length > 0, "Manufacturer name not set");
        require(hasRegistryENSSubname(), "Registry does not have ENS subname");
        
        // Create the medicine contract
        Medicine newMedicine = new Medicine(_medicineName, msg.sender);
        address medicineAddress = address(newMedicine);
        
        // Set manufacturer name in medicine contract
        newMedicine.setManufacturerName(manufacturerName);
        
        // Register the medicine
        medicines[_medicineName] = medicineAddress;
        registeredMedicines[medicineAddress] = true;
        
        // Register medicine subname under this registry's subdomain
        MedicineENSRegistrar registrar = MedicineENSRegistrar(ensRegistrar);
        
        // Register medicine subname under manufacturer subdomain
        registrar.registerMedicineSubname{value: msg.value}(
            medicineAddress,
            _medicineName,
            manufacturerName,
            address(0) // Use default resolver
        );
        
        // Set the ENS subname in the medicine contract
        string memory fullSubname = string(abi.encodePacked(_medicineName, ".", manufacturerName));
        string memory fullName = string(abi.encodePacked(fullSubname, ".", parentDomain));
        newMedicine.setENSSubname(fullSubname, fullName);
        
        return medicineAddress;
    }
    
    /**
     * @dev Assign ENS subname to an existing medicine
     * @param _medicineAddress The address of the existing medicine
     */
    function assignENSSubnameToMedicine(
        address _medicineAddress
    ) public payable onlyManufacturer {
        require(registeredMedicines[_medicineAddress], "Medicine not registered");
        require(ensRegistrar != address(0), "ENS registrar not set");
        require(bytes(manufacturerName).length > 0, "Manufacturer name not set");
        require(hasRegistryENSSubname(), "Registry does not have ENS subname");
        
        Medicine medicine = Medicine(_medicineAddress);
        require(!medicine.hasENSSubname(), "Medicine already has ENS subname");
        
        // Set manufacturer name in medicine contract
        medicine.setManufacturerName(manufacturerName);
        
        // Register medicine subname under manufacturer subdomain
        MedicineENSRegistrar registrar = MedicineENSRegistrar(ensRegistrar);
        
        registrar.registerMedicineSubname{value: msg.value}(
            _medicineAddress,
            medicine.medicineName(),
            manufacturerName,
            address(0) // Use default resolver
        );
        
        // Set the ENS subname in the medicine contract
        string memory fullSubname = string(abi.encodePacked(medicine.medicineName(), ".", manufacturerName));
        string memory fullName = string(abi.encodePacked(fullSubname, ".", parentDomain));
        medicine.setENSSubname(fullSubname, fullName);
        
        emit MedicineENSSubnameCreated(_medicineAddress, fullSubname, fullName);
    }

    function updateMedicineQuantity(string memory _batchNo, uint _quantity) public onlyManufacturer {
        address medicineAddress = medicines[_batchNo];
        require(medicineAddress != address(0), "Medicine does not exist");
        require(registeredMedicines[medicineAddress], "Medicine not registered");
        
        Medicine medicine = Medicine(medicineAddress);
        medicine.updateQuantity(_batchNo, _quantity);
    }

    function verifyMedicine(string memory _batchNo) public view returns (bool) {
        address medicineAddress = medicines[_batchNo];
        if (medicineAddress == address(0) || !registeredMedicines[medicineAddress]) {
            return false;
        }
        
        Medicine medicine = Medicine(medicineAddress);
        return medicine.verifyBatch(_batchNo);
    }

    function getMedicineContract(string memory _batchNo) public view returns (address) {
        return medicines[_batchNo];
    }

    function getMedicineData(string memory _batchNo) public view returns (
        string memory medicineName,
        string memory batchNo,
        uint mfgDate,
        uint expDate,
        uint quantity,
        address _manufacturer,
        bool isAuthentic,
        bool exists
    ) {
        address medicineAddress = medicines[_batchNo];
        require(medicineAddress != address(0), "Medicine does not exist");
        require(registeredMedicines[medicineAddress], "Medicine not registered");
        
        Medicine medicine = Medicine(medicineAddress);
        Medicine.MedicineData memory data = medicine.getBatchData(_batchNo);
        
        return (
            medicine.medicineName(),
            data.batchNo,
            data.mfgDate,
            data.expDate,
            data.quantity,
            manufacturer,
            data.isAuthentic,
            data.exists
        );
    }
    
    /**
     * @dev Get medicine data including ENS information
     * @param _medicineName The name of the medicine
     * @return medicineName The name of the medicine
     * @return manufacturerName The manufacturer name
     * @return ensSubname The ENS subname
     * @return ensFullName The full ENS name
     * @return hasENS Whether the medicine has an ENS subname
     */
    function getMedicineWithENSData(string memory _medicineName) public view returns (
        string memory medicineName,
        string memory manufacturerName,
        string memory ensSubname,
        string memory ensFullName,
        bool hasENS
    ) {
        address medicineAddress = medicines[_medicineName];
        require(medicineAddress != address(0), "Medicine does not exist");
        require(registeredMedicines[medicineAddress], "Medicine not registered");
        
        Medicine medicine = Medicine(medicineAddress);
        
        return (
            medicine.medicineName(),
            medicine.manufacturerName(),
            medicine.getENSSubname(),
            medicine.getENSFullName(),
            medicine.hasENSSubname()
        );
    }
    
    /**
     * @dev Get medicine address by ENS subname
     * @param _ensSubname The ENS subname to look up
     * @return The medicine contract address
     */
    function getMedicineByENSSubname(string memory _ensSubname) public view returns (address) {
        require(ensRegistrar != address(0), "ENS registrar not set");
        
        MedicineENSRegistrar registrar = MedicineENSRegistrar(ensRegistrar);
        return registrar.getMedicineFromSubname(_ensSubname);
    }
    
    /**
     * @dev Check if a medicine subname is available under a manufacturer
     * @param _medicineName The medicine name to check
     * @param _manufacturerName The manufacturer name
     * @return True if available, false otherwise
     */
    function isMedicineSubnameAvailable(string memory _medicineName, string memory _manufacturerName) public view returns (bool) {
        require(ensRegistrar != address(0), "ENS registrar not set");
        
        MedicineENSRegistrar registrar = MedicineENSRegistrar(ensRegistrar);
        return registrar.isMedicineSubnameAvailable(_medicineName, _manufacturerName);
    }
    
    /**
     * @dev Check if a manufacturer subdomain is available
     * @param _manufacturerName The manufacturer name to check
     * @return True if available, false otherwise
     */
    function isManufacturerSubdomainAvailable(string memory _manufacturerName) public view returns (bool) {
        require(ensRegistrar != address(0), "ENS registrar not set");
        
        MedicineENSRegistrar registrar = MedicineENSRegistrar(ensRegistrar);
        return registrar.isManufacturerSubdomainAvailable(_manufacturerName);
    }
}
