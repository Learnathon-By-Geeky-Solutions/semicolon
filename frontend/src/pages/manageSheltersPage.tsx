import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../constants/paths";
import { Shelter, NewShelter } from "../types/shelterMapTypes";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { getDistrictById, getDistricts } from "../helpers/district";
import LoadingSpinner from "../components/loadingSpinner";
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import { District } from "../types/districtTypes";

const API_URL = `${SERVER_URL}/api/v1/shelters`;

const ShelterManagement = () => {
  const { user } = useAuthStore();
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingShelter, setEditingShelter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newShelter, setNewShelter] = useState<NewShelter>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, shelterId?: string) => {
    const { name, value } = e.target;
    if (shelterId) {
      setShelters(shelters.map(shelter =>
        shelter._id === shelterId
          ? { ...shelter, [name]: name === 'food' || name === 'water' || name === 'medicine' || name === 'lat' || name === 'lng' 
              ? parseFloat(value) 
              : value }
          : shelter
      ));
    } else {
      setNewShelter(prev => ({
        ...prev,
        [name]: name === 'food' || name === 'water' || name === 'medicine' || name === 'lat' || name === 'lng'
          ? parseFloat(value)
          : value
      }));
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const district = districts.find(d => d._id === districtId) || null;
    setSelectedDistrict(district);
    if (district) {
      setNewShelter(prev => ({
        ...prev,
        district_id: district._id,
        district_name: district.district_name
      }));
    }
  };

  const addShelter = async () => {
    if (!selectedDistrict) {
      toast.error("Please select a district first");
      return;
    }

    try {
      const updatedShelters = [...shelters, { ...newShelter, _id: Date.now().toString() }];
      await axios.post(`${API_URL}/all`, { shelters: updatedShelters });
      toast.success("Shelter added successfully");
      fetchShelters();
      setNewShelter({
        name: "",
        lat: 0,
        lng: 0,
        district_id: selectedDistrict._id,
        district_name: selectedDistrict.district_name,
        food: 0,
        water: 0,
        medicine: 0,
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error saving shelter:", error);
      toast.error("Failed to add shelter");
    }
  };

  const updateShelter = async (updatedShelter: Shelter) => {
    try {
      const updatedShelters = shelters.map(shelter => 
        shelter._id === updatedShelter._id ? updatedShelter : shelter
      );
      
      await axios.post(`${API_URL}/all`, { shelters: updatedShelters });
      toast.success("Shelter updated successfully");
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
                {canEditShelters && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
                      transition-colors duration-200 flex items-center gap-2"
                  >
                    <IoMdAdd className="text-xl" />
                    <span>Add Shelter</span>
                  </button>
                )}
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
                      {editingShelter === shelter._id ? (
                        <input
                          type="text"
                          name="name"
                          value={shelter.name}
                          onChange={(e) => handleInputChange(e, shelter._id)}
                          className="border rounded p-1 w-full"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">{shelter.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingShelter === shelter._id ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            name="lat"
                            value={shelter.lat}
                            onChange={(e) => handleInputChange(e, shelter._id)}
                            className="border rounded p-1 w-20"
                            disabled
                          />
                          <input
                            type="number"
                            name="lng"
                            value={shelter.lng}
                            onChange={(e) => handleInputChange(e, shelter._id)}
                            className="border rounded p-1 w-20"
                            disabled
                          />
                        </div>
                      ) : (
                        <div className="text-gray-900">{shelter.lat}, {shelter.lng}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingShelter === shelter._id ? (
                        <input
                          type="number"
                          name="food"
                          value={shelter.food}
                          onChange={(e) => handleInputChange(e, shelter._id)}
                          className="border rounded p-1 w-20"
                        />
                      ) : (
                        <div className="text-gray-900">{shelter.food}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingShelter === shelter._id ? (
                        <input
                          type="number"
                          name="water"
                          value={shelter.water}
                          onChange={(e) => handleInputChange(e, shelter._id)}
                          className="border rounded p-1 w-20"
                        />
                      ) : (
                        <div className="text-gray-900">{shelter.water}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingShelter === shelter._id ? (
                        <input
                          type="number"
                          name="medicine"
                          value={shelter.medicine}
                          onChange={(e) => handleInputChange(e, shelter._id)}
                          className="border rounded p-1 w-20"
                        />
                      ) : (
                        <div className="text-gray-900">{shelter.medicine}</div>
                      )}
                    </td>
                    {canEditShelters && (
                      <td className="px-6 py-4">
                        {editingShelter === shelter._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateShelter(shelter)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingShelter(null)}
                              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setEditingShelter(shelter._id)}
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
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Shelter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Add New Shelter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Shelter Name"
                value={newShelter.name}
                onChange={handleInputChange}
                className="border rounded p-2"
              />
              <input
                type="number"
                name="lat"
                placeholder="Latitude"
                value={newShelter.lat}
                onChange={handleInputChange}
                className="border rounded p-2"
              />
              <input
                type="number"
                name="lng"
                placeholder="Longitude"
                value={newShelter.lng}
                onChange={handleInputChange}
                className="border rounded p-2"
              />
              <input
                type="number"
                name="food"
                placeholder="Food"
                value={newShelter.food}
                onChange={handleInputChange}
                className="border rounded p-2"
              />
              <input
                type="number"
                name="water"
                placeholder="Water"
                value={newShelter.water}
                onChange={handleInputChange}
                className="border rounded p-2"
              />
              <input
                type="number"
                name="medicine"
                placeholder="Medicine"
                value={newShelter.medicine}
                onChange={handleInputChange}
                className="border rounded p-2"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={addShelter}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Shelter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterManagement;
