import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from '../store/authStore';

const FriendDashboard: React.FC = () => {
   // Get the friendid from the URL params
  const navigate = useNavigate();
  const { currentUser,user, users, addFriend } = useAuthStore();  // Assuming you have an addFriend action
  const friendemail  = currentUser?.email;
  // Find the friend from the users list by comparing ids
  const friend = users.find((u) => u.email === friendemail);  // Assuming each user has an `id` field
  
  if (friend) {
    console.log(friendemail);
    // You have found the friend, now you can navigate to their profile or display their info
    console.log(friend);  // You can replace this with actual navigation or display logic
  } else {
    // Handle case where the friend wasn't found
    console.log('Friend not found');
  }
  
  // Simulated friend info (replace with actual friend data)
  const friendInfo = {
    profilePic: "https://via.placeholder.com/150",
    name: friend?.name,
    email: friendemail,
    contact: "+1 234 567 890",
  };

  // Handle add friend action
  const handleAddFriend = async () => {
    console.log(friendemail);
    addFriend(user?.email || " ",currentUser?.email||" ");
    //addFriend(friendName || "");  // Assuming addFriend is an action to add friend
    //alert(`You have added ${friendName} as a friend!`);
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
          <li>
            <button
              className="w-full text-left py-2 px-4 hover:bg-green-700 transition duration-300 rounded"
              onClick={() => navigate(`/dashboard`)}  // Navigate to own dashboard
            >
              Dashboard
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white shadow-inner">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-green-900"> Welcome, {user?.name || 'Guest'}!</h1>
        </div>

        {/* Friend Info - Top Left */}
        <div className="flex items-center mb-15 space-x-10">
          <img
            src={friendInfo.profilePic}
            alt="Friend Profile"
            className="w-24 h-24 rounded-full"
          />
          <div className="text-left">
            <h2 className="text-2xl font-semibold text-green-900">{friendInfo.name}</h2>
            <p className="text-gray-600">{friendInfo.email}</p>
            <p className="text-gray-600">{friendInfo.contact}</p>
          </div>
        </div>

        {/* Add Friend Button */}
        <div className="mb-6">
          <button
            onClick={handleAddFriend}
            className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300"
          >
            Add Friend
          </button>
        </div>

        {/* Features Section */}
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

export default FriendDashboard;
