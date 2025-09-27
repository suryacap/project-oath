// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oath {
    mapping(address => bool) public manufacturers;
    mapping(string => Batch) public batches;
    
    address public admin;
    uint256 public batchCounter;
    
    struct Batch {
        string batchId;
        string medicineName;
        uint256 quantity;
        uint256 manufacturingDate;
        uint256 expiryDate;
        uint256 price;
        address manufacturer;
        bool exists;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }
    
    modifier onlyManufacturer() {
        require(manufacturers[msg.sender], "Caller is not an enrolled manufacturer");
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
    
    function mintNewBatch(
        string memory _batchId,
        string memory _medicineName,
        uint256 _quantity,
        uint256 _manufacturingDate,
        uint256 _expiryDate,
        uint256 _price
    ) public onlyManufacturer {
        require(!batches[_batchId].exists, "Batch ID already exists");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(_expiryDate > _manufacturingDate, "Expiry date must be after manufacturing date");
        require(_price > 0, "Price must be greater than 0");
        
        batches[_batchId] = Batch({
            batchId: _batchId,
            medicineName: _medicineName,
            quantity: _quantity,
            manufacturingDate: _manufacturingDate,
            expiryDate: _expiryDate,
            price: _price,
            manufacturer: msg.sender,
            exists: true
        });
        
        batchCounter++;
        
        emit BatchMinted(_batchId, _medicineName, _quantity, _manufacturingDate, _expiryDate, _price, msg.sender);
    }
    
    function getBatch(string memory _batchId) public view returns (
        string memory,
        string memory,
        uint256,
        uint256,
        uint256,
        uint256,
        address
    ) {
        require(batches[_batchId].exists, "Batch does not exist");
        Batch memory batch = batches[_batchId];
        return (
            batch.batchId,
            batch.medicineName,
            batch.quantity,
            batch.manufacturingDate,
            batch.expiryDate,
            batch.price,
            batch.manufacturer
        );
    }
    
    function getTotalBatches() public view returns (uint256) {
        return batchCounter;
    }
    
    event BatchMinted(
        string indexed batchId,
        string medicineName,
        uint256 quantity,
        uint256 manufacturingDate,
        uint256 expiryDate,
        uint256 price,
        address manufacturer
    );
}