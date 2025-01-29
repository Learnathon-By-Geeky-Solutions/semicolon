import React from "react";
import ShelterMap from "../components/googleMaps/shelterMap";
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";
import { useAuthStore } from "../store/authStore";

const SheltersPage: React.FC = () => {
  const { user } = useAuthStore();
  const permission = user?.role === 'admin' ? 'edit' : 'view';

  return (
    <PageLayout
      title="Emergency Shelters"
      navItems={mainNavItems}
      rightContent={
        permission === 'edit' && (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg
              hover:bg-green-800 shadow-sm transition-all duration-200"
              onClick={() => {}}
            >
              <span>Add Shelter</span>
            </button>
          </div>
        )
      }
    >
      <ShelterMap permission={permission} />
    </PageLayout>
  );
};

export default SheltersPage;
