import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Disaster, DisasterContextType } from '../types/disasterTypes';
import { getDisasters } from '../helpers/disaster';

// Default context values
const defaultContextValue: DisasterContextType = {
  disasters: [],
  filterType: 'all',
};

// Create the context
export const DisasterContext = createContext<DisasterContextType & {
  availableTypes: string[];
  loading: boolean;
  setFilterType: (type: string) => void;
}>(
  {
    ...defaultContextValue,
    availableTypes: [],
    loading: false,
    setFilterType: () => {},
  }
);

// Custom hook for using this context
export const useDisasterContext = () => useContext(DisasterContext);

interface DisasterProviderProps {
  children: ReactNode;
}

export const DisasterProvider: React.FC<DisasterProviderProps> = ({ children }) => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch disasters when the component mounts or when the filter changes
  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        setLoading(true);
        const disastersData = await getDisasters(filterType);
        setDisasters(disastersData);

        // When viewing all disasters, compute available disaster types
        if (filterType === 'all') {
          const types = Array.from(new Set(disastersData.map((d: Disaster) => d.type)));
          setAvailableTypes(types as string[]);
        }
      } catch (error) {
        console.error('Error fetching disasters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();
  }, [filterType]);

  const value = {
    disasters,
    filterType,
    availableTypes,
    loading,
    setFilterType,
  };

  return (
    <DisasterContext.Provider value={value}>
      {children}
    </DisasterContext.Provider>
  );
};