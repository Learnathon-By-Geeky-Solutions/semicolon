import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import { Toaster, toast } from 'react-hot-toast';
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation"; 
const FriendDashboard: React.FC = () => {
   // Get the friendid from the URL params
  const navigate = useNavigate();
  const { currentUser, user, users, addFriend } = useAuthStore();
  const [isAlreadyFriend, setIsAlreadyFriend] = useState(false);
  const friendEmail = currentUser?.email;
  const friend = users.find((u) => u.email === friendEmail);

  useEffect(() => {
    const checkFriendshipStatus = async () => {
      try {
        const response = await axios.post(`${SERVER_URL}/api/v1/user/checkFriendship`, {
          userEmail: user?.email,
          friendEmail: friendEmail
        });
        setIsAlreadyFriend(response.data.isFriend);
      } catch (error) {
        console.error('Error checking friendship status:', error);
      }
    };

    if (user?.email && friendEmail) {
      checkFriendshipStatus();
    }
  }, [user?.email, friendEmail]);


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