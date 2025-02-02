import React from 'react';

interface ResourceInputProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
}

const ResourceInput: React.FC<ResourceInputProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
        focus:ring-green-500 focus:border-transparent transition-all"
        min="0"
        placeholder="0"
      />
    </div>
  );
};

export default ResourceInput;
