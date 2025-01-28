import React from "react";
import  ShelterMap  from "../components/googleMaps/shelterMap";

const Shelters: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="bg-green-900 text-white w-64 p-6 flex flex-col h-screen">
        <h2 className="text-2xl font-bold mb-6">CrisisCompass</h2>
        <ul className="flex flex-col flex-grow">
          <li>
            <button className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300">
              Home
            </button>
          </li>
          <li>
            <button className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300">
              Shelter Zones
            </button>
          </li>
          <li>
            <button className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300">
              Resources
            </button>
          </li>
          <li>
            <button className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300">
              Contact Authorities
            </button>
          </li>
        </ul>
      </div>
      
      <div className="flex-1 p-4">
        <ShelterMap />
      </div>
    </div>
  );
};

export default Shelters;
