import DisasterFilter from '../components/disaster/DisasterFilter';
import DisasterMap from '../components/disaster/DisasterMap';
import { useDisasterContext } from '../providers/DisasterContextProvider';
import { ErrorBoundary } from 'react-error-boundary';
import PageLayout from '../components/layout/pageLayout';
import { mainNavItems } from '../config/navigation';

const ErrorFallback: React.FC = () => (
  <div>Error loading disaster map. Please try again.</div>
);

const DisasterHeatmap = () => {
  const { loading } = useDisasterContext();
  
  return (
    <PageLayout
      title="Disaster Heatmap"
      navItems={mainNavItems}
    >
    <div className="disaster-heatmap">
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
    </PageLayout>
  );
};

export default DisasterHeatmap;