import React, { useEffect } from 'react';
import { Shelter } from '../../types/shelterMapTypes';
import { MdDelete, MdSave, MdClose, MdEdit } from 'react-icons/md';

export const ResourcePopup: React.FC<{
    shelter: Shelter;
    isEditing: { [key: string]: boolean };
    onEdit: (field: string) => void;
    onSave: () => void;
    onClose: () => void;
    onDelete: () => void;
    onResourceChange: (field: string, value: number | string) => void;
    permission: 'view' | 'edit';
  }> = ({ shelter, isEditing, onEdit, onSave, onClose, onDelete, onResourceChange, permission }) => {
    
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
    useEffect(() => {
      console.log(shelter);
    }, [shelter]);
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-[28rem] max-w-[90vw] relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            title="Close"
          >
            <MdClose size={20} />
          </button>

          <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100 pr-12">
            <div className="flex-grow mr-2">
              {isEditing['name'] && permission === 'edit' ? (
                <input
                  type="text"
                  value={shelter.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-gray-800">{shelter.name}</h2>
              )}
            </div>
            {permission === 'edit' && (
              <button
                onClick={() => onEdit('name')}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
              >
                <MdEdit size={20} />
              </button>
            )}
          </div>

          <div className="space-y-5 mb-8">
            {Object.entries(resources)
              .filter(([key]) => key !== 'name')
              .map(([key, value]) => (
                <div key={key} className="group">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                    <div className="flex-grow">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{key}</span>
                      <div className="mt-1">
                        {isEditing[key] && permission === 'edit' ? (
                          <input
                            type="number"
                            min="0"
                            value={value || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                          />
                        ) : (
                          <span className="text-lg font-medium text-gray-700">{value}</span>
                        )}
                      </div>
                    </div>
                    {permission === 'edit' && (
                      <button
                        onClick={() => onEdit(key)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <MdEdit size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex space-x-3 justify-between">
            {permission === 'edit' && (
              <>
                {Object.values(isEditing).some(Boolean) && (
                  <button
                    onClick={onSave}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow"
                    title="Save Changes"
                  >
                    <MdSave size={20} />
                    <span className="font-medium">Save</span>
                  </button>
                )}
                <button
                  onClick={onDelete}
                  className="flex-1 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  title="Delete Shelter"
                >
                  <MdDelete size={20} />
                  <span className="font-medium">Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };