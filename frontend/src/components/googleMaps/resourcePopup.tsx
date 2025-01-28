import React, { useState } from 'react';

interface Resource {
    food: number;
    water: number;
    medicine: number;
  }


  interface Location {
    name: string;
    lat: number;
    lng: number;
  }
  

export const ResourcePopup: React.FC<{
    shelter: Location;
    resources: Resource;
    isEditing: { [key: string]: boolean };
    onEdit: (field: string) => void;
    onSave: (field: string, value: number) => void;
    onClose: () => void;
    onDelete: () => void;
  }> = ({ shelter, resources, isEditing, onEdit, onSave, onClose, onDelete }) => {
    const [localResources, setLocalResources] = useState(resources);
  
    const handleSave = (field: string) => {
      onSave(field, localResources[field as keyof Resource]);
      onEdit(field);
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
                    value={localResources[key as keyof Resource]}
                    onChange={(e) =>
                      setLocalResources((prev) => ({
                        ...prev,
                        [key]: parseInt(e.target.value, 10),
                      }))
                    }
                    className="border p-1 w-20"
                  />
                ) : (
                  <span>{value}</span>
                )}
                <button
                  onClick={() => (isEditing[key] ? handleSave(key) : onEdit(key))}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {isEditing[key] ? '💾' : '✏️'}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
          <button
            onClick={onDelete}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };