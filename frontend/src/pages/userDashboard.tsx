import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { user, users, getUser, setCurrentUser } = useAuthStore(); // Assuming 'users' contains the list of all users (friends)

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulated user info (replace with actual user data)
  const userInfo = {
    profilePic: "https://via.placeholder.com/150",
    name: user?.name,
    email: user?.email,
    contact: "+1 234 567 890",
  };

  const adduser = async () => {
    try {
      await getUser();
      console.log(users);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  // Handle click on a friend's name (navigate to their dashboard)
  const handleFriendClick = (friendName: string, friendid: string) => {
    navigate(`/friend/${friendid}`); // Assuming this route takes you to the friend's dashboard
  };

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
              aria-label="Search users"
              role="searchbox"
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
                <ul role="listbox" className="max-h-48 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((friend) => (
                      <li
                        key={friend.email}
                        role="option"
                        tabIndex={0}
                        className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-2"
                        onClick={() => { setCurrentUser(friend); handleFriendClick(friend.name, friend.email); }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setCurrentUser(friend);
                            handleFriendClick(friend.name, friend.email);
                          }
                        }}
                      >
                        <FiUser className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        <span className="text-sm text-gray-700">{friend.name}</span>
                      </li>
                    ))
                  ) : (
                    <li role="alert" className="px-3 py-2 text-sm text-gray-500">No results found</li>
                  )}
                </ul>

              )}
            </div>
          </div>

          {/* User Info - Top Left */}
          <div className="flex items-center mb-15 space-x-10">
            <img
              src={userInfo.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-green-900">{userInfo.name}</h2>
              <p className="text-gray-600">{userInfo.email}</p>
              <p className="text-gray-600">{userInfo.contact}</p>
            </div>
          </div>

          {/* Features Section - Moved to Bottom Center */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center mt-12">
            {/* View Alerts */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Real-Time Alerts</h3>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest emergency alerts in your area.
              </p>
              <button className="w-full px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300">
                View Alerts
              </button>
            </div>

            {/* Monitor Loved Ones */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Monitor Loved Ones</h3>
              <p className="text-gray-600 mb-4">
                Check the real-time safety status of your family members.
              </p>
              <button className="w-full px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300">
                View Family Status
              </button>
            </div>

            {/* AI Assistant */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">AI Assistant</h3>
              <p className="text-gray-600 mb-4">
                Get instant guidance and recommendations during crises.
              </p>
              <button className="w-full px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300">
                Ask AI Assistant
              </button>
            </div>
          </div>
        </div>
      </PageLayout>

      {/* Footer Section */}
      <div className="mt-12 text-center text-gray-600 bg-gray-200 py-4">
        <p className="text-xl font-semibold">Stay Safe, Download Our App</p>
        <div className="flex justify-center mt-4 gap-4">
          <button className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 transition duration-300 shadow">
            App Store
          </button>
          <button className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 transition duration-300 shadow">
            Google Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
