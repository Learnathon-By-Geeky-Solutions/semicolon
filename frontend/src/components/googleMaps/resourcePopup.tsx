import React, { useEffect } from 'react';
import { Shelter } from '../../types/shelterMapTypes';
import { MdDelete, MdSave, MdClose } from 'react-icons/md';

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

    const getResourceIcon = (resourceType: string) => {
      switch(resourceType) {
        case 'food':
          return '🍽️';
        case 'water':
          return '💧';
        case 'medicine':
          return '💊';
        default:
          return '📝';
      }
    };

    const handleInputChange = (field: string, value: string) => {
      if (field === 'name') {
        onResourceChange(field, value);
      } else {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        onResourceChange(field, numValue);
      }
    };
    useEffect(() => {
      console.log(shelter);
    }, [shelter]);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="flex items-center justify-between mb-6 pb-2 border-b">
            <div className="flex-grow mr-2">
              {isEditing['name'] ? (
                <input
                  type="text"
                  value={shelter.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <h2 className="text-xl font-bold">{shelter.name}</h2>
              )}
            </div>
            <button
              onClick={() => onEdit('name')}
              className="ml-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 text-sm"
            >
              ✏️
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {Object.entries(resources)
              .filter(([key]) => key !== 'name')
              .map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                 
                  <div className="flex-grow">
                    <span className="font-medium capitalize">{key}</span>
                    <div className="flex items-center mt-1">
                      {isEditing[key] ? (
                        <input
                          type="number"
                          min="0"
                          value={value || ''}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-lg">{value}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onEdit(key)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm"
                  >
                    ✏️
                  </button>
                </div>
              ))}
          </div>

          <div className="flex space-x-2 justify-between">
            {Object.values(isEditing).some(Boolean) && (
              <button
                onClick={onSave}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                title="Save Changes"
              >
                <span className="text-xl">Save</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
              title="Close"
            >
              <span className="text-xl">Close</span>
            </button>
            <button
              onClick={onDelete}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              title="Delete Shelter"
            >
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  };