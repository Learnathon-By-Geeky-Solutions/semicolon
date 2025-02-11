import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import { Toaster, toast } from 'react-hot-toast';
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";
import { FiUser, FiUserPlus, FiMail, FiPhone, FiUserCheck } from 'react-icons/fi';
import axios from 'axios';
import { SERVER_URL } from '../constants/paths';

const FriendDashboard: React.FC = () => {
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
        toast.error('Unable to verify friendship status. Please try again later.');
      }
    };

    if (user?.email && friendEmail) {
      checkFriendshipStatus();
    }
  }, [user?.email, friendEmail]);

  const handleAddFriend = async () => {
    if (isAlreadyFriend) return;
    
    try {
      await addFriend(user?.email || " ", currentUser?.email || " ");
      toast.success(`You have added ${friend?.name} as a friend!`);
      setIsAlreadyFriend(true);
    } catch (error) {
      toast.error("Failed to add friend. Please try again.");
    }
  };

  return (
    <PageLayout
      title="Friend Profile"
      navItems={mainNavItems}
      headerRightContent={
        <button
          type="button"
          onClick={handleAddFriend}
          disabled={isAlreadyFriend}
          aria-label={isAlreadyFriend ? "Already friends" : "Add friend"}
          className={`inline-flex items-center px-4 py-2 rounded-lg
          transition-all duration-200 shadow-sm hover:shadow
          font-medium text-sm gap-2
          ${isAlreadyFriend 
            ? 'bg-gray-100 text-gray-600 cursor-default' 
            : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          {isAlreadyFriend ? (
            <>
              <FiUserCheck className="w-5 h-5" aria-hidden="true" />
              <span>Friends</span>
            </>
          ) : (
            <>
              <FiUserPlus className="w-5 h-5" aria-hidden="true" />
              <span>Add Friend</span>
            </>
          )}
        </button>
      }
    >
      <div role="main" className="max-w-4xl mx-auto p-4 md:p-8">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            {friend?.name}'s Profile
          </h1>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">
              <FiUser className="w-16 h-16 text-green-600" />
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center md:text-left">
              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                  <FiMail className="w-5 h-5" />
                  <span>{friendEmail}</span>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                  <FiPhone className="w-5 h-5" />
                  <span>Contact information private</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
            <p className="text-gray-600">
              {isAlreadyFriend 
                ? "You are friends with this user. You can see their full profile."
                : "This user's profile information is private. Add them as a friend to see more details."}
            </p>
          </div>
        </article>

        {/* Safety Status Card */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety Status</h3>
          <div className="flex items-center gap-2" role="status" aria-label="Safety status">
            <div 
              className="w-3 h-3 rounded-full bg-green-500" 
              aria-hidden="true"
            />
            <span>Safe - Last updated recently</span>
          </div>
        </div>
      </div>

      <Toaster />
    </PageLayout>
  );
};

export default FriendDashboard;