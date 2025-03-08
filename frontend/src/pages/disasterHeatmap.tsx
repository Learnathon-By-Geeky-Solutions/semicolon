import DisasterFilter from '../components/disaster/DisasterFilter';
import DisasterMap from '../components/disaster/DisasterMap';
import { useDisasterContext } from '../providers/DisasterContextProvider';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback: React.FC = () => (
  <div>Error loading disaster map. Please try again.</div>
);

const DisasterHeatmap = () => {
  const { loading } = useDisasterContext();
  
  return (
    <div className="disaster-heatmap" style={{ width: '100%', height: '100vh' }}>
      <DisasterFilter />
      
      {loading ? (
        <div className="loading-indicator" style={{ textAlign: 'center', padding: '20px' }}>
          Loading disaster data...
        </div>
      ) : (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <DisasterMap />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default DisasterHeatmap;