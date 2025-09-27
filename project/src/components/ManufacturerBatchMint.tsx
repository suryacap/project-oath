import React, { useState } from 'react';
import { Factory, Package, Calendar, DollarSign, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { contractService } from '../services/contractService';

interface BatchMintForm {
  batchId: string;
  medicineName: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  price: number;
}

interface ManufacturerBatchMintProps {
  onBatchMinted?: (batchId: string) => void;
}

const ManufacturerBatchMint: React.FC<ManufacturerBatchMintProps> = ({ onBatchMinted }) => {
  const [formData, setFormData] = useState<BatchMintForm>({
    batchId: '',
    medicineName: '',
    quantity: 0,
    manufacturingDate: '',
    expiryDate: '',
    price: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const generateBatchId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const batchId = `BATCH-${timestamp.toString().slice(-6)}-${random}`;
    setFormData(prev => ({ ...prev, batchId }));
  };

  const validateForm = (): string | null => {
    if (!formData.batchId.trim()) return 'Batch ID is required';
    if (!formData.medicineName.trim()) return 'Medicine name is required';
    if (formData.quantity <= 0) return 'Quantity must be greater than 0';
    if (!formData.manufacturingDate) return 'Manufacturing date is required';
    if (!formData.expiryDate) return 'Expiry date is required';
    if (formData.price <= 0) return 'Price must be greater than 0';
    
    const manufacturingDate = new Date(formData.manufacturingDate);
    const expiryDate = new Date(formData.expiryDate);
    
    if (expiryDate <= manufacturingDate) {
      return 'Expiry date must be after manufacturing date';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const manufacturingTimestamp = Math.floor(new Date(formData.manufacturingDate).getTime() / 1000);
      const expiryTimestamp = Math.floor(new Date(formData.expiryDate).getTime() / 1000);

      const tx = await contractService.mintNewBatch(
        formData.batchId,
        formData.medicineName,
        formData.quantity,
        manufacturingTimestamp,
        expiryTimestamp,
        formData.price
      );

      setTxHash(tx.hash);
      
      // Wait for transaction confirmation
      await tx.wait();
      
      setSuccess(true);
      onBatchMinted?.(formData.batchId);
      
      // Reset form after successful mint
      setFormData({
        batchId: '',
        medicineName: '',
        quantity: 0,
        manufacturingDate: '',
        expiryDate: '',
        price: 0
      });
      
    } catch (err: any) {
      console.error('Error minting batch:', err);
      setError(err.message || 'Failed to mint batch');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Factory className="w-8 h-8 mr-3 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Mint New Batch</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Batch ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="batchId"
              value={formData.batchId}
              onChange={handleInputChange}
              placeholder="Enter batch ID"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={generateBatchId}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Medicine Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medicine Name
          </label>
          <input
            type="text"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleInputChange}
            placeholder="e.g., Paracetamol 500mg"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Quantity and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="1000"
                min="1"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (in wei)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="1000000000000000000"
                min="1"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Manufacturing and Expiry Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturing Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="text-green-700 font-medium">Batch minted successfully!</p>
              {txHash && (
                <p className="text-green-600 text-sm mt-1">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Minting Batch...
            </>
          ) : (
            <>
              <Factory className="w-5 h-5 mr-2" />
              Mint Batch
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ManufacturerBatchMint;
