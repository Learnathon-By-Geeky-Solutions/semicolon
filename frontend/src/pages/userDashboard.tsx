import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";
import { FiSearch, FiUser, FiBell, FiUsers, FiMessageSquare } from 'react-icons/fi';
import LoadingSpinner from "../components/loadingSpinner";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, users, getUser, setCurrentUser } = useAuthStore();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      await getUser();
      console.log(users);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriendClick = (friendName: string, friendId: string) => {
    navigate(`/friend/${friendId}`);
  };

  const features = [
    {
      title: "Real-Time Alerts",
      description: "Stay updated with the latest emergency alerts in your area.",
      icon: <FiBell className="w-8 h-8" />,
      action: () => navigate('/alerts')
    },
    {
      title: "Monitor Loved Ones",
      description: "Check the real-time safety status of your family members.",
      icon: <FiUsers className="w-8 h-8" />,
      action: () => navigate('/family-status')
    },
    {
      title: "AI Assistant",
      description: "Get instant guidance and recommendations during crises.",
      icon: <FiMessageSquare className="w-8 h-8" />,
      action: () => navigate('/ai-assistant')
    }
  ];

  return (
    <PageLayout
      title="Dashboard"
      navItems={mainNavItems}
      headerRightContent={
        <div className="relative">
          <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Search for users"
              className="w-64 outline-none text-sm"
              onFocus={() => { handleSearch(); setShowSearchResults(true) }}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            <FiSearch className="w-5 h-5 text-gray-400" />
          </div>
          
          {showSearchResults && (
            <div 
              className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg p-2 z-50"
              onMouseLeave={() => setShowSearchResults(false)}
            >
              {isLoading ? (
                <div className="p-4"><LoadingSpinner /></div>
              ) : (
                <ul className="max-h-48 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((friend) => (
                      <li
                        key={friend.email}
                        className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-2"
                        onClick={() => { setCurrentUser(friend); handleFriendClick(friend.name, friend.email); }}
                      >
                        <FiUser className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{friend.name}</span>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-sm text-gray-500">No results found</li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      }
    >
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <FiUser className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 text-green-600">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <button
                onClick={feature.action}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default UserDashboard;
