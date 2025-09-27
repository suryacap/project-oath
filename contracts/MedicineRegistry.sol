// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicineRegistry {
    struct Medicine {
        string medicineName;
        string batchNo;
        uint mfgDate;
        uint expDate;
        uint quantity;
        address manufacturer;
        bool isAuthentic;
    }

    mapping(string => Medicine) public medicines; // Mapping from batchNo to Medicine
    mapping(address => bool) public manufacturers; // Authorized manufacturers

    modifier onlyManufacturer() {
        require(manufacturers[msg.sender], "Not an authorized manufacturer");
        _;
    }

    function addMedicine(
        string memory _medicineName,
        string memory _batchNo,
        uint _mfgDate,
        uint _expDate,
        uint _quantity
    ) public onlyManufacturer {
        medicines[_batchNo] = Medicine({
            medicineName: _medicineName,
            batchNo: _batchNo,
            mfgDate: _mfgDate,
            expDate: _expDate,
            quantity: _quantity,
            manufacturer: msg.sender,
            isAuthentic: true
        });
    }

    function updateMedicineQuantity(string memory _batchNo, uint _quantity) public onlyManufacturer {
        require(medicines[_batchNo].manufacturer == msg.sender, "Not the manufacturer");
        medicines[_batchNo].quantity = _quantity;
    }

    function verifyMedicine(string memory _batchNo) public view returns (bool) {
        return medicines[_batchNo].isAuthentic;
    }

    function markMedicineAsFake(string memory _batchNo) public onlyManufacturer {
        medicines[_batchNo].isAuthentic = false;
    }
}
