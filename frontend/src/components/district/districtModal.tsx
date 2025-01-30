import React from 'react';
import { IoMdAdd } from 'react-icons/io';
import { NewDistrict } from '../../types/districtTypes';
import ResourceInput from './resourceInput';

interface DistrictModalProps {
  isOpen: boolean;
  title: string;
  formData: NewDistrict;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
  onNumberInput: (field: 'total_food' | 'total_water' | 'total_medicine', value: string) => void;
  onNameChange: (value: string) => void;
  submitButtonText: string;
}

const DistrictModal: React.FC<DistrictModalProps> = ({
  isOpen,
  title,
  formData,
  onSubmit,
  onClose,
  onNumberInput,
  onNameChange,
  submitButtonText
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-green-700 px-6 py-4 text-white">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            {/* District Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District Name
              </label>
              <input
                type="text"
                value={formData.district_name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter district name"
                required
              />
            </div>

            {/* Resource Inputs */}
            <div className="grid grid-cols-3 gap-4">
              <ResourceInput
                label="Food"
                value={formData.total_food}
                onChange={(value) => onNumberInput('total_food', value)}
              />
              <ResourceInput
                label="Water"
                value={formData.total_water}
                onChange={(value) => onNumberInput('total_water', value)}
              />
              <ResourceInput
                label="Medicine"
                value={formData.total_medicine}
                onChange={(value) => onNumberInput('total_medicine', value)}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
              transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
              transition-colors duration-200 flex items-center gap-2"
            >
              <IoMdAdd className="text-xl" />
              <span>{submitButtonText}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DistrictModal;
