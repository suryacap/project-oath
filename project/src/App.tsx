import React, { useState, useMemo } from 'react';

// TypeScript declaration for ethereum and global functions
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
    };
    showProfile?: () => void;
  }
}
import { 
  CheckCircle, 
  XCircle, 
  Shield, 
  Pill, 
  Factory, 
  Building2, 
  User, 
  Search, 
  FileText, 
  Calendar, 
  Clock, 
  Wallet, 
  LogOut,
  Upload,
  Award,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Package,
  Link,
  Zap,
  Fingerprint,
  Eye,
  Database,
  Lock,
  BarChart3
} from 'lucide-react';

// Theme Configuration
const THEME = {
  PRIMARY: '#004D40',
  SECONDARY: '#4DB6AC', 
  SUCCESS: '#8BC34A',
  CRITICAL: '#E53935',
  WARNING: '#FF9800',
  TEXT: '#1A1A1A',
  BG: '#FFFFFF',
  BG_LIGHT: '#F9FAFB'
};

// Wallet Role Mapping (simulated based on wallet addresses)
const WALLET_ROLES = {
  // Manufacturer wallets
  '0x742d35cc6bf8c8a2c8c5a9d3f8b2e9c7a1d4f6b8': 'Manufacturer',
  '0x1234567890abcdef1234567890abcdef12345678': 'Manufacturer',
  '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12': 'Manufacturer',
  '0x9876543210fedcba9876543210fedcba98765432': 'Manufacturer',
  
  // Pharmacy wallets  
  '0x5b6f7a8c9d2e4f1b3a6d8c5f2e9b4a7d3c6f9e2': 'Pharmacy',
  '0xabcdef1234567890abcdef1234567890abcdef12': 'Pharmacy',
  '0x2b3c4d5e6f7890abcdef1234567890abcdef1234': 'Pharmacy',
  '0x876543210fedcba9876543210fedcba9876543210': 'Pharmacy',
  
  // Doctor wallets
  '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0': 'Doctor',
  '0xfedcba0987654321fedcba0987654321fedcba09': 'Doctor',
  '0x3c4d5e6f7890abcdef1234567890abcdef123456': 'Doctor',
  '0x76543210fedcba9876543210fedcba9876543210f': 'Doctor',
  
  // Patient wallets
  '0x3c6f9e2b5a8d1c4f7e0b3a6d9c2f5e8b1a4d7c0': 'Patient',
  '0x0987654321fedcba0987654321fedcba09876543': 'Patient',
  '0x4d5e6f7890abcdef1234567890abcdef12345678': 'Patient',
  '0x6543210fedcba9876543210fedcba9876543210fe': 'Patient',
  
  // Insurer wallets
  '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234': 'Insurer',
  '0x9f8e7d6c5b4a3928f7e6d5c4b3a2918f7e6d5c4': 'Insurer',
  '0x5a4b3c2d1e0f9e8d7c6b5a4938271605f4e3d2c': 'Insurer',
  '0x8e7d6c5b4a3928f7e6d5c4b3a2918f7e6d5c4b3': 'Insurer'
};

// Profile Data for each role
const PROFILE_DATA = {
  Manufacturer: {
    companyName: "MediPharm Industries",
    type: "Pharmaceutical Manufacturing Company",
    founded: "2010",
    license: "MFG-2024-001",
    certifications: ["FDA Approved", "ISO 9001:2015", "GMP Certified", "WHO Prequalified"],
    specializations: ["Pharmaceutical Manufacturing", "Quality Control", "Regulatory Compliance", "Drug Development"],
    contact: {
      email: "info@medipharm.com",
      phone: "+1-555-0123",
      address: "123 Pharma Ave, Boston, MA 02101",
      website: "www.medipharm.com"
    },
    kyc: {
      status: "verified",
      verifiedDate: "2024-01-15",
      documents: ["Business License", "FDA Registration", "ISO Certification", "GMP Certificate"]
    }
  },
  Pharmacy: {
    companyName: "HealthPlus Pharmacy",
    type: "Licensed Pharmacy Chain",
    founded: "2015",
    license: "PHARM-2024-045",
    certifications: ["State Pharmacy License", "DEA Registration", "NABP Verified", "HIPAA Compliant"],
    specializations: ["Prescription Management", "Drug Interactions", "Patient Counseling", "Compounding Services"],
    contact: {
      email: "info@healthplus.com",
      phone: "+1-555-0456",
      address: "456 Health St, San Francisco, CA 94102",
      website: "www.healthplus.com"
    },
    kyc: {
      status: "verified",
      verifiedDate: "2024-01-20",
      documents: ["Pharmacy License", "DEA Registration", "State Board Certification", "NABP Certificate"]
    }
  },
  Doctor: {
    name: "Dr. Emily Rodriguez",
    title: "Internal Medicine Specialist",
    hospital: "City General Hospital",
    license: "MD-2024-078",
    experience: "18 years",
    specializations: ["Internal Medicine", "Chronic Disease Management", "Preventive Care"],
    contact: {
      email: "emily.rodriguez@citygeneral.com",
      phone: "+1-555-0789",
      address: "789 Medical Blvd, New York, NY 10001"
    },
    kyc: {
      status: "verified",
      verifiedDate: "2024-01-10",
      documents: ["Medical License", "Board Certification", "Hospital Privileges"]
    }
  },
  Patient: {
    name: "John Smith",
    title: "Patient",
    age: "45",
    bloodType: "O+",
    allergies: ["Penicillin", "Shellfish"],
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1-555-9999"
    },
    medicalHistory: ["Hypertension", "Type 2 Diabetes"],
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-123456789"
    },
    biometricData: {
      fingerprintHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234",
      isRegistered: true,
      registeredDate: "2024-01-15"
    }
  },
  Insurer: {
    companyName: "HealthGuard Insurance",
    type: "Health Insurance Provider",
    founded: "2005",
    license: "INS-2024-001",
    certifications: ["State Insurance License", "HIPAA Compliant", "SOC 2 Type II", "ISO 27001"],
    specializations: ["Health Insurance", "Claims Processing", "Risk Assessment", "Patient Data Analytics"],
    contact: {
      email: "info@healthguard.com",
      phone: "+1-555-0123",
      address: "789 Insurance Blvd, New York, NY 10001",
      website: "www.healthguard.com"
    },
    kyc: {
      status: "verified",
      verifiedDate: "2024-01-10",
      documents: ["Insurance License", "State Registration", "Financial Statements", "Compliance Certificate"]
    }
  }
};

// Enhanced Dummy Data
const DUMMY_DATA = {
  batches: [
    { 
      id: 'BATCH-4537', 
      name: 'Paracetamol 500mg', 
      manufacturer: 'Global Pharma', 
      integrityHash: '0x12a3c4d5f8b2e9c7a1d4f6b8e2c5a9d3', 
      status: 'Verified', 
      date: '2024-09-01',
      quantity: 10000,
      expiry: '2026-09-01'
    },
    { 
      id: 'BATCH-8890', 
      name: 'Amoxicillin 250mg', 
      manufacturer: 'HealthCorp Labs', 
      integrityHash: '0x5b6f7a8c9d2e4f1b3a6d8c5f2e9b4a7d', 
      status: 'Verified', 
      date: '2024-08-20',
      quantity: 5000,
      expiry: '2025-08-20'
    },
    { 
      id: 'BATCH-1122', 
      name: 'Counterfeit Test', 
      manufacturer: 'Unknown', 
      integrityHash: '0x0000000000000000000000000000000', 
      status: 'Compromised', 
      date: '2024-10-01',
      quantity: 0,
      expiry: 'Invalid'
    }
  ],
  biometricPatients: [
    {
      id: 'PAT-001',
      name: 'John Smith',
      fingerprintHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234',
      walletAddress: '0x3c6f9e2b5a8d1c4f7e0b3a6d9c2f5e8b1a4d7c0',
      medicalHistory: [
        { type: 'Prescription Issued', medication: 'Paracetamol 500mg', doctor: 'Dr. A. Smith', date: '2024-10-15', hash: '0xdef345abc789', details: 'Prescribed for headache relief' },
        { type: 'Drug Dispensed', medication: 'Paracetamol 500mg', batch: 'BATCH-4537', pharmacy: 'City Drugstore', date: '2024-10-16', hash: '0xabc123def456', details: 'Successfully dispensed to patient' },
        { type: 'Check-in', notes: 'No adverse effects reported. Patient recovering well.', doctor: 'Dr. A. Smith', date: '2024-10-25', hash: '0x223344556677', details: 'Follow-up consultation completed' }
      ],
      personalInfo: {
        age: 45,
        bloodType: 'O+',
        allergies: ['Penicillin', 'Shellfish'],
        emergencyContact: { name: 'Jane Smith', relationship: 'Spouse', phone: '+1-555-9999' },
        medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
        insurance: { provider: 'Blue Cross Blue Shield', policyNumber: 'BCBS-123456789' }
      }
    },
    {
      id: 'PAT-002',
      name: 'Sarah Johnson',
      fingerprintHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef12345',
      walletAddress: '0x0987654321fedcba0987654321fedcba09876543',
      medicalHistory: [
        { type: 'Prescription Issued', medication: 'Amoxicillin 250mg', doctor: 'Dr. B. Wilson', date: '2024-10-20', hash: '0xdef345abc790', details: 'Prescribed for bacterial infection' },
        { type: 'Drug Dispensed', medication: 'Amoxicillin 250mg', batch: 'BATCH-8890', pharmacy: 'HealthPlus Pharmacy', date: '2024-10-21', hash: '0xabc123def457', details: 'Successfully dispensed to patient' }
      ],
      personalInfo: {
        age: 32,
        bloodType: 'A+',
        allergies: ['Latex'],
        emergencyContact: { name: 'Mike Johnson', relationship: 'Brother', phone: '+1-555-8888' },
        medicalHistory: ['Asthma'],
        insurance: { provider: 'Aetna', policyNumber: 'AET-987654321' }
      }
    }
  ],
  patientHistory: [
    { 
      type: 'Prescription Issued', 
      medication: 'Paracetamol 500mg', 
      doctor: 'Dr. A. Smith', 
      date: '2024-10-15', 
      hash: '0xdef345abc789',
      details: 'Prescribed for headache relief'
    },
    { 
      type: 'Drug Dispensed', 
      medication: 'Paracetamol 500mg', 
      batch: 'BATCH-4537', 
      pharmacy: 'City Drugstore', 
      date: '2024-10-16', 
      hash: '0xabc123def456',
      details: 'Successfully dispensed to patient'
    },
    { 
      type: 'Check-in', 
      notes: 'No adverse effects reported. Patient recovering well.', 
      doctor: 'Dr. A. Smith', 
      date: '2024-10-25', 
      hash: '0x223344556677',
      details: 'Follow-up consultation completed'
    },
  ],
};

// Biometric Authentication Component
const BiometricAuth = ({ onSuccess, onClose, mode = 'login' }: { onSuccess: (patientData: any) => void; onClose: () => void; mode?: 'login' | 'register' }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFingerprintScan = async () => {
    setIsScanning(true);
    setError('');
    setScanResult(null);

    // Simulate fingerprint scanning
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate scan result
    const mockFingerprintHash = '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234';
    const patient = DUMMY_DATA.biometricPatients.find(p => p.fingerprintHash === mockFingerprintHash);

    if (patient) {
      setScanResult(patient);
      setTimeout(() => {
        onSuccess(patient);
      }, 1000);
    } else {
      setError('Fingerprint not recognized. Please try again or register first.');
    }

    setIsScanning(false);
  };

  const handleRegisterFingerprint = async () => {
    setIsScanning(true);
    setError('');

    // Simulate fingerprint registration
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newFingerprintHash = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
    
    setScanResult({
      id: `PAT-${Date.now()}`,
      name: 'New Patient',
      fingerprintHash: newFingerprintHash,
      message: 'Fingerprint registered successfully!'
    });

    setTimeout(() => {
      onSuccess({ fingerprintHash: newFingerprintHash, isNew: true });
    }, 1000);

    setIsScanning(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Fingerprint className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <h2 className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>
                {mode === 'register' ? 'Register Fingerprint' : 'Biometric Authentication'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
              <Fingerprint className="w-16 h-16 text-gray-400" />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {mode === 'register' ? 'Place your finger on the scanner' : 'Scan your fingerprint'}
            </h3>
            <p className="text-gray-600 mb-6">
              {mode === 'register' 
                ? 'This will register your fingerprint for future authentication'
                : 'This will authenticate your identity and access your medical records'
              }
            </p>

            {error && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {scanResult && !scanResult.message && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  <p className="text-green-700 text-sm">Patient found: {scanResult.name}</p>
                </div>
              </div>
            )}

            {scanResult && scanResult.message && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                  <p className="text-blue-700 text-sm">{scanResult.message}</p>
                </div>
              </div>
            )}

            <button
              onClick={mode === 'register' ? handleRegisterFingerprint : handleFingerprintScan}
              disabled={isScanning}
              className="w-full py-4 font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ backgroundColor: THEME.PRIMARY }}
            >
              {isScanning ? (
                <>
                  <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                  {mode === 'register' ? 'Registering...' : 'Scanning...'}
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5 mr-3" />
                  {mode === 'register' ? 'Register Fingerprint' : 'Scan Fingerprint'}
                </>
              )}
            </button>

            <div className="mt-6 text-xs text-gray-500">
              <p><strong>Security:</strong> Your fingerprint data is encrypted and stored securely on the blockchain.</p>
              <p><strong>Privacy:</strong> Only authorized medical personnel can access your records.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// KYC Verification Component
const KYCVerification = ({ profileData, onClose }: { profileData: any; onClose: () => void }) => {
  const [documents, setDocuments] = useState<{[key: string]: File | null}>({});
  const [isUploading, setIsUploading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(profileData.kyc.status);

  const requiredDocuments = profileData.kyc.documents || [];

  const handleFileUpload = (docType: string, file: File) => {
    setDocuments(prev => ({ ...prev, [docType]: file }));
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Instant verification after submission
    setVerificationStatus('verified');
    setIsUploading(false);
  };

  const handleRedoKYC = () => {
    setVerificationStatus('pending');
    setDocuments({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return THEME.SUCCESS;
      case 'pending': return THEME.WARNING;
      case 'rejected': return THEME.CRITICAL;
      default: return THEME.TEXT;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      default: return AlertTriangle;
    }
  };

  const StatusIcon = getStatusIcon(verificationStatus);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <h2 className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>KYC Verification</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Current Status */}
          <div className="mb-8 p-6 rounded-xl border-2" style={{ borderColor: getStatusColor(verificationStatus) + '20', backgroundColor: getStatusColor(verificationStatus) + '10' }}>
            <div className="flex items-center mb-4">
              <StatusIcon className="w-6 h-6 mr-3" style={{ color: getStatusColor(verificationStatus) }} />
              <h3 className="text-lg font-semibold">Verification Status: {verificationStatus.toUpperCase()}</h3>
            </div>
            {verificationStatus === 'verified' && (
              <p className="text-sm text-gray-600">
                Verified on {profileData.kyc.verifiedDate}. Your identity has been successfully verified.
              </p>
            )}
            {verificationStatus === 'pending' && (
              <p className="text-sm text-gray-600">
                Your documents are under review. This process typically takes 1-3 business days.
              </p>
            )}
          </div>

          {/* Document Upload Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Required Documents</h3>
              {verificationStatus === 'verified' && (
                <button
                  onClick={handleRedoKYC}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: THEME.WARNING, color: 'white' }}
                >
                  <Upload className="w-4 h-4 mr-2 inline" />
                  Redo KYC
                </button>
              )}
            </div>
            
            {requiredDocuments.map((doc: string, index: number) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{doc}</h4>
                  {documents[doc] && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(doc, e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {documents[doc] && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {documents[doc]?.name}
                  </p>
                )}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={isUploading || Object.keys(documents).length !== requiredDocuments.length}
              className="w-full py-3 px-6 font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: THEME.PRIMARY }}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full inline-block"></div>
                  Uploading Documents...
                </>
              ) : (
                'Submit for Instant Verification'
              )}
            </button>
          </div>

          {/* Verification Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">Verification Process</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All documents are encrypted and stored securely</li>
              <li>• Instant verification using AI-powered document analysis</li>
              <li>• You can redo KYC verification at any time</li>
              <li>• Documents are automatically deleted after verification</li>
              <li>• Verification status is updated in real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wallet Connection Hook
const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed. Please install MetaMask extension to continue.');
        setIsConnecting(false);
        return;
      }
      
      // Check if MetaMask is locked
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        
        if (accounts.length === 0) {
          // MetaMask is installed but no accounts are connected
          console.log('No accounts connected, requesting access...');
        }
      } catch (err) {
        console.log('MetaMask is locked, requesting unlock...');
      }
      
      // Request account access to trigger MetaMask popup
      console.log('Requesting MetaMask connection...');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        const address = accounts[0];
        console.log('MetaMask connected:', address);
        setWalletAddress(address);
        setIsConnected(true);
        return address;
      } else {
        setError('No accounts found. Please make sure your wallet is unlocked.');
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user. Please try again.');
      } else if (err.code === -32002) {
        setError('Connection request already pending. Please check your MetaMask extension.');
      } else if (err.message?.includes('User rejected')) {
        setError('Connection rejected by user. Please try again.');
      } else {
        setError('Failed to connect to MetaMask. Please make sure MetaMask is installed and unlocked.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      // If MetaMask is available, try to disconnect
      if (typeof window.ethereum !== 'undefined') {
        // MetaMask doesn't have a direct disconnect method, but we can reset the state
        // The user would need to manually disconnect in MetaMask if they want to
        console.log('Wallet disconnected from app. To fully disconnect, please disconnect in MetaMask.');
      }
    } catch (err) {
      console.error('Error during disconnect:', err);
    } finally {
      // Always reset local state
      setIsConnected(false);
      setWalletAddress('');
      setError('');
    }
  };

  const getUserRole = (address: string) => {
    return WALLET_ROLES[address as keyof typeof WALLET_ROLES] || null;
  };

  return {
    isConnected,
    walletAddress,
    isConnecting,
    error,
    setError,
    connectWallet,
    disconnectWallet,
    getUserRole
  };
};

// Role Selection Screen Component
const WalletConnectionScreen = ({ onWalletConnect, onPublicSearch }: { onWalletConnect: (address: string, role: string) => void; onPublicSearch: () => void }) => {
  const { isConnected, walletAddress, isConnecting, error, connectWallet, getUserRole } = useWallet();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isConnectingWithRole, setIsConnectingWithRole] = useState(false);
  
  const handleConnect = async () => {
    const address = await connectWallet();
    if (address) {
      const role = getUserRole(address);
      if (role) {
        onWalletConnect(address, role);
      }
    }
  };

  const handleConnectWithRole = async (role: string) => {
    setSelectedRole(role);
    setIsConnectingWithRole(true);
    
    try {
      const address = await connectWallet();
      if (address) {
        // Use the selected role instead of auto-detected role
        onWalletConnect(address, role);
      }
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setIsConnectingWithRole(false);
      setSelectedRole(null);
    }
  };

  const WalletRoleCard = ({ address, role }: { address: string; role: string }) => {
    const getRoleIcon = (role: string) => {
      switch (role) {
        case 'Manufacturer': return Factory;
        case 'Pharmacy': return Building2;
        case 'Doctor': return User;
        case 'Patient': return Activity;
        default: return User;
      }
    };

    const getRoleColor = (role: string) => {
      switch (role) {
        case 'Manufacturer': return THEME.PRIMARY;
        case 'Pharmacy': return THEME.SECONDARY;
        case 'Doctor': return THEME.SUCCESS;
        case 'Patient': return THEME.WARNING;
        default: return THEME.PRIMARY;
      }
    };

    const IconComponent = getRoleIcon(role);
    const color = getRoleColor(role);

    return (
      <div className="p-6 rounded-2xl border-2 border-opacity-20 hover:border-opacity-40 transition-all duration-300"
           style={{ borderColor: color, backgroundColor: color + '10' }}>
        <div className="flex items-center mb-4">
          <IconComponent className="w-8 h-8 mr-3" style={{ color }} />
          <div>
            <h3 className="text-xl font-bold" style={{ color }}>{role}</h3>
            <p className="text-sm text-gray-600">Authorized Access</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">Connected Wallet:</p>
          <p className="font-mono text-sm text-gray-800 break-all">{address}</p>
        </div>
        <button
          onClick={() => onWalletConnect(address, role)}
          className="w-full py-3 font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          style={{ backgroundColor: color }}
        >
          <Zap className="w-5 h-5 mr-2 inline" />
          Access {role} Portal
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 mr-3" style={{ color: THEME.PRIMARY }} />
            <h1 className="text-4xl font-bold" style={{ color: THEME.PRIMARY }}>OATH</h1>
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Pharmaceutical Supply Chain</p>
          <p className="text-gray-600">Connect your wallet to access the secure blockchain portal</p>
        </div>

        {!isConnected ? (
          <div>
            {/* Available Roles Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Your Role & Connect</h3>
              <p className="text-center text-gray-600 mb-6">Choose your role and connect your MetaMask wallet to access your portal</p>
              
              {/* Primary Roles - Healthcare Providers */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Healthcare Providers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => handleConnectWithRole('Manufacturer')}
                    disabled={isConnectingWithRole}
                    className="p-6 rounded-xl border-2 border-opacity-20 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: THEME.PRIMARY, 
                      backgroundColor: selectedRole === 'Manufacturer' ? THEME.PRIMARY + '20' : THEME.PRIMARY + '10'
                    }}
                  >
                    <Factory className="w-10 h-10 mx-auto mb-3" style={{ color: THEME.PRIMARY }} />
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Drug Manufacturer</h4>
                    <p className="text-sm text-gray-600 mb-3">Create & mint pharmaceutical batches</p>
                    {isConnectingWithRole && selectedRole === 'Manufacturer' ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                        <span className="text-xs text-gray-600">Connecting...</span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">Click to connect</div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleConnectWithRole('Pharmacy')}
                    disabled={isConnectingWithRole}
                    className="p-6 rounded-xl border-2 border-opacity-20 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: THEME.SECONDARY, 
                      backgroundColor: selectedRole === 'Pharmacy' ? THEME.SECONDARY + '20' : THEME.SECONDARY + '10'
                    }}
                  >
                    <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: THEME.SECONDARY }} />
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Pharmacy</h4>
                    <p className="text-sm text-gray-600 mb-3">Verify & dispense medications</p>
                    {isConnectingWithRole && selectedRole === 'Pharmacy' ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                        <span className="text-xs text-gray-600">Connecting...</span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">Click to connect</div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleConnectWithRole('Doctor')}
                    disabled={isConnectingWithRole}
                    className="p-6 rounded-xl border-2 border-opacity-20 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: THEME.SUCCESS, 
                      backgroundColor: selectedRole === 'Doctor' ? THEME.SUCCESS + '20' : THEME.SUCCESS + '10'
                    }}
                  >
                    <User className="w-10 h-10 mx-auto mb-3" style={{ color: THEME.SUCCESS }} />
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Medical Doctor</h4>
                    <p className="text-sm text-gray-600 mb-3">Issue prescriptions & access records</p>
                    {isConnectingWithRole && selectedRole === 'Doctor' ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                        <span className="text-xs text-gray-600">Connecting...</span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">Click to connect</div>
                    )}
                  </button>
                </div>
              </div>

              {/* Secondary Roles - Patients & Insurers */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Patients & Insurers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => handleConnectWithRole('Patient')}
                    disabled={isConnectingWithRole}
                    className="p-6 rounded-xl border-2 border-opacity-20 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: THEME.WARNING, 
                      backgroundColor: selectedRole === 'Patient' ? THEME.WARNING + '20' : THEME.WARNING + '10'
                    }}
                  >
                    <Activity className="w-10 h-10 mx-auto mb-3" style={{ color: THEME.WARNING }} />
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Patient</h4>
                    <p className="text-sm text-gray-600 mb-3">Access medical history & records</p>
                    {isConnectingWithRole && selectedRole === 'Patient' ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                        <span className="text-xs text-gray-600">Connecting...</span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">Click to connect</div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleConnectWithRole('Insurer')}
                    disabled={isConnectingWithRole}
                    className="p-6 rounded-xl border-2 border-opacity-20 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: '#8B5CF6', 
                      backgroundColor: selectedRole === 'Insurer' ? '#8B5CF6' + '20' : '#8B5CF6' + '10'
                    }}
                  >
                    <BarChart3 className="w-10 h-10 mx-auto mb-3" style={{ color: '#8B5CF6' }} />
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Insurance Provider</h4>
                    <p className="text-sm text-gray-600 mb-3">Access patient data & analytics</p>
                    {isConnectingWithRole && selectedRole === 'Insurer' ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                        <span className="text-xs text-gray-600">Connecting...</span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">Click to connect</div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Alternative Connect Option */}
            <div className="text-center mb-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                     style={{ backgroundColor: THEME.PRIMARY + '20' }}>
                  <Wallet className="w-8 h-8" style={{ color: THEME.PRIMARY }} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Or Connect Without Selecting Role</h3>
                <p className="text-gray-600 mb-4">
                  Let the system auto-detect your role based on your wallet address
                </p>
              </div>
              
              <button
                onClick={handleConnect}
                disabled={isConnecting || isConnectingWithRole}
                className="w-full py-3 px-6 font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl transition-all duration-200 hover:border-gray-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                    Auto-detecting role...
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-2" />
                    Connect & Auto-Detect Role
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-4">
                <p className="mb-2"><strong>Recommended:</strong> Select your role above for the best experience.</p>
                <p><strong>MetaMask Required:</strong> Please install MetaMask extension for full functionality.</p>
              </div>
            </div>

            {/* Public Search Option */}
            <div className="pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Don't have a wallet? No problem!</p>
                <button
                  onClick={onPublicSearch}
                  className="w-full py-3 px-6 font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl transition-all duration-200 hover:border-gray-400 hover:shadow-md flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Public Product Verification
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Search and verify products without connecting a wallet
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Wallet Connected Successfully!</h3>
            <WalletRoleCard address={walletAddress} role={getUserRole(walletAddress) || 'Unknown'} />
          </div>
        )}
      </div>
    </div>
  );
};

// Legacy Role Selection Screen (kept for manual role selection if needed)
/*
const RoleSelectionScreen = ({ setRole }: { setRole: (role: string) => void }) => {
  const roles = [
    { name: 'Manufacturer', icon: Factory, color: THEME.PRIMARY, description: 'Mint new drug batches' },
    { name: 'Pharmacy', icon: Building2, color: THEME.SECONDARY, description: 'Verify & dispense drugs' },
    { name: 'Doctor', icon: User, color: THEME.SUCCESS, description: 'Issue prescriptions' },
    { name: 'Patient', icon: Activity, color: THEME.WARNING, description: 'View medical history' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 mr-3" style={{ color: THEME.PRIMARY }} />
            <h1 className="text-4xl font-bold" style={{ color: THEME.PRIMARY }}>OATH</h1>
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Pharmaceutical Supply Chain</p>
          <p className="text-gray-600">Select your role to access the secure blockchain portal</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <button
                key={role.name}
                onClick={() => setRole(role.name)}
                className="p-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl group border-2 border-transparent hover:border-opacity-20"
                style={{ 
                  backgroundColor: role.color + '10',
                  borderColor: role.color,
                  color: role.color
                }}
              >
                <IconComponent className="w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-lg font-bold mb-2">{role.name}</div>
                <div className="text-sm opacity-80">{role.description}</div>
              </button>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <Wallet className="w-6 h-6 mx-auto mb-2 text-gray-500" />
          <p className="text-sm text-gray-600">
            Connected Wallet: <span className="font-mono">0x742d...A9c8</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Simulated Web3 Connection</p>
        </div>
      </div>
    </div>
  );
};
*/

// Profile Component
const Profile = ({ role, profileData, onClose }: { role: string; profileData: any; onClose: () => void }) => {
  const [showKYC, setShowKYC] = useState(false);

  const renderProfileContent = () => {
    switch (role) {
      case 'Manufacturer':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Company Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Company Name:</span>
                    <p className="text-gray-800">{profileData.companyName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <p className="text-gray-800">{profileData.type}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Founded:</span>
                    <p className="text-gray-800">{profileData.founded}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">License:</span>
                    <p className="text-gray-800 font-mono">{profileData.license}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-800">{profileData.contact.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-800">{profileData.contact.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Address:</span>
                    <p className="text-gray-800">{profileData.contact.address}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Website:</span>
                    <p className="text-gray-800">{profileData.contact.website}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.certifications.map((cert: string, index: number) => (
                    <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.specializations.map((spec: string, index: number) => (
                    <span key={index} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: THEME.SECONDARY + '20', color: THEME.PRIMARY }}>
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Pharmacy':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Pharmacy Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Pharmacy Name:</span>
                    <p className="text-gray-800">{profileData.companyName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <p className="text-gray-800">{profileData.type}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Founded:</span>
                    <p className="text-gray-800">{profileData.founded}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">License:</span>
                    <p className="text-gray-800 font-mono">{profileData.license}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-800">{profileData.contact.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-800">{profileData.contact.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Address:</span>
                    <p className="text-gray-800">{profileData.contact.address}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Website:</span>
                    <p className="text-gray-800">{profileData.contact.website}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.certifications.map((cert: string, index: number) => (
                    <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.specializations.map((spec: string, index: number) => (
                    <span key={index} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: THEME.SECONDARY + '20', color: THEME.PRIMARY }}>
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Doctor':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Professional Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-gray-800">{profileData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Title:</span>
                    <p className="text-gray-800">{profileData.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Hospital:</span>
                    <p className="text-gray-800">{profileData.hospital}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">License:</span>
                    <p className="text-gray-800 font-mono">{profileData.license}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Experience:</span>
                    <p className="text-gray-800">{profileData.experience}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-800">{profileData.contact.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-800">{profileData.contact.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Address:</span>
                    <p className="text-gray-800">{profileData.contact.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.specializations.map((spec: string, index: number) => (
                  <span key={index} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: THEME.SECONDARY + '20', color: THEME.PRIMARY }}>
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Patient':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-gray-800">{profileData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Age:</span>
                    <p className="text-gray-800">{profileData.age} years</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Blood Type:</span>
                    <p className="text-gray-800">{profileData.bloodType}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Emergency Contact</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-gray-800">{profileData.emergencyContact.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Relationship:</span>
                    <p className="text-gray-800">{profileData.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-800">{profileData.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Medical Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Allergies:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profileData.allergies.map((allergy: string, index: number) => (
                        <span key={index} className="px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Medical History:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profileData.medicalHistory.map((condition: string, index: number) => (
                        <span key={index} className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.PRIMARY }}>Insurance Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Provider:</span>
                    <p className="text-gray-800">{profileData.insurance.provider}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Policy Number:</span>
                    <p className="text-gray-800 font-mono">{profileData.insurance.policyNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Profile not found</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <User className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <h2 className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>Profile</h2>
            </div>
            <div className="flex items-center space-x-3">
              {(role === 'Manufacturer' || role === 'Pharmacy' || role === 'Doctor') && (
                <button
                  onClick={() => setShowKYC(true)}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: THEME.SECONDARY, color: THEME.TEXT }}
                >
                  <Shield className="w-4 h-4 mr-2 inline" />
                  KYC Verification
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {renderProfileContent()}
        </div>
      </div>

      {showKYC && (
        <KYCVerification
          profileData={profileData}
          onClose={() => setShowKYC(false)}
        />
      )}
    </div>
  );
};

// Enhanced Header Component
const Header = ({ title, setRole, walletAddress, onDisconnect }: { title: string; setRole: (role: string | null) => void; walletAddress?: string; onDisconnect?: () => void }) => (
  <header className="shadow-lg sticky top-0 z-50" style={{ backgroundColor: THEME.PRIMARY }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="w-8 h-8 mr-3 text-white" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">OATH</h1>
            <p className="text-sm" style={{ color: THEME.SECONDARY }}>{title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {walletAddress && (
            <div className="hidden sm:flex items-center px-3 py-2 bg-black bg-opacity-20 rounded-full">
              <Wallet className="w-4 h-4 mr-2 text-white" />
              <span className="text-white text-sm font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          )}
          <button
            onClick={() => {
              // This will be handled by the parent component
              if (window.showProfile) {
                window.showProfile();
              }
            }}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: THEME.SECONDARY, color: THEME.TEXT }}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </button>
          <button
            onClick={() => {
              if (onDisconnect) {
                onDisconnect();
              }
              setRole(null);
            }}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: THEME.SECONDARY, color: THEME.TEXT }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </button>
        </div>
      </div>
    </div>
  </header>
);

// Manufacturer Portal Components
const ManufacturerPortal = ({ setRole, walletAddress, onDisconnect }: { setRole: (role: string | null) => void; walletAddress?: string; onDisconnect?: () => void }) => {
  const [formData, setFormData] = useState({
    batchId: '',
    medicineName: '',
    quantity: '',
    date: ''
  });
  const [lastHash, setLastHash] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Set up global profile handler
  React.useEffect(() => {
    window.showProfile = () => setShowProfile(true);
    return () => {
      delete window.showProfile;
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newHash = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
    setLastHash(newHash);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({ batchId: '', medicineName: '', quantity: '', date: '' });
  };

  const ComplianceScoreCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4" style={{ borderColor: THEME.SUCCESS }}>
      <div className="flex items-center mb-4">
        <Award className="w-6 h-6 mr-3" style={{ color: THEME.SUCCESS }} />
        <h3 className="text-xl font-semibold text-gray-800">Compliance Dashboard</h3>
      </div>
      
      <div className="space-y-6">
        {/* Traceability Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Traceability Score</span>
            <span className="text-3xl font-bold" style={{ color: THEME.SUCCESS }}>98%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-1000" 
              style={{ width: '98%', backgroundColor: THEME.SUCCESS }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>247</div>
            <div className="text-sm text-gray-600">Batches Minted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Recalls Pending</div>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2">
          Last Audit: August 15, 2024 • Next: November 15, 2024
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manufacturer Portal" setRole={setRole} walletAddress={walletAddress} onDisconnect={onDisconnect} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Minting Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <Factory className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>
                  Mint New Batch
                </h2>
                <p className="text-gray-600">Create blockchain proof for DSCSA compliance</p>
              </div>
            </div>

            <form onSubmit={handleMint} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch ID</label>
                  <input
                    type="text"
                    placeholder="e.g., BATCH-1234"
                    value={formData.batchId}
                    onChange={(e) => handleInputChange('batchId', e.target.value)}
                    className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                    style={{ 
                      borderColor: THEME.PRIMARY
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name/ENS</label>
                  <input
                    type="text"
                    placeholder="e.g., Ibuprofen 200mg"
                    value={formData.medicineName}
                    onChange={(e) => handleInputChange('medicineName', e.target.value)}
                    className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                    style={{ borderColor: THEME.PRIMARY }}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                    style={{ borderColor: THEME.PRIMARY }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturing Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                    style={{ borderColor: THEME.PRIMARY }}
                    required
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                    style={{ borderColor: THEME.PRIMARY }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                    style={{ borderColor: THEME.PRIMARY }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer Receipt (JSON File)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors duration-200">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <input 
                    type="file" 
                    accept=".json"
                    className="hidden" 
                    id="file-upload"
                    required 
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-lg font-medium text-gray-700">Click to upload</span>
                    <p className="text-sm text-gray-500 mt-1">JSON files only, max 10MB</p>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ backgroundColor: THEME.SECONDARY }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing Transaction...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5 mr-3" />
                    Mint Batch & Generate Hash
                  </>
                )}
              </button>
            </form>

            {lastHash && (
              <div className="mt-8 p-6 bg-green-50 rounded-xl border-l-4 border-green-500 animate-fade-in">
                <div className="flex items-center mb-2">
                  <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
                  <h4 className="font-bold text-green-800">Transaction Successful!</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-green-700">
                    <strong>On-Chain Hash:</strong> 
                    <span className="font-mono text-xs ml-2 bg-white px-2 py-1 rounded border break-all">
                      {lastHash}
                    </span>
                  </p>
                  <p className="text-xs text-green-600">✓ Proof of Ownership stored on OATH Ledger</p>
                </div>
              </div>
            )}
          </div>

          {/* Compliance Score */}
          <div className="lg:col-span-1">
            <ComplianceScoreCard />
          </div>
        </div>
      </div>

      {showProfile && (
        <Profile
          role="Manufacturer"
          profileData={PROFILE_DATA.Manufacturer}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

// Pharmacy Portal Components  
const PharmacyPortal = ({ setRole, walletAddress, onDisconnect }: { setRole: (role: string | null) => void; walletAddress?: string; onDisconnect?: () => void }) => {
  const [batchId, setBatchId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [dispenseData, setDispenseData] = useState({
    batchId: '',
    patientWallet: '',
    doctorEns: ''
  });
  const [showProfile, setShowProfile] = useState(false);

  // Set up global profile handler
  React.useEffect(() => {
    window.showProfile = () => setShowProfile(true);
    return () => {
      delete window.showProfile;
    };
  }, []);

  const handleVerify = async () => {
    if (!batchId.trim()) return;
    
    setIsVerifying(true);
    setVerificationResult(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const batch = DUMMY_DATA.batches.find(b => b.id === batchId);
    setVerificationResult(batch || { status: 'Not Found' });
    setIsVerifying(false);
  };

  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('✓ Custody transfer logged on OATH Ledger\n✓ Patient ENS notified\n✓ Transaction hash: 0x' + Math.random().toString(16).slice(2, 18));
    
    // Reset form
    setBatchId('');
    setVerificationResult(null);
    setDispenseData({ batchId: '', patientWallet: '', doctorEns: '' });
  };

  const VerificationStatus = () => {
    if (!verificationResult) return null;
    
    const isValid = verificationResult.status === 'Verified';
    const isCompromised = verificationResult.status === 'Compromised';
    
    let bgColor, textColor, icon, title, message;
    
    if (isValid) {
      bgColor = THEME.SUCCESS;
      textColor = 'white';
      icon = <CheckCircle className="w-16 h-16 mb-4" />;
      title = 'AUTHENTIC';
      message = 'Product verified against blockchain hash';
    } else if (isCompromised) {
      bgColor = THEME.CRITICAL;
      textColor = 'white';
      icon = <XCircle className="w-16 h-16 mb-4" />;
      title = 'COMPROMISED';
      message = 'WARNING: Potential counterfeit detected';
    } else {
      bgColor = THEME.WARNING;
      textColor = 'white';
      icon = <AlertTriangle className="w-16 h-16 mb-4" />;
      title = 'NOT FOUND';
      message = 'Batch ID not found in blockchain registry';
    }

    return (
      <div 
        className="mt-6 p-8 rounded-2xl text-center shadow-2xl transform transition-all duration-500 scale-100 hover:scale-105"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="flex flex-col items-center">
          {icon}
          <h3 className="text-3xl font-bold mb-2">{title}</h3>
          <p className="text-lg mb-4">{message}</p>
          {isValid && (
            <div className="bg-black bg-opacity-20 rounded-lg p-4 text-sm">
              <p><strong>Batch:</strong> {verificationResult.id}</p>
              <p><strong>Medicine:</strong> {verificationResult.name}</p>
              <p><strong>Manufacturer:</strong> {verificationResult.manufacturer}</p>
              <p><strong>Quantity:</strong> {verificationResult.quantity?.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Pharmacy Portal" setRole={setRole} walletAddress={walletAddress} onDisconnect={onDisconnect} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Drug Verification */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <Search className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>Drug Verification</h2>
                <p className="text-gray-600">Verify authenticity against blockchain</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch ID</label>
                <input
                  type="text"
                  placeholder="Scan QR code or enter Batch ID"
                  value={batchId}
                  onChange={(e) => {
                    setBatchId(e.target.value);
                    setVerificationResult(null);
                  }}
                  className="w-full p-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                  style={{ 
                    borderColor: THEME.SECONDARY
                  }}
                />
              </div>
              
              <button
                onClick={handleVerify}
                disabled={!batchId.trim() || isVerifying}
                className="w-full py-4 font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ backgroundColor: THEME.PRIMARY }}
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-3" />
                    Verify Authenticity
                  </>
                )}
              </button>
            </div>

            <VerificationStatus />
          </div>

          {/* Dispense Drug */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <Pill className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>Dispense Drug</h2>
                <p className="text-gray-600">Transfer custody to patient</p>
              </div>
            </div>

            <form onSubmit={handleDispense} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verified Batch ID</label>
                <input
                  type="text"
                  placeholder="Must be verified first"
                  value={dispenseData.batchId}
                  onChange={(e) => setDispenseData(prev => ({...prev, batchId: e.target.value}))}
                  className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                  style={{ borderColor: THEME.PRIMARY }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Wallet / ENS</label>
                <input
                  type="text"
                  placeholder="0x742d...A9c8 or patient.eth"
                  value={dispenseData.patientWallet}
                  onChange={(e) => setDispenseData(prev => ({...prev, patientWallet: e.target.value}))}
                  className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                  style={{ borderColor: THEME.PRIMARY }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prescribing Doctor ENS</label>
                <input
                  type="text"
                  placeholder="dr.smith.eth (for audit trail)"
                  value={dispenseData.doctorEns}
                  onChange={(e) => setDispenseData(prev => ({...prev, doctorEns: e.target.value}))}
                  className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                  style={{ borderColor: THEME.PRIMARY }}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center"
                style={{ backgroundColor: THEME.SECONDARY }}
              >
                <Package className="w-5 h-5 mr-3" />
                Finalize Transfer & Log Transaction
              </button>
            </form>
          </div>
        </div>
      </div>

      {showProfile && (
        <Profile
          role="Pharmacy"
          profileData={PROFILE_DATA.Pharmacy}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

// Doctor Portal Components
const DoctorPortal = ({ setRole, walletAddress, onDisconnect }: { setRole: (role: string | null) => void; walletAddress?: string; onDisconnect?: () => void }) => {
  const [prescriptionData, setPrescriptionData] = useState({
    patientWallet: '',
    medicineName: '',
    dosage: '',
    duration: ''
  });
  const [searchPatient, setSearchPatient] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Set up global profile handler
  React.useEffect(() => {
    window.showProfile = () => setShowProfile(true);
    return () => {
      delete window.showProfile;
    };
  }, []);

  const handleBiometricAuth = (patientData: any) => {
    setSelectedPatient(patientData);
    setShowBiometricAuth(false);
  };

  const handlePrescribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const hash = `0x${Math.random().toString(16).slice(2, 18)}`;
    alert(`✓ Prescription minted successfully!\n✓ Transaction Hash: ${hash}\n✓ Patient notified via ENS`);
    
    // Reset form
    setPrescriptionData({ patientWallet: '', medicineName: '', dosage: '', duration: '' });
  };

  const PatientHistoryCard = ({ item }: { item: any }) => {
    const getTypeColor = (type: string) => {
      if (type.includes('Prescription')) return THEME.PRIMARY;
      if (type.includes('Dispensed')) return THEME.SECONDARY;
      return THEME.SUCCESS;
    };

    const getTypeIcon = (type: string) => {
      if (type.includes('Prescription')) return <FileText className="w-5 h-5" />;
      if (type.includes('Dispensed')) return <Pill className="w-5 h-5" />;
      return <Activity className="w-5 h-5" />;
    };

    return (
      <div className="p-4 bg-gray-50 rounded-xl border-l-4 hover:shadow-md transition-all duration-200" 
           style={{ borderColor: getTypeColor(item.type) }}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className="mr-3" style={{ color: getTypeColor(item.type) }}>
              {getTypeIcon(item.type)}
            </div>
            <h4 className="font-semibold text-gray-800">{item.type}</h4>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {item.date}
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-2">{item.medication || item.notes}</p>
        {item.details && <p className="text-sm text-gray-600 mb-2">{item.details}</p>}
        
        <div className="flex flex-wrap gap-2 text-xs">
          {item.doctor && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              👨‍⚕️ {item.doctor}
            </span>
          )}
          {item.pharmacy && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              🏥 {item.pharmacy}
            </span>
          )}
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-mono">
            🔗 {item.hash.slice(0, 12)}...
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Doctor Portal" setRole={setRole} walletAddress={walletAddress} onDisconnect={onDisconnect} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Issue Prescription */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>Issue Prescription</h2>
                <p className="text-gray-600">Create blockchain-backed prescription</p>
              </div>
            </div>

            <form onSubmit={handlePrescribe} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Wallet / ENS</label>
                <input
                  type="text"
                  placeholder="0x742d...A9c8 or jane.eth"
                  value={prescriptionData.patientWallet}
                  onChange={(e) => setPrescriptionData(prev => ({...prev, patientWallet: e.target.value}))}
                  className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                  style={{ borderColor: THEME.PRIMARY }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                <input
                  type="text"
                  placeholder="e.g., Paracetamol 500mg"
                  value={prescriptionData.medicineName}
                  onChange={(e) => setPrescriptionData(prev => ({...prev, medicineName: e.target.value}))}
                  className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                  style={{ borderColor: THEME.PRIMARY }}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dosage & Frequency</label>
                  <input
                    type="text"
                    placeholder="500mg, twice daily"
                    value={prescriptionData.dosage}
                    onChange={(e) => setPrescriptionData(prev => ({...prev, dosage: e.target.value}))}
                    className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                    style={{ borderColor: THEME.PRIMARY }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    placeholder="7"
                    value={prescriptionData.duration}
                    onChange={(e) => setPrescriptionData(prev => ({...prev, duration: e.target.value}))}
                    className="w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                    style={{ borderColor: THEME.PRIMARY }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center"
                style={{ backgroundColor: THEME.SECONDARY }}
              >
                <Pill className="w-5 h-5 mr-3" />
                Mint Prescription Record
              </button>
            </form>
          </div>

          {/* Patient History */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <User className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>Patient History</h2>
                <p className="text-gray-600">View patient medical records</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search patient ENS (e.g., jane.eth)"
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  className="flex-1 p-4 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                  style={{ borderColor: THEME.PRIMARY }}
                />
                <button className="px-6 py-4 font-medium text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                        style={{ backgroundColor: THEME.PRIMARY }}>
                  <Search className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setShowBiometricAuth(true)}
                  className="px-6 py-3 font-medium text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center mx-auto"
                  style={{ backgroundColor: THEME.SUCCESS }}
                >
                  <Fingerprint className="w-5 h-5 mr-2" />
                  Biometric Patient Search
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Scan patient fingerprint to access medical records
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Records for jane.eth</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {DUMMY_DATA.patientHistory.length} records
                </span>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {DUMMY_DATA.patientHistory.map((item, index) => (
                  <PatientHistoryCard key={index} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProfile && (
        <Profile
          role="Doctor"
          profileData={PROFILE_DATA.Doctor}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showBiometricAuth && (
        <BiometricAuth
          onSuccess={handleBiometricAuth}
          onClose={() => setShowBiometricAuth(false)}
          mode="login"
        />
      )}

      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <User className="w-8 h-8 mr-3" style={{ color: THEME.SUCCESS }} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Patient Found: {selectedPatient.name}</h2>
                    <p className="text-gray-600">ID: {selectedPatient.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Age:</span>
                    <p className="text-gray-800">{selectedPatient.personalInfo.age} years</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Blood Type:</span>
                    <p className="text-gray-800">{selectedPatient.personalInfo.bloodType}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Allergies:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedPatient.personalInfo.allergies.map((allergy: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Medical History:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedPatient.personalInfo.medicalHistory.map((condition: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Recent Medical Records</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedPatient.medicalHistory.slice(0, 3).map((record: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800">{record.type}</h4>
                          <span className="text-xs text-gray-500">{record.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{record.medication || record.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Patient Portal Components
const PatientPortal = ({ setRole, walletAddress, onDisconnect }: { setRole: (role: string | null) => void; walletAddress?: string; onDisconnect?: () => void }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const [isBiometricRegistered, setIsBiometricRegistered] = useState(false);

  // Set up global profile handler
  React.useEffect(() => {
    window.showProfile = () => setShowProfile(true);
    return () => {
      delete window.showProfile;
    };
  }, []);

  const handleBiometricSuccess = (patientData: any) => {
    if (patientData.isNew) {
      setIsBiometricRegistered(true);
    }
    setShowBiometricAuth(false);
  };

  const TimelineItem = ({ item, isLast }: { item: any; isLast: boolean }) => {
    const getTypeColor = (type: string) => {
      if (type.includes('Prescription')) return THEME.PRIMARY;
      if (type.includes('Dispensed')) return THEME.SECONDARY;
      return THEME.SUCCESS;
    };

    return (
      <div className="flex pb-8">
        {/* Timeline Line */}
        <div className="flex flex-col items-center mr-6">
          <div 
            className="w-4 h-4 rounded-full border-4 border-white shadow-lg z-10"
            style={{ backgroundColor: getTypeColor(item.type) }}
          ></div>
          {!isLast && (
            <div 
              className="w-0.5 flex-grow mt-2"
              style={{ backgroundColor: THEME.SECONDARY + '40' }}
            ></div>
          )}
        </div>

        {/* Content Card */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-lg font-bold" style={{ color: getTypeColor(item.type) }}>
              {item.type}
            </h4>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {item.date}
              </p>
            </div>
          </div>

          <p className="text-gray-800 mb-3 font-medium">
            {item.medication || item.notes}
          </p>

          {item.details && (
            <p className="text-sm text-gray-600 mb-4">{item.details}</p>
          )}

          <div className="flex flex-wrap gap-2 text-xs mb-3">
            {item.doctor && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                👨‍⚕️ {item.doctor}
              </span>
            )}
            {item.pharmacy && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                🏥 {item.pharmacy}
              </span>
            )}
            {item.batch && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                📦 {item.batch}
              </span>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Blockchain Proof Hash:</p>
            <p className="font-mono text-xs text-green-700 break-all bg-white px-2 py-1 rounded border">
              {item.hash}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Patient Portal" setRole={setRole} walletAddress={walletAddress} onDisconnect={onDisconnect} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Biometric Authentication Panel */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <Fingerprint className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <div>
                <h2 className="text-xl font-bold" style={{ color: THEME.PRIMARY }}>Biometric Auth</h2>
                <p className="text-sm text-gray-600">Secure access</p>
              </div>
            </div>

            {!isBiometricRegistered ? (
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Fingerprint className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Register Fingerprint</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Register your fingerprint for secure access to your medical records
                </p>
                <button
                  onClick={() => setShowBiometricAuth(true)}
                  className="w-full py-2 px-4 font-medium text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: THEME.PRIMARY }}
                >
                  <Fingerprint className="w-4 h-4 mr-2 inline" />
                  Register Now
                </button>
              </div>
            ) : (
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Fingerprint Registered</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your biometric authentication is active
                </p>
                <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  ✓ Biometric security enabled
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Security Features</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-green-600" />
                  <span>Encrypted storage</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Blockchain verified</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-purple-600" />
                  <span>Privacy protected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Proofs Panel */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <div>
                <h2 className="text-xl font-bold" style={{ color: THEME.PRIMARY }}>Digital Proofs</h2>
                <p className="text-sm text-gray-600">Verified medications</p>
              </div>
            </div>

            <div className="space-y-4">
              {DUMMY_DATA.patientHistory
                .filter(item => item.medication)
                .map((item, index) => (
                  <div key={index} className="p-4 border-2 rounded-xl hover:shadow-md transition-all duration-200" 
                       style={{ borderColor: THEME.SECONDARY + '30' }}>
                    <div className="flex items-center mb-2">
                      <Pill className="w-5 h-5 mr-2" style={{ color: THEME.SECONDARY }} />
                      <span className="font-semibold text-gray-800 text-sm">{item.medication}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{item.date}</span>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                        ✓ VERIFIED
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-3">Health Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Records:</span>
                  <span className="font-bold">{DUMMY_DATA.patientHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medications:</span>
                  <span className="font-bold text-green-600">
                    {DUMMY_DATA.patientHistory.filter(i => i.medication).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-ins:</span>
                  <span className="font-bold text-blue-600">
                    {DUMMY_DATA.patientHistory.filter(i => i.type.includes('Check-in')).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Traceability Timeline */}
          <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-8">
              <Clock className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: THEME.PRIMARY }}>Medical Timeline</h2>
                <p className="text-gray-600">Complete traceability of your medical journey</p>
              </div>
            </div>

            <div className="relative">
              {DUMMY_DATA.patientHistory.map((item, index) => (
                <TimelineItem 
                  key={index} 
                  item={item} 
                  isLast={index === DUMMY_DATA.patientHistory.length - 1}
                />
              ))}
            </div>

            {/* Privacy Notice */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start">
                <Shield className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Privacy & Security</h4>
                  <p className="text-sm text-blue-700">
                    All medical data is encrypted and stored on the blockchain. Only you and authorized 
                    healthcare providers can access this information. Hash proofs ensure data integrity 
                    while maintaining your privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProfile && (
        <Profile
          role="Patient"
          profileData={PROFILE_DATA.Patient}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showBiometricAuth && (
        <BiometricAuth
          onSuccess={handleBiometricSuccess}
          onClose={() => setShowBiometricAuth(false)}
          mode="register"
        />
      )}
    </div>
  );
};

// Insurer Portal Components
const InsurerPortal = ({ setRole, walletAddress, onDisconnect }: { setRole: (role: string | null) => void; walletAddress?: string; onDisconnect?: () => void }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Set up global profile handler
  React.useEffect(() => {
    window.showProfile = () => setShowProfile(true);
    return () => {
      delete window.showProfile;
    };
  }, []);

  const handleBiometricAuth = (patientData: any) => {
    setSelectedPatient(patientData);
    setShowBiometricAuth(false);
  };

  const filteredPatients = DUMMY_DATA.biometricPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PatientCard = ({ patient }: { patient: any }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
         onClick={() => setSelectedPatient(patient)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{patient.name}</h3>
            <p className="text-sm text-gray-600">ID: {patient.id}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Age: {patient.personalInfo.age}</p>
          <p className="text-sm text-gray-500">Blood Type: {patient.personalInfo.bloodType}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Insurance:</span>
          <span className="font-medium">{patient.personalInfo.insurance.provider}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Policy:</span>
          <span className="font-mono text-xs">{patient.personalInfo.insurance.policyNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Records:</span>
          <span className="font-medium">{patient.medicalHistory.length} entries</span>
        </div>
      </div>
    </div>
  );

  const PatientDetailModal = ({ patient, onClose }: { patient: any; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <User className="w-8 h-8 mr-3" style={{ color: '#8B5CF6' }} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
                <p className="text-gray-600">Patient ID: {patient.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{patient.personalInfo.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-medium">{patient.personalInfo.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allergies:</span>
                    <div className="flex flex-wrap gap-1">
                      {patient.personalInfo.allergies.map((allergy: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Insurance Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{patient.personalInfo.insurance.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Policy Number:</span>
                    <span className="font-mono text-sm">{patient.personalInfo.insurance.policyNumber}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{patient.personalInfo.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Relationship:</span>
                    <span className="font-medium">{patient.personalInfo.emergencyContact.relationship}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{patient.personalInfo.emergencyContact.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical History</h3>
                <div className="space-y-3">
                  {patient.medicalHistory.map((record: any, index: number) => (
                    <div key={index} className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{record.type}</h4>
                        <span className="text-sm text-gray-500">{record.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{record.medication || record.notes}</p>
                      {record.details && <p className="text-sm text-gray-600">{record.details}</p>}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {record.doctor && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            👨‍⚕️ {record.doctor}
                          </span>
                        )}
                        {record.pharmacy && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            🏥 {record.pharmacy}
                          </span>
                        )}
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-mono">
                          🔗 {record.hash.slice(0, 12)}...
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Insurer Portal" setRole={setRole} walletAddress={walletAddress} onDisconnect={onDisconnect} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Patient Search & Biometric */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center mb-4">
                <Search className="w-6 h-6 mr-3" style={{ color: '#8B5CF6' }} />
                <h3 className="text-lg font-semibold text-gray-800">Search Patients</h3>
              </div>
              
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200 mb-4"
                style={{ borderColor: '#8B5CF6' }}
              />

              <button
                onClick={() => setShowBiometricAuth(true)}
                className="w-full py-3 px-4 font-medium text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                style={{ backgroundColor: '#8B5CF6' }}
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                Biometric Search
              </button>
            </div>

            {/* Analytics Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 mr-3" style={{ color: '#8B5CF6' }} />
                <h3 className="text-lg font-semibold text-gray-800">Analytics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{DUMMY_DATA.biometricPatients.length}</div>
                  <div className="text-sm text-gray-600">Total Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {DUMMY_DATA.biometricPatients.reduce((acc, p) => acc + p.medicalHistory.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Medical Records</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-600">Data Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient List */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Database className="w-8 h-8 mr-3" style={{ color: '#8B5CF6' }} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Patient Database</h2>
                    <p className="text-gray-600">Access comprehensive patient information</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredPatients.length} patients found
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredPatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProfile && (
        <Profile
          role="Insurer"
          profileData={PROFILE_DATA.Insurer}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showBiometricAuth && (
        <BiometricAuth
          onSuccess={handleBiometricAuth}
          onClose={() => setShowBiometricAuth(false)}
          mode="login"
        />
      )}

      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

// Public Search Component
const PublicSearch = () => {
  const [batchId, setBatchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!batchId.trim()) return;
    
    setIsSearching(true);
    setSearchResult(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const batch = DUMMY_DATA.batches.find(b => b.id === batchId);
    setSearchResult(batch || { status: 'Not Found' });
    setIsSearching(false);
  };

  const SearchResult = () => {
    if (!searchResult) return null;
    
    const isValid = searchResult.status === 'Verified';
    const isCompromised = searchResult.status === 'Compromised';
    
    let bgColor, textColor, icon, title, message, manufacturer;
    
    if (isValid) {
      bgColor = THEME.SUCCESS;
      textColor = 'white';
      icon = <CheckCircle className="w-16 h-16 mb-4" />;
      title = 'GENUINE';
      message = 'This product is verified and authentic';
      manufacturer = searchResult.manufacturer;
    } else if (isCompromised) {
      bgColor = THEME.CRITICAL;
      textColor = 'white';
      icon = <XCircle className="w-16 h-16 mb-4" />;
      title = 'NOT GENUINE';
      message = 'WARNING: This product may be counterfeit';
      manufacturer = 'Unknown/Unverified';
    } else {
      bgColor = THEME.WARNING;
      textColor = 'white';
      icon = <AlertTriangle className="w-16 h-16 mb-4" />;
      title = 'NOT FOUND';
      message = 'Batch ID not found in our database';
      manufacturer = 'N/A';
    }

    return (
      <div 
        className="mt-8 p-8 rounded-2xl text-center shadow-2xl transform transition-all duration-500 scale-100 hover:scale-105"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="flex flex-col items-center">
          {icon}
          <h3 className="text-4xl font-bold mb-2">{title}</h3>
          <p className="text-xl mb-6">{message}</p>
          
          <div className="bg-black bg-opacity-20 rounded-lg p-6 w-full max-w-md">
            <div className="grid grid-cols-1 gap-3 text-left">
              <div className="flex justify-between">
                <span className="font-semibold">Batch ID:</span>
                <span className="font-mono">{searchResult.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Product:</span>
                <span>{searchResult.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Manufacturer:</span>
                <span>{manufacturer}</span>
              </div>
              {isValid && (
                <>
                  <div className="flex justify-between">
                    <span className="font-semibold">Quantity:</span>
                    <span>{searchResult.quantity?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Manufacturing Date:</span>
                    <span>{searchResult.date || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Expiry Date:</span>
                    <span>{searchResult.expiry || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {isValid && (
            <div className="mt-4 text-sm opacity-90">
              <p>✓ Verified on OATH Blockchain</p>
              <p>✓ Manufacturer: {searchResult.manufacturer}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 mr-4" style={{ color: THEME.PRIMARY }} />
            <h1 className="text-5xl font-bold" style={{ color: THEME.PRIMARY }}>OATH</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Public Product Verification</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of pharmaceutical products by searching their batch number. 
            Get instant verification from our secure blockchain database.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8">
          <div className="text-center mb-8">
            <Search className="w-12 h-12 mx-auto mb-4" style={{ color: THEME.PRIMARY }} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Search Product Batch</h3>
            <p className="text-gray-600">Enter the batch number to verify authenticity</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter batch number (e.g., BATCH-4537)"
                value={batchId}
                onChange={(e) => {
                  setBatchId(e.target.value);
                  setSearchResult(null);
                }}
                className="flex-1 p-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-opacity-50 transition-all duration-200"
                style={{ 
                  borderColor: THEME.PRIMARY
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={!batchId.trim() || isSearching}
                className="px-8 py-4 font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                style={{ backgroundColor: THEME.PRIMARY }}
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-3" />
                    Verify
                  </>
                )}
              </button>
            </div>
          </div>

          <SearchResult />
        </div>

        {/* Sample Batch Numbers */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Try These Sample Batch Numbers</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border-2 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
                 style={{ borderColor: THEME.SUCCESS + '30' }}
                 onClick={() => setBatchId('BATCH-4537')}>
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-mono text-sm">BATCH-4537</p>
              <p className="text-xs text-gray-600">Genuine Product</p>
            </div>
            <div className="text-center p-4 border-2 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
                 style={{ borderColor: THEME.SUCCESS + '30' }}
                 onClick={() => setBatchId('BATCH-8890')}>
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-mono text-sm">BATCH-8890</p>
              <p className="text-xs text-gray-600">Genuine Product</p>
            </div>
            <div className="text-center p-4 border-2 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
                 style={{ borderColor: THEME.CRITICAL + '30' }}
                 onClick={() => setBatchId('BATCH-1122')}>
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="font-mono text-sm">BATCH-1122</p>
              <p className="text-xs text-gray-600">Counterfeit Test</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: THEME.PRIMARY }} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Blockchain Verified</h3>
            <p className="text-gray-600">All data is stored on a secure, immutable blockchain ledger</p>
          </div>
          <div className="text-center">
            <Search className="w-12 h-12 mx-auto mb-4" style={{ color: THEME.SECONDARY }} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Instant Results</h3>
            <p className="text-gray-600">Get immediate verification results in seconds</p>
          </div>
          <div className="text-center">
            <Factory className="w-12 h-12 mx-auto mb-4" style={{ color: THEME.SUCCESS }} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manufacturer Verified</h3>
            <p className="text-gray-600">Direct verification from authorized manufacturers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<string>('');
  const [showPublicSearch, setShowPublicSearch] = useState(false);
  const { disconnectWallet } = useWallet();

  // Check for existing session on component mount
  React.useEffect(() => {
    const savedRole = localStorage.getItem('oath-role');
    const savedWallet = localStorage.getItem('oath-wallet');
    
    if (savedRole && savedWallet) {
      setCurrentRole(savedRole);
      setConnectedWallet(savedWallet);
    }
  }, []);

  const handleWalletConnect = (address: string, role: string) => {
    setConnectedWallet(address);
    setCurrentRole(role);
    // Save to localStorage for session persistence
    localStorage.setItem('oath-role', role);
    localStorage.setItem('oath-wallet', address);
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setCurrentRole(null);
    setConnectedWallet('');
    // Clear localStorage
    localStorage.removeItem('oath-role');
    localStorage.removeItem('oath-wallet');
  };

  const CurrentPortal = useMemo(() => {
    if (showPublicSearch) {
      return () => (
        <div>
          <div className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 mr-3" style={{ color: THEME.PRIMARY }} />
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: THEME.PRIMARY }}>OATH</h1>
                    <p className="text-sm" style={{ color: THEME.SECONDARY }}>Public Product Verification</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPublicSearch(false)}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: THEME.SECONDARY, color: THEME.TEXT }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Back to Login
                </button>
              </div>
            </div>
          </div>
          <PublicSearch />
        </div>
      );
    }
    
    switch (currentRole) {
      case 'Manufacturer':
        return (props: any) => <ManufacturerPortal {...props} walletAddress={connectedWallet} onDisconnect={handleDisconnect} />;
      case 'Pharmacy':
        return (props: any) => <PharmacyPortal {...props} walletAddress={connectedWallet} onDisconnect={handleDisconnect} />;
      case 'Doctor':
        return (props: any) => <DoctorPortal {...props} walletAddress={connectedWallet} onDisconnect={handleDisconnect} />;
      case 'Patient':
        return (props: any) => <PatientPortal {...props} walletAddress={connectedWallet} onDisconnect={handleDisconnect} />;
      case 'Insurer':
        return (props: any) => <InsurerPortal {...props} walletAddress={connectedWallet} onDisconnect={handleDisconnect} />;
      default:
        return () => <WalletConnectionScreen onWalletConnect={handleWalletConnect} onPublicSearch={() => setShowPublicSearch(true)} />;
    }
  }, [currentRole, connectedWallet, showPublicSearch]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
          }
          
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .hover-scale:hover {
            transform: scale(1.02);
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${THEME.SECONDARY};
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${THEME.PRIMARY};
          }
        `}
      </style>
      
      <main>
        <CurrentPortal setRole={setCurrentRole} />
      </main>
    </div>
  );
};

export default App;