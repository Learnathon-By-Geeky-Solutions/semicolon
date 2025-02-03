import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/authStore';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { user, users,getUser,setCurrentUser } = useAuthStore();  // Assuming 'users' contains the list of all users (friends)
  
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
       // navigate("/");
      } catch (error) {
        console.error('Login failed', error);
      }
      //setIsLoading(false);
    };
  // Handle click on a friend's name (navigate to their dashboard)
  const handleFriendClick = (friendName: string, friendid : string) => {
    navigate(`/friend/${friendid}`);  // Assuming this route takes you to the friend's dashboard
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <div className="bg-green-900 text-white w-64 p-6 flex flex-col h-screen shadow-md">
        <h2 className="text-3xl font-bold mb-6">CrisisCompass</h2>
        <ul className="flex flex-col flex-grow">
          <li>
            <button
              className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300 rounded"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </li>
          <li>
            <button className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300 rounded">
              Shelter Zones
            </button>
          </li>
          <li>
            <button className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300 rounded">
              Contact Authorities
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white shadow-inner">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-green-900"> Welcome, {user?.name || 'Guest'}!</h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for users"
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              onFocus={() => { adduser(); setShowSearchResults(true)}}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            {showSearchResults && (
              <div
                className="absolute top-12 left-0 w-64 bg-white shadow-md rounded-lg p-4 z-10 max-h-48 overflow-y-auto"
                onMouseLeave={() => setShowSearchResults(false)}
              >
                    <ul>
    {filteredUsers.length > 0 ? (
    filteredUsers.map((friend, index) => (
             <li
                key={index}
                 className="py-2 text-gray-700 hover:bg-green-100 cursor-pointer"
                  onClick={() =>{setCurrentUser(friend),handleFriendClick(friend.name, friend.email)}  }// Assuming friend has an `id` property
      >
                    {friend.name}  {/* Display the friend's name */}
                </li>
                ))
           ) : (
              <li className="py-2 text-gray-500">No results found</li>
                )}
          </ul>

              </div>
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

        {/* Footer Section */}
        <div className="mt-12 text-center text-gray-600">
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
    </div>
  );
};

export default UserDashboard;
