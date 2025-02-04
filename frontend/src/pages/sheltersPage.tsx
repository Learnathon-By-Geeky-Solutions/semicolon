import React from "react";
import ShelterMap from "../components/googleMaps/shelterMap";
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";
import { useAuthStore } from "../store/authStore";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback: React.FC = () => (
  <div>Error loading shelter map. Please try again.</div>
);

const SheltersPage: React.FC = () => {
  const { user } = useAuthStore();
  const permission = user?.role === 'authority' ? 'edit' : 'view';

  return (
    <PageLayout
      title="Emergency Shelters"
      navItems={mainNavItems}
    >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ShelterMap permission={permission} />
        </ErrorBoundary>
    </PageLayout>
  );
};

export default SheltersPage;
