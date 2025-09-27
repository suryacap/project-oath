// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Medicine.sol";

contract MedicineRegistry {
    mapping(string => address) public medicines; // Mapping from medicine name to Medicine contract address
    mapping(string => address) public batches; // Mapping from batchNo to contract address
    mapping(address => bool) public registeredMedicines; // Track registered medicine contracts
    address public manufacturer;

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
}
