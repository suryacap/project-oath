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
    string public medicineName;
    string public manufacturerName; // Manufacturer name for ENS
    string public ensSubname; // ENS subname for this medicine (format: medicinename.manufacturername)
    string public ensFullName; // Full ENS name (e.g., "aspirin.pfizer.oath.eth")
    uint256 totalBatches;

    constructor(
        string memory _medicineName,
        address _manufacturer
    ) {
        medicineName = _medicineName;
        manufacturer = _manufacturer;
        registry = msg.sender;
    }
    
    /**
     * @dev Set the manufacturer name for ENS (only registry can call)
     * @param _manufacturerName The manufacturer name
     */
    function setManufacturerName(string memory _manufacturerName) public onlyRegistry {
        require(bytes(_manufacturerName).length > 0, "Manufacturer name cannot be empty");
        manufacturerName = _manufacturerName;
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
    
    /**
     * @dev Set the ENS subname for this medicine (only registry can call)
     * @param _subname The ENS subname
     * @param _fullName The full ENS name including parent domain
     */
    function setENSSubname(string memory _subname, string memory _fullName) public onlyRegistry {
        require(bytes(_subname).length > 0, "Subname cannot be empty");
        require(bytes(_fullName).length > 0, "Full name cannot be empty");
        
        string memory oldSubname = ensSubname;
        ensSubname = _subname;
        ensFullName = _fullName;
    }
    
    /**
     * @dev Update the ENS subname for this medicine (only registry can call)
     * @param _newSubname The new ENS subname
     * @param _newFullName The new full ENS name including parent domain
     */
    function updateENSSubname(string memory _newSubname, string memory _newFullName) public onlyRegistry {
        require(bytes(_newSubname).length > 0, "Subname cannot be empty");
        require(bytes(_newFullName).length > 0, "Full name cannot be empty");
        require(bytes(ensSubname).length > 0, "No existing subname to update");
        
        string memory oldSubname = ensSubname;
        ensSubname = _newSubname;
        ensFullName = _newFullName;
    }
    
    /**
     * @dev Get the ENS subname for this medicine
     * @return The ENS subname
     */
    function getENSSubname() public view returns (string memory) {
        return ensSubname;
    }
    
    /**
     * @dev Get the full ENS name for this medicine
     * @return The full ENS name
     */
    function getENSFullName() public view returns (string memory) {
        return ensFullName;
    }
    
    /**
     * @dev Check if this medicine has an ENS subname
     * @return True if medicine has ENS subname, false otherwise
     */
    function hasENSSubname() public view returns (bool) {
        return bytes(ensSubname).length > 0;
    }
    
    /**
     * @dev Get comprehensive medicine information including ENS data
     * @return medicineName The name of the medicine
     * @return manufacturerName The manufacturer name
     * @return ensSubname The ENS subname
     * @return ensFullName The full ENS name
     * @return manufacturer The manufacturer address
     * @return totalBatches The total number of batches
     * @return hasENS Whether the medicine has an ENS subname
     */
    function getMedicineInfo() public view returns (
        string memory medicineName,
        string memory manufacturerName,
        string memory ensSubname,
        string memory ensFullName,
        address manufacturer,
        uint256 totalBatches,
        bool hasENS
    ) {
        return (
            medicineName,
            manufacturerName,
            ensSubname,
            ensFullName,
            manufacturer,
            totalBatches,
            bytes(ensSubname).length > 0
        );
    }
    
    /**
     * @dev Get batch information with ENS context
     * @param _batchNo The batch number to look up
     * @return batchData The batch data
     * @return ensSubname The ENS subname for this medicine
     * @return ensFullName The full ENS name for this medicine
     */
    function getBatchDataWithENS(string memory _batchNo) public view returns (
        MedicineData memory batchData,
        string memory ensSubname,
        string memory ensFullName
    ) {
        require(batches[_batchNo].exists, "Batch does not exist");
        
        return (
            batches[_batchNo],
            ensSubname,
            ensFullName
        );
    }
}
