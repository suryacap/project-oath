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

    modifier onlyDoctor() {
        require(doctors[msg.sender], "Not an authorized doctor");
        _;
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
}
