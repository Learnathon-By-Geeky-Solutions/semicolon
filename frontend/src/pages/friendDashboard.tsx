import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import { Toaster, toast } from 'react-hot-toast';
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation"; 
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
    addFriend(user?.email || " ",currentUser?.email||" ");
    toast.success(`You have added ${friend?.name} as a friend!`);
    //addFriend(friendName || "");  // Assuming addFriend is an action to add friend
    //alert(`You have added ${friendName} as a friend!`);
  };
 // Handle navigation to dashboard

return (
  <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
    {/* Main Content */}
    <div className="flex-1 p-8 bg-white shadow-inner">
    <PageLayout
        title="Friend Dashboard"
        navItems={mainNavItems}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-green-900">Welcome, {friendInfo.name}!</h1>
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
      </PageLayout>
    </div>

    {/* Toaster for notifications */}
    <Toaster />
  </div>
);
};

export default FriendDashboard;