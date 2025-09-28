# OATH - Pharmaceutical Supply Chain Management System

A comprehensive blockchain-based pharmaceutical supply chain management system built with React, TypeScript, and Solidity. This system enables secure tracking of pharmaceutical products from manufacturing to patient dispensing, with role-based access control for different stakeholders in the healthcare ecosystem.

## 🏥 System Overview

OATH provides a decentralized platform for managing pharmaceutical supply chains with the following key features:

- **Blockchain-based Drug Tracking**: Secure and immutable record of drug batches
- **Role-based Access Control**: Different portals for Manufacturers, Pharmacies, Doctors, Patients, Insurers, Hospitals, and Labs
- **Prescription Management**: Digital prescription creation and tracking
- **Drug Verification**: Real-time verification of drug authenticity and expiry
- **Medical Records Management**: Comprehensive patient medical history tracking
- **Biometric Authentication**: Secure patient identification and access control

## 🎯 Key Features

### 🔐 Role-Based Portals

1. **Manufacturer Portal**
   - Batch creation and management
   - Drug manufacturing records
   - Supply chain analytics

2. **Pharmacy Portal**
   - Drug verification and dispensing
   - Prescription fulfillment
   - Inventory management

3. **Doctor Portal**
   - Patient search and records
   - Prescription creation
   - Medical history access

4. **Patient Portal**
   - Personal medical records
   - Prescription history
   - Biometric authentication setup

5. **Insurer Portal**
   - Claims processing
   - Coverage verification
   - Analytics dashboard

6. **Hospital Portal**
   - Patient report uploads
   - Medical record management
   - Patient association with ENS

7. **Lab Portal**
   - Test result uploads
   - Report generation
   - Patient data association

### 🛡️ Security Features

- **Blockchain Verification**: All transactions are recorded on the blockchain
- **ENS Integration**: Ethereum Name Service for patient identification
- **Biometric Authentication**: Fingerprint-based patient access
- **Role-based Permissions**: Secure access control for different user types
- **Audit Trail**: Complete transaction history and logging

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MetaMask** browser extension
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-oath
   ```

2. **Navigate to the project directory**
   ```bash
   cd project
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in the terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🏗️ Project Structure

```
project-oath/
├── project/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ManufacturerBatchMint.tsx
│   │   │   └── WalletConnection.tsx
│   │   ├── contracts/           # Smart contract ABI
│   │   │   └── OathABI.ts
│   │   ├── services/            # Service layer
│   │   │   └── contractService.ts
│   │   ├── App.tsx              # Main application component
│   │   ├── main.tsx             # Application entry point
│   │   └── index.css            # Global styles
│   ├── contracts/               # Solidity smart contracts
│   │   └── Oath.sol
│   ├── dist/                    # Built application
│   ├── package.json             # Dependencies and scripts
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── vite.config.ts           # Vite configuration
│   └── tsconfig.json            # TypeScript configuration
└── README.md                    # This file
```

## 🔧 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library

### Blockchain
- **Solidity** - Smart contract language
- **Ethers.js** - Ethereum interaction library
- **MetaMask** - Wallet integration

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📱 Usage Guide

### 1. Connect Your Wallet

1. Open the application in your browser
2. Click "Connect Wallet" to connect MetaMask
3. Select your role from the available options:
   - Manufacturer
   - Pharmacy
   - Doctor
   - Patient
   - Insurer
   - Hospital
   - Lab

### 2. Role-Specific Functions

#### For Manufacturers:
- Create new drug batches
- View manufacturing analytics
- Manage supply chain data

#### For Pharmacies:
- Verify drug authenticity
- Dispense medications
- Track inventory

#### For Doctors:
- Search patient records
- Create prescriptions
- Access medical history

#### For Patients:
- View personal medical records
- Set up biometric authentication
- Track prescription history

#### For Insurers:
- Process insurance claims
- Verify coverage
- View analytics dashboard

#### For Hospitals:
- Upload patient reports
- Associate records with patient ENS
- Manage medical data

#### For Labs:
- Upload test results
- Generate reports
- Associate data with patients

## 🔒 Smart Contract Details

The `Oath.sol` contract provides the following key functions:

### Core Functions
- `mintNewBatch()` - Create new drug batches
- `verifyDrug()` - Verify drug authenticity
- `dispenseDrug()` - Record drug dispensing
- `prescribeMedicine()` - Create prescriptions

### Access Control
- `enrollManufacturer()` - Register manufacturers
- `enrollPharmacy()` - Register pharmacies
- `enrollDoctor()` - Register doctors

### Data Retrieval
- `getBatch()` - Get batch details
- `getPrescription()` - Get prescription details
- `getDispensingHistory()` - Get dispensing records

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

### Code Style

The project uses ESLint for code linting and follows React best practices. Make sure to run `npm run lint` before committing changes.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_CONTRACT_ADDRESS=your_contract_address_here
VITE_RPC_URL=your_rpc_url_here
```

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Check if you're on the correct network
   - Refresh the page and try again

2. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors with `npm run typecheck`
   - Verify all imports are correct

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check if all required CSS classes are available

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify all dependencies are installed correctly
3. Ensure MetaMask is properly configured
4. Check the network connection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- Mobile app development
- Advanced analytics dashboard
- Integration with IoT devices
- Machine learning for fraud detection
- Multi-chain support
- Advanced biometric authentication

---

**Note**: This is a demonstration project. For production use, ensure proper security audits and testing are conducted.
