import React, { useEffect } from 'react';
import { MdDelete, MdSave, MdClose, MdEdit, MdDirectionsCar, MdDirectionsWalk } from 'react-icons/md';
import { ResourcePopupProps } from "../../types/shelterMapTypes";


export const ResourcePopup: React.FC<ResourcePopupProps> = ({
  shelter,
  isEditing,
  onEdit,
  onSave,
  onClose,
  onDelete,
  onResourceChange,
  permission,
  onShowRoute
}) => {
    
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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{shelter.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

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

          {/* Route Options */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Get Directions</h4>
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
                transition-colors flex items-center justify-center gap-2"
                onClick={() => onShowRoute(shelter, "DRIVING")}
              >
                <MdDirectionsCar className="w-5 h-5" />
                Drive
              </button>
              <button
                className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
                transition-colors flex items-center justify-center gap-2"
                onClick={() => onShowRoute(shelter, 'WALKING')}
              >
                <MdDirectionsWalk className="w-5 h-5" />
                Walk
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {permission === 'edit' && (
              <>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                  transition-colors flex items-center gap-2"
                  onClick={onSave}
                >
                  <MdSave className="w-5 h-5" />
                  Save
                </button>
                
                <button
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 
                  transition-colors flex items-center gap-2"
                  onClick={onDelete}
                >
                  <MdDelete className="w-5 h-5" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };