// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Medicine {
    struct MedicineData {
        string batchNo;
        uint mfgDate;
        uint expDate;
        uint quantity;
        bool isAuthentic;
        bool exists;
    }

    mapping(string => MedicineData) public batches;
    address public manufacturer;
    address public registry;
    string public medicineName; // remove after ens integration
    uint256 totalBatches;

    constructor(
        string memory _medicineName,
        address _manufacturer
    ) {
        medicineName = _medicineName;
        manufacturer = _manufacturer;
        registry = msg.sender;
    }

    modifier onlyRegistry() {
        require(msg.sender == registry, "Caller is not the registry");
        _;
    }

    function addNewBatch(
        string memory _batchNo,
        uint _mfgDate,
        uint _expDate,
        uint _quantity
    ) public onlyRegistry {
        require(!batches[_batchNo].exists, "Batch already exists");

        batches[_batchNo] = MedicineData({
            batchNo: _batchNo,
            mfgDate: _mfgDate,
            expDate: _expDate,
            quantity: _quantity,
            isAuthentic: true,
            exists: true
        });

        totalBatches++;
    }

    function updateQuantity(string memory _batchNo, uint _quantity) public onlyRegistry {
        require(batches[_batchNo].exists, "Batch does not exist");
        
        batches[_batchNo].quantity = _quantity;
    }

    function updateAuthenticity(string memory _batchNo, bool _isAuthentic) public onlyRegistry {
        require(batches[_batchNo].exists, "Batch does not exist");
        
        batches[_batchNo].isAuthentic = _isAuthentic;
    }

    function verifyBatch(string memory _batchNo) public view returns (bool) {
        require(batches[_batchNo].exists, "Batch does not exist");
        return batches[_batchNo].isAuthentic;
    }

    function isBatchExpired(string memory _batchNo) public view returns (bool) {
        require(batches[_batchNo].exists, "Batch does not exist");
        return block.timestamp > batches[_batchNo].expDate;
    }

    function getDaysUntilBatchExpiry(string memory _batchNo) public view returns (int256) {
        require(batches[_batchNo].exists, "Batch does not exist");
        if (block.timestamp >= batches[_batchNo].expDate) {
            return 0;
        }
        return int256(batches[_batchNo].expDate - block.timestamp) / 86400; // Convert to days
    }

    function getBatchData(string memory _batchNo) public view returns (MedicineData memory) {
        require(batches[_batchNo].exists, "Batch does not exist");
        return batches[_batchNo];
    }
}
