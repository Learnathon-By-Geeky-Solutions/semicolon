import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";
import LoadingSpinner from "../components/loadingSpinner";
import { SERVER_URL } from '../constants/paths';
import { 
  Shield, 
  Users, 
  MapPin, 
  Battery, 
  Signal, 
  Heart,
  AlertTriangle,
  Clock
} from 'lucide-react';

const FamilyStatus: React.FC = () => {
  const navigate = useNavigate();
  const { user, users, getUser, setCurrentUser } = useAuthStore();
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchFriends = useCallback(async () => {
    if (!user || hasFetched) return;

    setIsLoading(true);
    try {
      await getUser();

      const friendList = await Promise.all(
        users.map(async (u) => {
          try {
            const response = await axios.post(`${SERVER_URL}/api/v1/user/checkFriendship`, {
              userEmail: user?.email,
              friendEmail: u.email,
            });

            return response.data.isFriend ? u : null;
          } catch (error) {
            console.error("Error checking friendship status:", error);
            return null;
          }
        })
      );

      setFriends(friendList.filter(Boolean));
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, [user, getUser, users, hasFetched]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleFriendClick = (friendEmail: string) => {
    navigate(`/friend/${friendEmail}`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'danger':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <PageLayout title="Family Safety Dashboard" navItems={mainNavItems}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <Users className="w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-bold">Family Safety Monitor</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/80 text-sm">Total Family Members</p>
              <p className="text-2xl font-semibold">{friends.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/80 text-sm">Safe Status</p>
              <p className="text-2xl font-semibold">
                {friends.filter(f => f.status?.toLowerCase() === 'safe').length}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/80 text-sm">Need Attention</p>
              <p className="text-2xl font-semibold">
                {friends.filter(f => f.status?.toLowerCase() !== 'safe').length}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : friends.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {friends.map((friend) => (
              <div
                key={friend.email}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                onClick={() => {
                  setCurrentUser(friend);
                  handleFriendClick(friend.email);
                }}
              >
                <div className={`px-6 py-4 border-b ${getStatusColor(friend.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/90 p-0.5">
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${friend.name}`}
                            alt="Profile avatar"
                            className="w-8 h-8"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{friend.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                          <span>{friend.status || "Unknown"}</span>
                        </div>
                      </div>
                    </div>
                    <Shield className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Vital Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Signal className="w-4 h-4" />
                      <span className="text-sm">Connected</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Battery className="w-4 h-4" />
                      <span className="text-sm">85%</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">Normal</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Safe Zone - Home</span>
                  </div>

                  {/* Last Update */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Last update: 5 minutes ago</span>
                  </div>

                  {/* Alert Badge */}
                  {friend.status?.toLowerCase() !== 'safe' && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Attention needed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Family Members Found</h3>
            <p className="text-gray-600">
              Add family members to start monitoring their safety status.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FamilyStatus;