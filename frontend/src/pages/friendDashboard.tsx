import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import { Toaster, toast } from 'react-hot-toast';
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";
import { 
  Shield, 
  UserPlus2, 
  UserMinus2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Battery, 
  Signal, 
  Heart, 
  UserCheck,
  Home
} from 'lucide-react';
import axios from 'axios';
import { SERVER_URL } from '../constants/paths';

const FriendDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, user, users, addFriend, deleteFriend } = useAuthStore();
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

  const handleAddFriend = async () => {
    if (isAlreadyFriend) {
      try {
        await deleteFriend(user?.email || " ", currentUser?.email || " ");
        toast.success(`You have removed ${friend?.name} from your friends list.`);
        setIsAlreadyFriend(false);
      } catch (error) {
        toast.error("Failed to remove friend. Please try again.");
      }
    } else {
      try {
        await addFriend(user?.email || " ", currentUser?.email || " ");
        toast.success(`You have added ${friend?.name} as a friend!`);
        setIsAlreadyFriend(true);
      } catch (error) {
        toast.error("Failed to add friend. Please try again.");
      }
    }
  };

  return (
    <PageLayout
      title="Friend Safety Status"
      navItems={mainNavItems}
      headerRightContent={
        <button
          type="button"
          onClick={handleAddFriend}
          className={`inline-flex items-center px-6 py-2.5 rounded-full
          transition-all duration-300 transform hover:scale-105
          font-medium text-sm gap-2 shadow-lg
          ${isAlreadyFriend 
            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' 
            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {isAlreadyFriend ? (
            <>
              <UserMinus2 className="w-4 h-4" strokeWidth={2} />
              <span>Remove Emergency Contact</span>
            </>
          ) : (
            <>
              <UserPlus2 className="w-4 h-4" strokeWidth={2} />
              <span>Add Emergency Contact</span>
            </>
          )}
        </button>
      }
    >
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Status Header */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
              alt="Location background"
              className="w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${friend?.name || 'User'}`}
                  alt="Profile avatar"
                  className="w-20 h-20"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-white drop-shadow-md">
                {friend?.name}
              </h1>
              <div className="flex items-center gap-2 text-emerald-50">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium">Safe</span>
                </div>
                <span className="text-emerald-200">•</span>
                <span className="text-sm">Last update: 2 minutes ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Status Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Safety Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-green-800">Current Safety Status</h2>
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Vital Signs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Signal className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Network Status</p>
                        <p className="font-medium text-blue-700">Connected</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                        <Battery className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Device Battery</p>
                        <p className="font-medium text-green-700">85%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Health Status</p>
                        <p className="font-medium text-emerald-700">Normal</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Location</p>
                      <p className="font-medium text-gray-900">Safe Zone - Home</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 h-48 rounded-xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d"
                      alt="Location map"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Resources */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Nearby Emergency Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Home className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Shelter</p>
                    <p className="text-sm text-blue-600">0.8 miles away</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-900">Medical Center</p>
                    <p className="text-sm text-emerald-600">1.2 miles away</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Alerts */}
          <div className="space-y-6">
            {/* Emergency Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Emergency Phone</p>
                    <p className="font-medium">{isAlreadyFriend ? "+1 (555) 123-4567" : "Hidden"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{friendEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Checked in as safe</p>
                    <p className="text-xs text-green-600">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Location updated</p>
                    <p className="text-xs text-blue-600">15 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Settings */}
            {isAlreadyFriend && (
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-800">Alert Settings</h3>
                </div>
                <p className="text-amber-700 text-sm mb-4">
                  You'll receive notifications when {friend?.name}'s safety status changes.
                </p>
                <button className="w-full bg-amber-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-amber-700 transition-colors">
                  Manage Alert Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" />
    </PageLayout>
  );
};

export default FriendDashboard;