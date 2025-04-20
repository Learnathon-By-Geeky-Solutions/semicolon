import { createContext, useContext } from 'react';
import { DisasterContextType } from '../types/disasterTypes';


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
