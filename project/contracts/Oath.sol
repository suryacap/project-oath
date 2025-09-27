// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oath {
    mapping(address => bool) public manufacturers;
    mapping(address => bool) public pharmacies;
    mapping(address => bool) public doctors;
    mapping(string => Batch) public batches;
    mapping(string => DispensingRecord[]) public dispensingHistory;
    mapping(string => Prescription) public prescriptions;
    
    address public admin;
    uint256 public batchCounter;
    uint256 public dispensingCounter;
    uint256 public prescriptionCounter;
    
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
    
    struct DispensingRecord {
        string batchId;
        string prescriptionId;
        address patient;
        address doctor;
        address pharmacy;
        uint256 timestamp;
        uint256 quantity;
        bool exists;
    }
    
    struct Prescription {
        string prescriptionId;
        address patient;
        address doctor;
        string medicineName;
        string dosage;
        uint256 quantity;
        uint256 timestamp;
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
    
    modifier onlyPharmacy() {
        require(pharmacies[msg.sender], "Caller is not an enrolled pharmacy");
        _;
    }
    
    modifier onlyDoctor() {
        require(doctors[msg.sender], "Caller is not an enrolled doctor");
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
    
    function enrollPharmacy(address _pharmacyAddress) public onlyAdmin {
        require(!pharmacies[_pharmacyAddress], "Pharmacy already enrolled");
        pharmacies[_pharmacyAddress] = true;
    }

    function deactivatePharmacy(address _pharmacyAddress) public onlyAdmin {
        require(pharmacies[_pharmacyAddress], "Pharmacy not active");
        pharmacies[_pharmacyAddress] = false;
    }
    
    function enrollDoctor(address _doctorAddress) public onlyAdmin {
        require(!doctors[_doctorAddress], "Doctor already enrolled");
        doctors[_doctorAddress] = true;
    }

    function deactivateDoctor(address _doctorAddress) public onlyAdmin {
        require(doctors[_doctorAddress], "Doctor not active");
        doctors[_doctorAddress] = false;
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
    
    function verifyDrug(string memory _batchId) public returns (bool) {
        require(bytes(_batchId).length > 0, "Batch ID cannot be empty");
        
        if (!batches[_batchId].exists) {
            emit DrugVerification(_batchId, false, msg.sender, "Batch does not exist");
            return false;
        }
        
        Batch memory batch = batches[_batchId];
        
        // Check if the batch is from an active manufacturer
        if (!manufacturers[batch.manufacturer]) {
            emit DrugVerification(_batchId, false, msg.sender, "Manufacturer is not active");
            return false;
        }
        
        // Check if the batch has expired
        if (block.timestamp > batch.expiryDate) {
            emit DrugVerification(_batchId, false, msg.sender, "Batch has expired");
            return false;
        }
        
        emit DrugVerification(_batchId, true, msg.sender, "Drug verified successfully");
        return true;
    }
    
    function getBatchDetails(string memory _batchId) public view returns (
        string memory,
        string memory,
        uint256,
        uint256,
        uint256,
        uint256,
        address,
        bool
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
            batch.manufacturer,
            manufacturers[batch.manufacturer] // Check if manufacturer is still active
        );
    }
    
    function dispenseDrug(
        string memory _batchId,
        string memory _prescriptionId,
        address _patient,
        address _doctor,
        uint256 _quantity
    ) public onlyPharmacy returns (bool) {
        require(bytes(_batchId).length > 0, "Batch ID cannot be empty");
        require(bytes(_prescriptionId).length > 0, "Prescription ID cannot be empty");
        require(_patient != address(0), "Invalid patient address");
        require(_doctor != address(0), "Invalid doctor address");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(batches[_batchId].exists, "Batch does not exist");
        require(prescriptions[_prescriptionId].exists, "Prescription does not exist");
        
        // Validate prescription details
        Prescription memory prescription = prescriptions[_prescriptionId];
        require(prescription.patient == _patient, "Prescription patient does not match");
        require(prescription.doctor == _doctor, "Prescription doctor does not match");
        require(prescription.quantity >= _quantity, "Prescription quantity insufficient");
        
        Batch storage batch = batches[_batchId];
        
        // Check if batch has expired
        require(block.timestamp <= batch.expiryDate, "Batch has expired");
        
        // Check if manufacturer is still active
        require(manufacturers[batch.manufacturer], "Manufacturer is not active");
        
        // Check if sufficient quantity is available
        require(batch.quantity >= _quantity, "Insufficient quantity available");
        
        // Reduce the available quantity
        batch.quantity -= _quantity;
        
        // Create dispensing record
        DispensingRecord memory record = DispensingRecord({
            batchId: _batchId,
            prescriptionId: _prescriptionId,
            patient: _patient,
            doctor: _doctor,
            pharmacy: msg.sender,
            timestamp: block.timestamp,
            quantity: _quantity,
            exists: true
        });
        
        // Store the dispensing record
        dispensingHistory[_batchId].push(record);
        dispensingCounter++;
        
        emit DrugDispensed(_batchId, _prescriptionId, _patient, _doctor, msg.sender, _quantity, block.timestamp);
        
        return true;
    }
    
    function getDispensingHistory(string memory _batchId) public view returns (
        string[] memory,
        address[] memory,
        address[] memory,
        address[] memory,
        uint256[] memory,
        uint256[] memory
    ) {
        require(batches[_batchId].exists, "Batch does not exist");
        
        DispensingRecord[] memory records = dispensingHistory[_batchId];
        uint256 length = records.length;
        
        string[] memory prescriptionIds = new string[](length);
        address[] memory _patients = new address[](length);
        address[] memory _doctors = new address[](length);
        address[] memory _pharmacies = new address[](length);
        uint256[] memory quantities = new uint256[](length);
        uint256[] memory timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            prescriptionIds[i] = records[i].prescriptionId;
            _patients[i] = records[i].patient;
            _doctors[i] = records[i].doctor;
            _pharmacies[i] = records[i].pharmacy;
            quantities[i] = records[i].quantity;
            timestamps[i] = records[i].timestamp;
        }
        
        return (prescriptionIds, _patients, _doctors, _pharmacies, quantities, timestamps);
    }
    
    function getTotalDispensings() public view returns (uint256) {
        return dispensingCounter;
    }
    
    function prescribeMedicine(
        address _patient,
        string memory _medicineName,
        string memory _dosage,
        uint256 _quantity
    ) public onlyDoctor returns (string memory) {
        require(_patient != address(0), "Invalid patient address");
        require(bytes(_medicineName).length > 0, "Medicine name cannot be empty");
        require(bytes(_dosage).length > 0, "Dosage cannot be empty");
        require(_quantity > 0, "Quantity must be greater than 0");
        
        // Generate unique prescription ID using keccak256 hash
        string memory prescriptionId = string(abi.encodePacked(
            "Rx_",
            _toHexString(uint160(msg.sender)),
            "_",
            _toHexString(uint160(_patient)),
            "_",
            _toHexString(block.timestamp),
            "_",
            _toHexString(prescriptionCounter)
        ));
        
        // Ensure prescription ID is unique
        require(!prescriptions[prescriptionId].exists, "Prescription ID collision");
        
        // Create prescription record
        Prescription memory prescription = Prescription({
            prescriptionId: prescriptionId,
            patient: _patient,
            doctor: msg.sender,
            medicineName: _medicineName,
            dosage: _dosage,
            quantity: _quantity,
            timestamp: block.timestamp,
            exists: true
        });
        
        // Store the prescription
        prescriptions[prescriptionId] = prescription;
        prescriptionCounter++;
        
        emit PrescriptionCreated(prescriptionId, _patient, msg.sender, _medicineName, _dosage, _quantity, block.timestamp);
        
        return prescriptionId;
    }
    
    function getPrescription(string memory _prescriptionId) public view returns (
        string memory,
        address,
        address,
        string memory,
        string memory,
        uint256,
        uint256
    ) {
        require(prescriptions[_prescriptionId].exists, "Prescription does not exist");
        Prescription memory prescription = prescriptions[_prescriptionId];
        return (
            prescription.prescriptionId,
            prescription.patient,
            prescription.doctor,
            prescription.medicineName,
            prescription.dosage,
            prescription.quantity,
            prescription.timestamp
        );
    }
    
    function getTotalPrescriptions() public view returns (uint256) {
        return prescriptionCounter;
    }
    
    function _toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 16;
        }
        bytes memory buffer = new bytes(digits);
        for (uint256 i = digits; i > 0; i--) {
            buffer[i - 1] = _toHexChar(uint8(value & 0xf));
            value >>= 4;
        }
        return string(buffer);
    }
    
    function _toHexChar(uint8 value) internal pure returns (bytes1) {
        if (value < 10) {
            return bytes1(uint8(bytes1('0')) + value);
        } else {
            return bytes1(uint8(bytes1('a')) + value - 10);
        }
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
    
    event DrugVerification(
        string indexed batchId,
        bool verified,
        address pharmacy,
        string reason
    );
    
    event DrugDispensed(
        string indexed batchId,
        string prescriptionId,
        address indexed patient,
        address indexed doctor,
        address pharmacy,
        uint256 quantity,
        uint256 timestamp
    );
    
    event PrescriptionCreated(
        address indexed patient,
        address indexed doctor,
        string prescriptionId,
        string medicineName,
        string dosage,
        uint256 quantity,
        uint256 timestamp
    );
}