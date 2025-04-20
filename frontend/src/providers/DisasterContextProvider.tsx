import React, { useState, useEffect, ReactNode } from 'react';
import { getDisasters } from '../helpers/disaster';
import { Disaster } from '../types/disasterTypes';
import { DisasterContext } from '../hooks/useDisasterContext';

interface DisasterProviderProps {
  children: ReactNode;
}

export const DisasterProvider: React.FC<DisasterProviderProps> = ({ children }) => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchDisasters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const disastersData = await getDisasters(filterType);
        
        if (isMounted) {
          setDisasters(disastersData || []);

          if (filterType === 'all') {
            const types = Array.from(new Set(disastersData?.map(d => d.type) || []));
            setAvailableTypes(types);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load disaster data. Please try again.');
          console.error('Error fetching disasters:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDisasters();
    
    return () => {
      isMounted = false;
    };
  }, [filterType]);

  const contextValue = React.useMemo(() => ({
    disasters,
    filterType,
    availableTypes,
    loading,
    setFilterType,
  }), [disasters, filterType, availableTypes, loading]);

  return (
    <DisasterContext.Provider value={contextValue}>
      {error ? <div className="error-message">{error}</div> : children}
    </DisasterContext.Provider>
  );
};
