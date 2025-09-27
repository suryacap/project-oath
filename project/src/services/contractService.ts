import { ethers } from 'ethers';
import { OATH_ABI, OATH_CONTRACT_ADDRESS, Batch, Prescription } from '../contracts/OathABI';

export class ContractService {
  private contract: ethers.Contract | null = null;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.contract = new ethers.Contract(OATH_CONTRACT_ADDRESS, OATH_ABI, this.provider);
    }
  }

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected. Please install MetaMask extension.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }
      
      const account = accounts[0];
      
      // Re-initialize provider and contract with the connected account
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await (this.provider as ethers.BrowserProvider).getSigner();
      this.contract = new ethers.Contract(OATH_CONTRACT_ADDRESS, OATH_ABI, this.signer);
      
      return account;
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      } else if (error.code === -32002) {
        throw new Error('Connection request already pending. Please check MetaMask.');
      } else {
        throw new Error(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async getAccount(): Promise<string | null> {
    if (!window.ethereum) return null;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts[0] || null;
    } catch (error) {
      return null;
    }
  }

  async getNetwork(): Promise<{ chainId: number; name: string }> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const network = await this.provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name
    };
  }

  async switchToSepolia(): Promise<void> {
    if (!window.ethereum) throw new Error('MetaMask not detected');
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia',
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
          }],
        });
      } else {
        throw error;
      }
    }
  }

  // Manufacturer functions
  async mintNewBatch(
    batchId: string,
    medicineName: string,
    quantity: number,
    manufacturingDate: number,
    expiryDate: number,
    price: number
  ): Promise<ethers.TransactionResponse> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.mintNewBatch(
      batchId,
      medicineName,
      quantity,
      manufacturingDate,
      expiryDate,
      price
    );
    
    return tx;
  }

  async getBatch(batchId: string): Promise<Batch> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const result = await this.contract.getBatch(batchId);
    return {
      batchId: result[0],
      medicineName: result[1],
      quantity: Number(result[2]),
      manufacturingDate: Number(result[3]),
      expiryDate: Number(result[4]),
      price: Number(result[5]),
      manufacturer: result[6],
      exists: true
    };
  }

  async getBatchDetails(batchId: string): Promise<Batch> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const result = await this.contract.getBatchDetails(batchId);
    return {
      batchId: result[0],
      medicineName: result[1],
      quantity: Number(result[2]),
      manufacturingDate: Number(result[3]),
      expiryDate: Number(result[4]),
      price: Number(result[5]),
      manufacturer: result[6],
      exists: result[7]
    };
  }

  async verifyDrug(batchId: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.verifyDrug(batchId);
  }

  async getTotalBatches(): Promise<number> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const result = await this.contract.getTotalBatches();
    return Number(result);
  }

  // Role checking functions
  async isManufacturer(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.manufacturers(address);
  }

  async isPharmacy(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.pharmacies(address);
  }

  async isDoctor(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.doctors(address);
  }

  // Admin functions
  async enrollManufacturer(manufacturerAddress: string): Promise<ethers.TransactionResponse> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.enrollManufacturer(manufacturerAddress);
  }

  async enrollPharmacy(pharmacyAddress: string): Promise<ethers.TransactionResponse> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.enrollPharmacy(pharmacyAddress);
  }

  async enrollDoctor(doctorAddress: string): Promise<ethers.TransactionResponse> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.enrollDoctor(doctorAddress);
  }

  // Pharmacy functions
  async dispenseDrug(
    batchId: string,
    prescriptionId: string,
    patient: string,
    doctor: string,
    quantity: number
  ): Promise<ethers.TransactionResponse> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.dispenseDrug(batchId, prescriptionId, patient, doctor, quantity);
  }

  // Doctor functions
  async prescribeMedicine(
    patient: string,
    medicineName: string,
    dosage: string,
    quantity: number
  ): Promise<{ prescriptionId: string; transactionHash: string }> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.prescribeMedicine(patient, medicineName, dosage, quantity);
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }
      
      // Extract prescription ID from transaction logs
      // The prescription ID is typically emitted in an event
      let prescriptionId = '';
      
      if (receipt.logs && receipt.logs.length > 0) {
        // Look for the PrescriptionCreated event
        for (const log of receipt.logs) {
          try {
            const parsed = this.contract?.interface.parseLog(log);
            if (parsed && parsed.name === 'PrescriptionCreated') {
              prescriptionId = parsed.args.prescriptionId || parsed.args[0];
              break;
            }
          } catch (e) {
            // Continue searching through logs
            continue;
          }
        }
      }
      
      // If no event found, generate a prescription ID based on transaction hash
      if (!prescriptionId) {
        prescriptionId = `PRESCRIPTION-${receipt.hash.slice(2, 10).toUpperCase()}`;
      }
      
      return {
        prescriptionId,
        transactionHash: receipt.hash
      };
    } catch (error: any) {
      throw new Error(`Failed to prescribe medicine: ${error.message}`);
    }
  }

  async getPrescription(prescriptionId: string): Promise<Prescription> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const result = await this.contract.getPrescription(prescriptionId);
    return {
      prescriptionId: result[0],
      patient: result[1],
      doctor: result[2],
      medicineName: result[3],
      dosage: result[4],
      quantity: Number(result[5]),
      timestamp: Number(result[6]),
      exists: true
    };
  }
}

// Create a singleton instance
export const contractService = new ContractService();
