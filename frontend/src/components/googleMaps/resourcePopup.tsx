import React from 'react';
import { MdDelete, MdSave, MdClose, MdEdit, MdDirectionsCar, MdDirectionsWalk, MdStar, MdComment } from 'react-icons/md';
import { ResourcePopupProps } from "../../types/shelterMapTypes";
import { useAuthStore } from '../../store/authStore';


export const ResourcePopup: React.FC<ResourcePopupProps> = ({
  shelter,
  isEditing,
  onEdit,
  onSave,
  onClose,
  onDelete,
  onResourceChange,
  permission,
  onShowRoute,
  onReview,
  onShowReviews
}) => {
  const { user } = useAuthStore();
  const canReview = user?.role === 'user' || user?.role === 'admin';

  const resources = {
    food: shelter.food,
    water: shelter.water,
    medicine: shelter.medicine
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50
      animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4
        animate-[slideIn_0.3s_ease-out]">
        <div className="flex justify-between items-center mb-8 pb-3 border-b border-gray-100">
          <div className="flex-grow mr-2">
            {isEditing['name'] && permission === 'edit' ? (
              <input
                type="text"
                value={shelter.name}
                onChange={(e) => onResourceChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xl font-semibold 
                focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
              />
            ) : (
              <h2 className="text-2xl font-semibold text-gray-800">{shelter.name}</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {permission === 'edit' && (
              <button
                onClick={() => onEdit('name')}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
              >
                <MdEdit size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200"
            >
              <MdClose size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-5 mb-8">
          {Object.entries(resources).map(([key, value]) => (
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
                        onChange={(e) => onResourceChange(key, e.target.value)}
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

        {/* Combined Action Buttons and Route Options */}
        <div className="flex flex-wrap gap-3">
          {permission === 'edit' && (
            <>
              <button
                className="flex-1 py-2 px-3 bg-green-700 text-white rounded-lg hover:bg-green-600 
                transition-colors flex items-center justify-center gap-2"
                onClick={onSave}
              >
                <MdSave className="w-5 h-5" />
                Save
              </button>
              
              <button
                className="flex-1 py-2 px-3 bg-rose-700 text-white rounded-lg hover:bg-rose-600 
                transition-colors flex items-center justify-center gap-2"
                onClick={onDelete}
              >
                <MdDelete className="w-5 h-5" />
                Delete
              </button>
            </>
          )}
          
          <button
            className="flex-1 py-2 px-3 bg-teal-700 text-white rounded-lg hover:bg-teal-600 
            transition-colors flex items-center justify-center gap-2"
            onClick={() => onShowRoute(shelter, 'DRIVING')}
          >
            <MdDirectionsCar className="w-5 h-5" />
            Drive
          </button>
          
          <button
            className="flex-1 py-2 px-3 bg-teal-700 text-white rounded-lg hover:bg-teal-600 
            transition-colors flex items-center justify-center gap-2"
            onClick={() => onShowRoute(shelter, 'WALKING')}
          >
            <MdDirectionsWalk className="w-5 h-5" />
            Walk
          </button>

          {/* Review button - only show if user can review */}
          {canReview && (
            <button
              onClick={onReview}
              className="flex-1 py-2 px-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 
              transition-colors flex items-center justify-center gap-2"
            >
              <MdStar className="w-5 h-5" />
              Rate
            </button>
          )}

            <button
              className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              transition-colors flex items-center justify-center gap-2"
              onClick={onShowReviews}
            >
              <MdComment className="w-5 h-5" />
              Reviews
            </button>
          </div>
        </div>
      </div>
    );
  };