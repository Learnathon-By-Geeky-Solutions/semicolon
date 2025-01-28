import React from 'react';
import { Shelter } from '../../types/shelterMapTypes';

export const ResourcePopup: React.FC<{
    shelter: Shelter;
    isEditing: { [key: string]: boolean };
    onEdit: (field: string) => void;
    onSave: () => void;
    onClose: () => void;
    onDelete: () => void;
    onResourceChange: (field: string, value: number | string) => void;
  }> = ({ shelter, isEditing, onEdit, onSave, onClose, onDelete, onResourceChange }) => {
    
    const resources = {
      name: shelter.name,
      food: shelter.food,
      water: shelter.water,
      medicine: shelter.medicine
    };

    const handleInputChange = (field: string, value: string) => {
      if (field === 'name') {
        onResourceChange(field, value);
      } else {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        onResourceChange(field, numValue);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="flex items-center justify-between mb-4">
            {isEditing['name'] ? (
              <input
                type="text"
                value={shelter.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="border p-1 w-48 text-xl font-bold"
              />
            ) : (
              <h2 className="text-xl font-bold">{shelter.name}</h2>
            )}
            <button
              onClick={() => onEdit('name')}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ✏️
            </button>
          </div>
          <div className="space-y-4">
            {Object.entries(resources)
              .filter(([key]) => key !== 'name')
              .map(([key, value]) => (
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