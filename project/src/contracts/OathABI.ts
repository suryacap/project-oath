// Contract ABI for Oath.sol
export const OATH_ABI = [
  // Events
  "event BatchMinted(string indexed batchId, string medicineName, uint256 quantity, uint256 manufacturingDate, uint256 expiryDate, uint256 price, address manufacturer)",
  "event DrugVerification(string indexed batchId, bool verified, address pharmacy, string reason)",
  "event DrugDispensed(string indexed batchId, string prescriptionId, address indexed patient, address indexed doctor, address pharmacy, uint256 quantity, uint256 timestamp)",
  "event PrescriptionCreated(address indexed patient, address indexed doctor, string prescriptionId, string medicineName, string dosage, uint256 quantity, uint256 timestamp)",
  
  // View functions
  "function manufacturers(address) view returns (bool)",
  "function pharmacies(address) view returns (bool)",
  "function doctors(address) view returns (bool)",
  "function admin() view returns (address)",
  "function batchCounter() view returns (uint256)",
  "function dispensingCounter() view returns (uint256)",
  "function prescriptionCounter() view returns (uint256)",
  
  // Batch functions
  "function mintNewBatch(string memory _batchId, string memory _medicineName, uint256 _quantity, uint256 _manufacturingDate, uint256 _expiryDate, uint256 _price) external",
  "function getBatch(string memory _batchId) view returns (string memory, string memory, uint256, uint256, uint256, uint256, address)",
  "function getBatchDetails(string memory _batchId) view returns (string memory, string memory, uint256, uint256, uint256, uint256, address, bool)",
  "function getTotalBatches() view returns (uint256)",
  "function verifyDrug(string memory _batchId) returns (bool)",
  
  // Admin functions
  "function enrollManufacturer(address _manufacturerAddress) external",
  "function deactivateManufacturer(address _manufacturerAddress) external",
  "function enrollPharmacy(address _pharmacyAddress) external",
  "function deactivatePharmacy(address _pharmacyAddress) external",
  "function enrollDoctor(address _doctorAddress) external",
  "function deactivateDoctor(address _doctorAddress) external",
  
  // Pharmacy functions
  "function dispenseDrug(string memory _batchId, string memory _prescriptionId, address _patient, address _doctor, uint256 _quantity) external returns (bool)",
  "function getDispensingHistory(string memory _batchId) view returns (string[] memory, address[] memory, address[] memory, address[] memory, uint256[] memory, uint256[] memory)",
  "function getTotalDispensings() view returns (uint256)",
  
  // Doctor functions
  "function prescribeMedicine(address _patient, string memory _medicineName, string memory _dosage, uint256 _quantity) external returns (string memory)",
  "function getPrescription(string memory _prescriptionId) view returns (string memory, address, address, string memory, string memory, uint256, uint256)",
  "function getTotalPrescriptions() view returns (uint256)",
  "function getPrescriptionsByDoctor(address _doctor) view returns (string[] memory)",
  "function getPrescriptionCountByDoctor(address _doctor) view returns (uint256)",
  "function getPrescriptionDetailsByDoctor(address _doctor) view returns (string[] memory, address[] memory, string[] memory, string[] memory, uint256[] memory, uint256[] memory)",
  "function getPrescriptionsByPatient(address _patient) view returns (string[] memory)",
  "function getPrescriptionCountByPatient(address _patient) view returns (uint256)",
  "function getPrescriptionDetailsByPatient(address _patient) view returns (string[] memory, address[] memory, string[] memory, string[] memory, uint256[] memory, uint256[] memory)"
];

export const OATH_CONTRACT_ADDRESS = "0x0B3b1bB97272050819355A98fbbAE47e0F9f44b1";

// TypeScript interfaces for contract data
export interface Batch {
  batchId: string;
  medicineName: string;
  quantity: number;
  manufacturingDate: number;
  expiryDate: number;
  price: number;
  manufacturer: string;
  exists: boolean;
}

export interface Prescription {
  prescriptionId: string;
  patient: string;
  doctor: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  timestamp: number;
  exists: boolean;
}

export interface DispensingRecord {
  batchId: string;
  prescriptionId: string;
  patient: string;
  doctor: string;
  pharmacy: string;
  timestamp: number;
  quantity: number;
  exists: boolean;
}
