import React, { useState, useEffect } from "react";
import { District, NewDistrict } from "../types/districtTypes";
import { getDistricts, createDistrict, updateDistrict, deleteDistrict } from "../helpers/district";
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';

const DistrictPage: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [formData, setFormData] = useState<NewDistrict>({
    district_name: "",
    total_food: 0,
    total_water: 0,
    total_medicine: 0,
  });

  // Fetch districts
  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    const districtsData = await getDistricts();
    setDistricts(districtsData);
  };

  // Create district
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDistrict(formData);
      setIsAddModalOpen(false);
      setFormData({
        district_name: "",
        total_food: 0,
        total_water: 0,
        total_medicine: 0,
      });
      fetchDistricts();
    } catch (error) {
      console.error("Error creating district:", error);
    }
  };

  // Update district
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDistrict) return;

    try {
      await updateDistrict({
        ...selectedDistrict,
        ...formData
      });
      setIsEditModalOpen(false);
      setSelectedDistrict(null);
      fetchDistricts();
    } catch (error) {
      console.error("Error updating district:", error);
    }
  };

  // Delete district
  const handleDelete = async (district: District) => {
    if (!window.confirm("Are you sure you want to delete this district?")) return;

    try {
      await deleteDistrict(district);
      fetchDistricts();
    } catch (error) {
      console.error("Error deleting district:", error);
    }
  };

  // Add this helper function to handle number input changes
  const handleNumberInput = (field: 'total_food' | 'total_water' | 'total_medicine', value: string) => {
    const numberValue = value === '' ? 0 : Number(value);
    setFormData(prev => ({
      ...prev,
      [field]: numberValue
    }));
  };

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
            className="flex items-center px-6 py-3 text-gray-100 hover:bg-green-700"
          >
            <span className="mx-3">Shelters</span>
          </a>
          <a
            href="/districts"
            className="flex items-center px-6 py-3 bg-green-700 text-white"
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
            <h2 className="text-2xl font-bold text-gray-800">District Management</h2>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
                transition-colors duration-200 flex items-center gap-2"
            >
              <IoMdAdd className="text-xl" />
              <span>Add District</span>
            </button>
          </div>

          {/* Districts Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Food
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Water
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {districts.map((district) => (
                  <tr key={district._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{district.district_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{district.total_food}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{district.total_water}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{district.total_medicine}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedDistrict(district);
                            setFormData(district);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(district)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Enhanced Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-green-700 px-6 py-4 text-white">
              <h2 className="text-xl font-semibold">
                {isAddModalOpen ? "Add New District" : "Edit District"}
              </h2>
            </div>

            {/* Modal Body */}
            <form onSubmit={isAddModalOpen ? handleCreate : handleUpdate} className="p-6">
              <div className="space-y-4">
                {/* District Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District Name
                  </label>
                  <input
                    type="text"
                    value={formData.district_name}
                    onChange={(e) =>
                      setFormData({ ...formData, district_name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                      focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter district name"
                    required
                  />
                </div>

                {/* Resource Inputs */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Food
                    </label>
                    <input
                      type="number"
                      value={formData.total_food || ''}
                      onChange={(e) => handleNumberInput('total_food', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                        focus:ring-green-500 focus:border-transparent transition-all"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Water
                    </label>
                    <input
                      type="number"
                      value={formData.total_water || ''}
                      onChange={(e) => handleNumberInput('total_water', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                        focus:ring-green-500 focus:border-transparent transition-all"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medicine
                    </label>
                    <input
                      type="number"
                      value={formData.total_medicine || ''}
                      onChange={(e) => handleNumberInput('total_medicine', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                        focus:ring-green-500 focus:border-transparent transition-all"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedDistrict(null);
                    setFormData({
                      district_name: "",
                      total_food: 0,
                      total_water: 0,
                      total_medicine: 0,
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                    transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                    transition-colors duration-200 flex items-center gap-2"
                >
                  {isAddModalOpen ? (
                    <>
                      <IoMdAdd className="text-xl" />
                      <span>Create District</span>
                    </>
                  ) : (
                    <>
                      <FiEdit2 className="text-xl" />
                      <span>Update District</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictPage;
