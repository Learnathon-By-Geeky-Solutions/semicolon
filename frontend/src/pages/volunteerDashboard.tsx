import React from "react";
import { useNavigate } from "react-router-dom";

const VolunteerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="bg-green-900 text-white w-64 p-6 flex flex-col h-screen">
        <h2 className="text-2xl font-bold mb-6">CrisisCompass</h2>
        <ul className="flex flex-col flex-grow">
          <li>
            <button className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300">
              Dashboard
            </button>
          </li>
          <li>
            <button className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300">
              View Shelter Zones
            </button>
          </li>
          <li>
            <button className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300">
              View Resources
            </button>
          </li>
          <li>
            <button
              className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300"
              onClick={() => navigate("/login")}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-green-900 mb-4">Welcome, Volunteer!</h1>
        <p className="text-lg text-gray-700 mb-8">
          Help by assisting in shelters and managing available resources during disasters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Shelter Zones</h3>
            <button className="w-full px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300">
              View Shelters
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Resources</h3>
            <button className="w-full px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300">
              View Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;