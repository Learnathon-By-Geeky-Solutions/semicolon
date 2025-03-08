import React, { createContext, useContext, useState, useEffect, ReactNode  } from 'react';
import { getDisasters } from '../helpers/disaster';
import { Disaster } from '../types/disasterTypes';

// Create context with default values
const DisasterContext = createContext<{
  disasters: Disaster[];
  filterType: string;
  availableTypes: string[];
  loading: boolean;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
}>({
  disasters: [],
  filterType: 'all',
  availableTypes: [],
  loading: true,
  setFilterType: () => {},
});

// Custom hook for using this context
export const useDisasterContext = () => useContext(DisasterContext);

interface DisasterProviderProps {
  children: ReactNode;
}

export const DisasterProvider = ({ children }: DisasterProviderProps) => {
  const [disasters, setDisasters] = useState([] as Disaster[]);
  const [filterType, setFilterType] = useState('all');
  const [availableTypes, setAvailableTypes] = useState([] as string[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

  

  // Fetch disasters when the component mounts or when the filter changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchDisasters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const disastersData = await getDisasters(filterType);
        setDisasters(disastersData || []);
        console.log(disastersData, disasters);
        
        // Only update state if component is still mounted
        if (isMounted) {
          // When viewing all disasters, compute available disaster types
          if (filterType === 'all') {
            const types = Array.from(new Set(disastersData?.map(d => d.type) || []));
            setAvailableTypes(types);
          }
        }
      } catch (error) {
        console.error('Error fetching disasters:', error);
        if (isMounted) {
          setError('Failed to load disaster data. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDisasters();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [filterType]);

  // Create the context value object
  const contextValue = {
    disasters,
    filterType,
    availableTypes,
    loading,
    setFilterType,
  };

  return (
    <DisasterContext.Provider value={contextValue}>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        children
      )}
    </DisasterContext.Provider>
  );
};

export default DisasterContext;