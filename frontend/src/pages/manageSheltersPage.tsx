import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../constants/paths";
import { Shelter, NewShelter } from "../types/shelterMapTypes";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { getDistrictById, getDistricts } from "../helpers/district";
import LoadingSpinner from "../components/loadingSpinner";
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { District } from "../types/districtTypes";

const API_URL = `${SERVER_URL}/api/v1/shelters`;

const ShelterManagement = () => {
  const { user } = useAuthStore();
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null);
  const [formData, setFormData] = useState<Shelter>({
    _id: "",
    name: "",
    lat: 0,
    lng: 0,
    district_id: "",
    district_name: "",
    food: 0,
    water: 0,
    medicine: 0,
  });

  useEffect(() => {
    fetchDistricts();
    fetchShelters();
  }, []);

  useEffect(() => {
    if (user?.district_id) {
      const userDistrict = districts.find(d => d._id === user.district_id);
      if (userDistrict) {
        setSelectedDistrict(userDistrict);
      }
    }
  }, [user, districts]);

  const fetchDistricts = async () => {
    try {
      const fetchedDistricts = await getDistricts();
      setDistricts(fetchedDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to load districts");
    }
  };

  const fetchShelters = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Shelter[]>(`${API_URL}/all`);
      setShelters(response.data);
    } catch (error) {
      console.error("Error fetching shelters:", error);
      toast.error("Failed to load shelters");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'food' || name === 'water' || name === 'medicine' || name === 'lat' || name === 'lng'
      ? parseFloat(value)
      : value;

    if (isEditModalOpen) {
      setFormData(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    } 
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const district = districts.find(d => d._id === districtId) || null;
    setSelectedDistrict(district);
  };

  const updateShelter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedShelters = shelters.map(shelter => 
        shelter._id === formData._id ? formData : shelter
      );
      
      await axios.post(`${API_URL}/all`, { shelters: updatedShelters });
      toast.success("Shelter updated successfully");
      setIsEditModalOpen(false);
      setEditingShelter(null);
      fetchShelters();
    } catch (error) {
      console.error("Error updating shelter:", error);
      toast.error("Failed to update shelter");
    }
  };

  const deleteShelter = async (shelterId: string) => {
    if (!window.confirm("Are you sure you want to delete this shelter?")) return;
    
    try {
      const updatedShelters = shelters.filter(shelter => shelter._id !== shelterId);
      await axios.post(`${API_URL}/all`, { shelters: updatedShelters });
      toast.success("Shelter deleted successfully");
      fetchShelters();
    } catch (error) {
      console.error("Error deleting shelter:", error);
      toast.error("Failed to delete shelter");
    }
  };

  const canEditShelters = user && selectedDistrict && user.district_id === selectedDistrict._id;
  const filteredShelters = selectedDistrict 
    ? shelters.filter(shelter => shelter.district_id === selectedDistrict._id)
    : shelters;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">CrisisCompass</h1>
        </div>
        <nav className="mt-6">
          <a
            href="/shelters"
            className="flex items-center px-6 py-3 bg-green-700 text-white"
          >
            <span className="mx-3">Shelters</span>
          </a>
          <a
            href="/districts"
            className="flex items-center px-6 py-3 text-gray-100 hover:bg-green-700"
          >
            <span className="mx-3">Districts</span>
          </a>
          <a
            href="/map"
            className="flex items-center px-6 py-3 text-gray-100 hover:bg-green-700"
          >
            <span className="mx-3">Map</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Shelter Management</h2>
              <div className="flex items-center gap-4">
                <select
                  value={selectedDistrict?._id || ""}
                  onChange={handleDistrictChange}
                  className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district._id} value={district._id}>
                      {district.district_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Shelters Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                  {canEditShelters && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredShelters.map((shelter) => (
                  <tr key={shelter._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{shelter.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{shelter.lat}, {shelter.lng}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{shelter.food}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{shelter.water}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{shelter.medicine}</div>
                    </td>
                    {canEditShelters && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setEditingShelter(shelter);
                              setFormData(shelter);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteShelter(shelter._id)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Edit Shelter Modal */}
      {isEditModalOpen && editingShelter && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
      <div className="bg-green-700 px-6 py-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-semibold">Edit Shelter</h2>
        <button
          onClick={() => {
            setIsEditModalOpen(false);
            setEditingShelter(null);
          }}
          className="text-white hover:text-gray-200"
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
      <form onSubmit={updateShelter} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shelter Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 focus:outline-none"
                placeholder="Latitude"
                disabled
              />
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 focus:outline-none"
                placeholder="Longitude"
                disabled
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food
            </label>
            <input
              type="number"
              name="food"
              value={formData.food}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Water
            </label>
            <input
              type="number"
              name="water"
              value={formData.water}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine
            </label>
            <input
              type="number"
              name="medicine"
              value={formData.medicine}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 focus:outline-none"
              required
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setIsEditModalOpen(false);
              setEditingShelter(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-600 focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)
}
    </div>
  );
};

export default ShelterManagement;
