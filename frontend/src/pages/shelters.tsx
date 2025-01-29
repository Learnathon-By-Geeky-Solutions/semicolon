import React, { useState } from "react";
import ShelterMap from "../components/googleMaps/shelterMap";
import { MdMenu, MdClose } from "react-icons/md";

const Shelters: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
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
      <div className={`
        fixed md:static inset-y-0 left-0 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300 ease-in-out
        bg-green-900 text-white w-[260px] md:w-64 flex flex-col h-screen z-40
        overflow-y-auto overscroll-contain safe-top safe-bottom
      `}>
        <div className="sticky top-0 bg-green-900 p-4 flex justify-between items-center
          border-b border-green-800">
          <h2 className="text-xl font-bold">CrisisCompass</h2>
          {/* Close button - Only visible on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-green-800 active:bg-green-700 
            transition-colors duration-200 touch-manipulation -mr-1"
            aria-label="Close menu"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-grow">
          <ul className="flex flex-col py-2">
            <li className="px-2">
              <button className="w-full text-left py-3.5 px-4 rounded-lg hover:bg-green-800/50 
              active:bg-green-800 transition duration-200 text-[15px] font-medium
              touch-manipulation flex items-center">
                Home
              </button>
            </li>
            <li className="px-2">
              <button className="w-full text-left py-3.5 px-4 rounded-lg hover:bg-green-800/50 
              active:bg-green-800 transition duration-200 text-[15px] font-medium
              touch-manipulation flex items-center">
                Shelter Zones
              </button>
            </li>
            <li className="px-2">
              <button className="w-full text-left py-3.5 px-4 rounded-lg hover:bg-green-800/50 
              active:bg-green-800 transition duration-200 text-[15px] font-medium
              touch-manipulation flex items-center">
                Resources
              </button>
            </li>
            <li className="px-2">
              <button className="w-full text-left py-3.5 px-4 rounded-lg hover:bg-green-800/50 
              active:bg-green-800 transition duration-200 text-[15px] font-medium
              touch-manipulation flex items-center">
                Contact Authorities
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-green-800">
          <div className="text-sm text-green-100/70">
            Version 1.0.0
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1">
        <div className="h-full">
          <ShelterMap permission="edit" />
        </div>
      </div>
    </div>
  );
};

export default Shelters;
