import React from 'react';
import { Shelter } from '../../types/shelterMapTypes';

export const ResourcePopup: React.FC<{
    shelter: Shelter;
    isEditing: { [key: string]: boolean };
    onEdit: (field: string) => void;
    onSave: () => void;
    onClose: () => void;
    onDelete: () => void;
    onResourceChange: (field: string, value: number) => void;
  }> = ({ shelter, isEditing, onEdit, onSave, onClose, onDelete, onResourceChange }) => {
    
    const resources = {
      food: shelter.food,
      water: shelter.water,
      medicine: shelter.medicine
    };

    const handleInputChange = (field: string, value: string) => {
      const numValue = value === '' ? 0 : parseInt(value, 10);
      onResourceChange(field, numValue);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">{shelter.name}</h2>
          <div className="space-y-4">
            {Object.entries(resources).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-medium">{key}:</span>
                {isEditing[key] ? (
                  <input
                    type="number"
                    min="0"
                    value={value || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="border p-1 w-20"
                  />
                ) : (
                  <span>{value}</span>
                )}
                <button
                  onClick={() => onEdit(key)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ✏️
                </button>
              </div>
            ))}
          </div>
          {Object.values(isEditing).some(Boolean) && (
            <button
              onClick={onSave}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Save All Changes
            </button>
          )}
          <button
            onClick={onClose}
            className="mt-2 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
          <button
            onClick={onDelete}
            className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };