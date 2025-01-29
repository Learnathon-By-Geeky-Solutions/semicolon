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
          className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-green-700 text-white 
          hover:bg-green-800 active:bg-green-900 transition-colors duration-200
          shadow-lg touch-manipulation"
        >
          <MdMenu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300 ease-in-out
        bg-green-900 text-white w-[280px] md:w-64 flex flex-col h-screen z-40
        overflow-y-auto overscroll-contain
      `}>
        <div className="p-6 pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">CrisisCompass</h2>
          {/* Close button - Only visible on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-green-800 active:bg-green-700 
            transition-colors duration-200 touch-manipulation"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-grow">
          <ul className="flex flex-col">
            <li>
              <button className="w-full text-left py-4 md:py-3 px-6 hover:bg-green-700 
              active:bg-green-800 transition duration-200 text-lg md:text-base
              touch-manipulation">
                Home
              </button>
            </li>
            <li>
              <button className="w-full text-left py-4 md:py-3 px-6 hover:bg-green-700 
              active:bg-green-800 transition duration-200 text-lg md:text-base
              touch-manipulation">
                Shelter Zones
              </button>
            </li>
            <li>
              <button className="w-full text-left py-4 md:py-3 px-6 hover:bg-green-700 
              active:bg-green-800 transition duration-200 text-lg md:text-base
              touch-manipulation">
                Resources
              </button>
            </li>
            <li>
              <button className="w-full text-left py-4 md:py-3 px-6 hover:bg-green-700 
              active:bg-green-800 transition duration-200 text-lg md:text-base
              touch-manipulation">
                Contact Authorities
              </button>
            </li>
          </ul>
        </nav>
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
