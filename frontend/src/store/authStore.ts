import { create } from "zustand";
import { SERVER_URL } from "../constants/paths";
import axios from "axios";
const API_URL = SERVER_URL + "/api/v1/auth";

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  password: string;
  role: "admin" | "authority" | "volunteer" | "user";
  family: string[];
  documents?: Document[];
  district_id?: string;
  isVerified: boolean;
}

interface Alluser {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  users: Alluser[];
  message: string | null;
  allUser: Alluser | null;
  currentUser: Alluser | null;
  setCurrentUser: (friend: Alluser) => void;
  signup: (email: string, password: string, name: string, role: "admin" | "authority" | "volunteer" | "user", document?: File | string, district_id?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleAuth: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string | undefined, password: string) => Promise<void>;
  addFriend: (userEmail: string, friendEmail: string) => Promise<void>;
  deleteFriend: (userEmail: string, friendEmail: string) => Promise<void>;
  getUser: () => Promise<void>;
  googleLogin: (code: string) => Promise<void>;
}

axios.defaults.withCredentials = true;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  users: [] as Alluser[],
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  allUser: null,
  currentUser: null,
  setCurrentUser: (currentUser: Alluser) => set({ currentUser }),
  signup: async (email, password, name, role, document, district_id) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      formData.append("role", role);

      if ((role === 'authority' || role === 'volunteer') && document) {
        formData.append("document", document);
      }
      if ((role === 'authority' || role === 'volunteer') && district_id) {
        formData.append("district_id", district_id);
      }

      const response = await axios.post(`${API_URL}/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Error signing up",
          isLoading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isLoading: false });
      }
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Error logging in",
          isLoading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isLoading: false });
      }
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Error logging out",
          isLoading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isLoading: false });
      }
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: null,
          isCheckingAuth: false,
          isAuthenticated: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isCheckingAuth: false });
      }
      throw error;
    }
  },

  googleAuth: () => {
    try {
      window.location.href = `${API_URL}/google`;
    } catch (error) {
      console.error("Error initiating Google authentication:", error);
      set({ error: "Failed to initiate Google authentication" });
    }
  },

  googleLogin: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/google?code=${code}`);

      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Error logging in",
          isLoading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isLoading: false });
      }
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Error sending forgot password email",
          isLoading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isLoading: false });
      }
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Error resetting password",
          isLoading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isLoading: false });
      }
      throw error;
    }
  },

  addFriend: async (userEmail: string, friendEmail: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = {
        userEmail: userEmail,
        friendEmail: friendEmail,
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/user/addFriend",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Friend added successfully", response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Error adding friend",
          isLoading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isLoading: false });
      }
      throw error;
    }
  },

  getUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const usersResponse = await axios.get("http://localhost:5000/api/v1/user/all");
      const allUsers = usersResponse.data.data;
      set({ users: allUsers, isLoading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Error fetching users",
          isLoading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isLoading: false });
      }
      throw error;
    }
  },
  deleteFriend: async (userEmail: string, friendEmail: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = {
        userEmail: userEmail,
        friendEmail: friendEmail,
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/user/deleteFriend",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Friend deleted successfully", response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Error deleting friend",
          isLoading: false,
        });
      } else {
        set({ error: "Unexpected error occurred", isLoading: false });
      }
      throw error;
    }
  },
}));
