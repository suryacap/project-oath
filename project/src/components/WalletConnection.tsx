import React, { useState, useEffect } from 'react';
import { Wallet, LogOut, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { contractService } from '../services/contractService';

interface WalletConnectionProps {
  onWalletConnected: (address: string, role: string) => void;
  onWalletDisconnected: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ 
  onWalletConnected, 
  onWalletDisconnected 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [network, setNetwork] = useState<{ chainId: number; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const account = await contractService.getAccount();
      if (account) {
        setConnectedAddress(account);
        await checkUserRole(account);
        await checkNetwork();
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const checkUserRole = async (address: string) => {
    try {
      const [isManufacturer, isPharmacy, isDoctor] = await Promise.all([
        contractService.isManufacturer(address),
        contractService.isPharmacy(address),
        contractService.isDoctor(address)
      ]);

      if (isManufacturer) {
        setUserRole('Manufacturer');
      } else if (isPharmacy) {
        setUserRole('Pharmacy');
      } else if (isDoctor) {
        setUserRole('Doctor');
      } else {
        setUserRole('Patient');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      setUserRole('Unknown');
    }
  };

  const checkNetwork = async () => {
    try {
      const networkInfo = await contractService.getNetwork();
      setNetwork(networkInfo);
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if we're on Sepolia
      const networkInfo = await contractService.getNetwork();
      if (networkInfo.chainId !== 11155111) { // Sepolia chain ID
        await contractService.switchToSepolia();
      }

      const address = await contractService.connectWallet();
      setConnectedAddress(address);
      await checkUserRole(address);
      await checkNetwork();
      
      onWalletConnected(address, userRole || 'Unknown');
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedAddress(null);
    setUserRole(null);
    setNetwork(null);
    setError(null);
    onWalletDisconnected();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Manufacturer': return 'text-blue-600';
      case 'Pharmacy': return 'text-green-600';
      case 'Doctor': return 'text-purple-600';
      case 'Patient': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Manufacturer': return '🏭';
      case 'Pharmacy': return '🏥';
      case 'Doctor': return '👨‍⚕️';
      case 'Patient': return '👤';
      default: return '❓';
    }
  };

  if (connectedAddress) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Wallet className="w-6 h-6 text-green-600 mr-2" />
            <span className="font-medium text-gray-800">Wallet Connected</span>
          </div>
          <button
            onClick={disconnectWallet}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
              {formatAddress(connectedAddress)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Role</p>
            <div className="flex items-center">
              <span className="text-lg mr-2">{getRoleIcon(userRole || 'Unknown')}</span>
              <span className={`font-medium ${getRoleColor(userRole || 'Unknown')}`}>
                {userRole || 'Unknown'}
              </span>
            </div>
          </div>

          {network && (
            <div>
              <p className="text-sm text-gray-600">Network</p>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-800">{network.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600 mb-6">
          Connect your wallet to access the pharmaceutical supply chain system
        </p>

        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          {isConnecting ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Make sure you're connected to Sepolia testnet
        </p>
      </div>
    </div>
  );
};

export default WalletConnection;
