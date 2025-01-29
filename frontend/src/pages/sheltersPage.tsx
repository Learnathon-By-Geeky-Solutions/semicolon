import React from "react";
import ShelterMap from "../components/googleMaps/shelterMap";
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";
import { useAuthStore } from "../store/authStore";

const SheltersPage: React.FC = () => {
  const { user } = useAuthStore();
  const permission = user?.role === 'authority' ? 'edit' : 'view';

  return (
    <PageLayout
      title="Emergency Shelters"
      navItems={mainNavItems}
    >
      <ShelterMap permission={permission} />
    </PageLayout>
  );
};

export default SheltersPage;
