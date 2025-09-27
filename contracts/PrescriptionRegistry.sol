// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PrescriptionRegistry {
    struct Prescription {
        string prescriptionId;
        string doctorENS;
        string medicineENS;
        uint dosage;
        string patientENS;
        bool isValid;
    }

    mapping(string => Prescription) public prescriptions; // Mapping from prescriptionId to Prescription
    mapping(address => bool) public doctors; // Authorized doctors
    address public admin;

    modifier onlyDoctor() {
        require(doctors[msg.sender], "Not an authorized doctor");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setAdmin(address _NewAdmin) public onlyAdmin {
        admin = _NewAdmin;
    }

    function issuePrescription(
        string memory _prescriptionId,
        string memory _doctorENS,
        string memory _medicineENS,
        uint _dosage,
        string memory _patientENS
    ) public onlyDoctor {
        prescriptions[_prescriptionId] = Prescription({
            prescriptionId: _prescriptionId,
            doctorENS: _doctorENS,
            medicineENS: _medicineENS,
            dosage: _dosage,
            patientENS: _patientENS,
            isValid: true
        });
    }

    function verifyPrescription(string memory _prescriptionId) public view returns (bool) {
        return prescriptions[_prescriptionId].isValid;
    }

    function invalidatePrescription(string memory _prescriptionId) public onlyDoctor {
        prescriptions[_prescriptionId].isValid = false;
    }

    function addDoctor(address _doctorAddress) public onlyAdmin {
        doctors[_doctorAddress] = true;
    }

    function removeDoctor(address _doctorAddress) public onlyAdmin {
        doctors[_doctorAddress] = false;
    }
}
