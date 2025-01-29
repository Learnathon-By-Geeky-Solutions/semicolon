import React, { useState } from 'react';
import { MdMenu } from 'react-icons/md';
import Header from './header';
import Sidebar from './sidebar';
import { NavItem } from '../../types/layoutTypes';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  navItems: NavItem[];
  headerRightContent?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title,
  navItems,
  headerRightContent 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
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

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={navItems}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={title}
          rightContent={headerRightContent}
        />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
