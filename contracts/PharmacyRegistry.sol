// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PharmacyRegistry {
    struct PharmacyInventory {
        string medicineENS;
        string batchNo;
        uint inventoryQty;
    }

    mapping(string => PharmacyInventory) public pharmacyInventory;

    function updateInventory(
        string memory _medicineENS,
        string memory _batchNo,
        uint _inventoryQty
    ) public {
        pharmacyInventory[_batchNo] = PharmacyInventory({
            medicineENS: _medicineENS,
            batchNo: _batchNo,
            inventoryQty: _inventoryQty
        });
    }

    function verifyInventory(string memory _batchNo, uint _qty) public view returns (bool) {
        if (pharmacyInventory[_batchNo].inventoryQty >= _qty) {
            return true;
        }
        return false;
    }
}
