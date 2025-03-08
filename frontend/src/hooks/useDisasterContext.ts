import React, { createContext, useContext } from 'react';
import { Disaster } from '../types/disasterTypes';

interface DisasterContextType {
  disasters: Disaster[];
  filterType: string;
  availableTypes: string[];
  loading: boolean;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
}

export const DisasterContext = createContext<DisasterContextType>({
  disasters: [],
  filterType: 'all',
  availableTypes: [],
  loading: true,
  setFilterType: () => {},
});

export const useDisasterContext = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisasterContext must be used within a DisasterProvider');
  }
  return context;
};
