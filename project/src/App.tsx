import React, { useState, useMemo } from 'react';
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
  Zap
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
  
  // Pharmacy wallets  
  '0x5b6f7a8c9d2e4f1b3a6d8c5f2e9b4a7d3c6f9e2': 'Pharmacy',
  '0xabcdef1234567890abcdef1234567890abcdef12': 'Pharmacy',
  
  // Doctor wallets
  '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0': 'Doctor',
  '0xfedcba0987654321fedcba0987654321fedcba09': 'Doctor',
  
  // Patient wallets
  '0x3c6f9e2b5a8d1c4f7e0b3a6d9c2f5e8b1a4d7c0': 'Patient',
  '0x0987654321fedcba0987654321fedcba09876543': 'Patient'
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
        // Simulate wallet connection for demo purposes
        const demoAddresses = Object.keys(WALLET_ROLES);
        const randomAddress = demoAddresses[Math.floor(Math.random() * demoAddresses.length)];
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate connection delay
        
        setWalletAddress(randomAddress);
        setIsConnected(true);
        return randomAddress;
      }
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        return accounts[0];
      }
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setError('');
  };

  const getUserRole = (address) => {
    return WALLET_ROLES[address] || null;
  };

  return {
    isConnected,
    walletAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    getUserRole
  };
};

// Role Selection Screen Component
const WalletConnectionScreen = ({ onWalletConnect }: { onWalletConnect: (address: string, role: string) => void }) => {
  const { isConnected, walletAddress, isConnecting, error, connectWallet, getUserRole } = useWallet();
  
  const handleConnect = async () => {
    const address = await connectWallet();
    if (address) {
      const role = getUserRole(address);
      if (role) {
        onWalletConnect(address, role);
      }
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
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 mr-3" style={{ color: THEME.PRIMARY }} />
            <h1 className="text-4xl font-bold" style={{ color: THEME.PRIMARY }}>OATH</h1>
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Pharmaceutical Supply Chain</p>
          <p className="text-gray-600">Connect your wallet to access the secure blockchain portal</p>
        </div>

        {!isConnected ? (
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: THEME.PRIMARY + '20' }}>
                <Wallet className="w-12 h-12" style={{ color: THEME.PRIMARY }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-6">
                Securely connect your MetaMask wallet to access your personalized dashboard
              </p>
            </div>
            
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full py-4 font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
              style={{ backgroundColor: THEME.PRIMARY }}
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Link className="w-5 h-5 mr-3" />
                  Connect with MetaMask
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-4">
              <p className="mb-2"><strong>Demo Mode:</strong> If MetaMask is not installed, a demo wallet will be connected automatically.</p>
              <p>Your role will be determined based on your wallet address.</p>
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

// Enhanced Header Component
const Header = ({ title, role, setRole, walletAddress }: { title: string; role: string; setRole: (role: string | null) => void; walletAddress?: string }) => (
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
            onClick={() => setRole(null)}
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
const ManufacturerPortal = ({ setRole, walletAddress }: { setRole: (role: string | null) => void; walletAddress?: string }) => {
  const [formData, setFormData] = useState({
    batchId: '',
    medicineName: '',
    quantity: '',
    date: ''
  });
  const [lastHash, setLastHash] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <Header title="Manufacturer Portal" role="Manufacturer" setRole={setRole} walletAddress={walletAddress} />
      
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
                      borderColor: THEME.PRIMARY, 
                      focusRingColor: THEME.PRIMARY + '50'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
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
    </div>
  );
};

// Pharmacy Portal Components  
const PharmacyPortal = ({ setRole, walletAddress }: { setRole: (role: string | null) => void; walletAddress?: string }) => {
  const [batchId, setBatchId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [dispenseData, setDispenseData] = useState({
    batchId: '',
    patientWallet: '',
    doctorEns: ''
  });

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
    const notFound = verificationResult.status === 'Not Found';
    
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
      <Header title="Pharmacy Portal" role="Pharmacy" setRole={setRole} walletAddress={walletAddress} />
      
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
                    borderColor: THEME.SECONDARY,
                    focusRingColor: THEME.SECONDARY + '50'
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
    </div>
  );
};

// Doctor Portal Components
const DoctorPortal = ({ setRole, walletAddress }: { setRole: (role: string | null) => void; walletAddress?: string }) => {
  const [prescriptionData, setPrescriptionData] = useState({
    patientWallet: '',
    medicineName: '',
    dosage: '',
    duration: ''
  });
  const [searchPatient, setSearchPatient] = useState('');

  const handlePrescribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const hash = `0x${Math.random().toString(16).slice(2, 18)}`;
    alert(`✓ Prescription minted successfully!\n✓ Transaction Hash: ${hash}\n✓ Patient notified via ENS`);
    
    // Reset form
    setPrescriptionData({ patientWallet: '', medicineName: '', dosage: '', duration: '' });
  };

  const PatientHistoryCard = ({ item, index }: { item: any, index: number }) => {
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
      <Header title="Doctor Portal" role="Doctor" setRole={setRole} walletAddress={walletAddress} />
      
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
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
              <div className="flex gap-2">
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
                  <PatientHistoryCard key={index} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Patient Portal Components
const PatientPortal = ({ setRole, walletAddress }: { setRole: (role: string | null) => void; walletAddress?: string }) => {
  const TimelineItem = ({ item, index, isLast }: { item: any; index: number; isLast: boolean }) => {
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
      <Header title="Patient Portal" role="Patient" setRole={setRole} walletAddress={walletAddress} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="grid lg:grid-cols-4 gap-8">
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
                  index={index} 
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
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<string>('');

  const handleWalletConnect = (address: string, role: string) => {
    setConnectedWallet(address);
    setCurrentRole(role);
  };

  const handleDisconnect = () => {
    setCurrentRole(null);
    setConnectedWallet('');
  };

  const CurrentPortal = useMemo(() => {
    switch (currentRole) {
      case 'Manufacturer':
        return (props: any) => <ManufacturerPortal {...props} walletAddress={connectedWallet} />;
      case 'Pharmacy':
        return (props: any) => <PharmacyPortal {...props} walletAddress={connectedWallet} />;
      case 'Doctor':
        return (props: any) => <DoctorPortal {...props} walletAddress={connectedWallet} />;
      case 'Patient':
        return (props: any) => <PatientPortal {...props} walletAddress={connectedWallet} />;
      default:
        return (props: any) => <WalletConnectionScreen onWalletConnect={handleWalletConnect} />;
    }
  }, [currentRole, connectedWallet]);

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
        <CurrentPortal setRole={handleDisconnect} />
      </main>
    </div>
  );
};

export default App;