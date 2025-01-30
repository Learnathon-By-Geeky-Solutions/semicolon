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
    _id: string,
    name: string;
    email: string;
    role: "admin" | "authority" | "volunteer" | "user"; 
    family: string[];
    documents?: Document[]; 
    district_id?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  users:string[];
  message: string | null;

  signup: (email: string, password: string, name: string, role: "admin" | "authority" | "volunteer" | "user", document?: File | string, district_id?: string) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  addFriend:(friendName: string)=>Promise<void>;

}
axios.defaults.withCredentials = true;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  users: [],
  isLoading: false,
  isCheckingAuth: true,
  message: null,

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
    

        console.log("final formData", formData);
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

      console.log("2");
      const usersResponse = await axios.get("http://localhost:5000/api/v1/user/all"); // Assuming this is the endpoint to fetch all users
      const allUsers = usersResponse.data.data; // Store users in an array
      console.log(allUsers);
      set({
        isAuthenticated: true,
        user: response.data.user,
        users:allUsers,
        error: null,
        isLoading: false,
      });
      
    }catch (error: unknown) {
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
    addFriend: async (friendName: string) => {
      set({ isLoading: true, error: null }); // Set loading state
      try {
        const formData = new FormData();
        
        // Assuming you want to send friendName as part of the request body
        formData.append("friendName", friendName);
        
        console.log("Adding friend with formData", formData);
        
        const response = await axios.post(`${API_URL}/addFriend`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        // Optionally, you can return the response or updated data
    
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          set({
            error: error.response?.data?.message || "Error adding friend",
            isLoading: false,
          });
        } else {
          set({ error: "Unexpected error occurred", isLoading: false });
        }
        throw error; // Re-throw the error to be handled elsewhere if needed
      }
    },
    
  }
));