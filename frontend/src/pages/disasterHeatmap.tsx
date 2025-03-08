import React from 'react';
import DisasterFilter from '../components/disaster/DisasterFilter';
import DisasterMap from '../components/disaster/DisasterMap';
import { useDisasterContext } from '../providers/DisasterContextProvider';
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback: React.FC = () => (
  <div>Error loading shelter map. Please try again.</div>
);


const DisasterHeatmap: React.FC = () => {
  const { loading } = useDisasterContext();

  return (
    <div className="disaster-heatmap" style={{ width: '100%', height: '100vh' }}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <DisasterFilter />
            
            {loading ? (
              <div className="loading-indicator" style={{ textAlign: 'center', padding: '20px' }}>
                Loading disaster data...
              </div>
            ) : (
              <DisasterMap />
            )}
        </ErrorBoundary>
    </div>
  );
};

export default DisasterHeatmap;