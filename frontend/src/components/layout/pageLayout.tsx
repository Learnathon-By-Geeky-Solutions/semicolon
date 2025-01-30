import React, { useState } from 'react';
import { MdMenu } from 'react-icons/md';
import Header from './header';
import Sidebar from './sidebar';
import { PageLayoutProps } from '../../types/layoutTypes';
import { useAuthStore } from '../../store/authStore';
import { filterNavItemsByRole } from '../../utils/navigation';

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title,
  navItems,
  headerRightContent 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  
  const filteredNavItems = filterNavItemsByRole(navItems, user?.role);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Hamburger Menu Button - Only visible on mobile when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-green-700 text-white 
          hover:bg-green-800 active:bg-green-900 transition-colors duration-200
          shadow-lg touch-manipulation"
          aria-label="Open menu"
        >
          <MdMenu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar - Combined for both mobile and desktop */}
      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:transform-none`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          navItems={filteredNavItems}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64">
        <Header 
          title={title}
          rightContent={headerRightContent}
        />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
