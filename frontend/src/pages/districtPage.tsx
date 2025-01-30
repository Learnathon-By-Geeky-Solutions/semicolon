import React, { useState, useEffect } from "react";
import { District, NewDistrict } from "../types/districtTypes";
import { getDistricts, createDistrict, updateDistrict, deleteDistrict } from "../helpers/district";
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";
import { useAuthStore } from "../store/authStore";

const DistrictPage: React.FC = () => {
  const { user } = useAuthStore();
  const [permissions, setPermissions] = useState("view");
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
  useEffect(() => {
    if(user){
      if(user.role === "admin"){
        setPermissions("edit");
      }
    }
  }, [user]);

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
    <PageLayout
      title="Districts"
      navItems={mainNavItems}
      headerRightContent={
        permissions === "edit" && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
          hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow
          font-medium text-sm gap-2"
        >
          <IoMdAdd className="w-5 h-5" />
          <span>Add District</span>
        </button>
        )
      }
    >
      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        {/* Districts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Food
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Water
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>

                  {permissions === "edit" && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {districts.map((district) => (
                  <tr key={district._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {district.district_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {district.total_food}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {district.total_water}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {district.total_medicine}
                    </td>
                    {permissions === "edit" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setSelectedDistrict(district);
                              setFormData(district);
                              setIsEditModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(district)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add District Modal */}
        {(isAddModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
              {/* Modal Header */}
              <div className="bg-green-700 px-6 py-4 text-white">
                <h2 className="text-xl font-semibold">
                  Add New District
                </h2>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreate} className="p-6">
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
                    <IoMdAdd className="text-xl" />
                    <span>Create District</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit District Modal */}
        {(isEditModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
              {/* Modal Header */}
              <div className="bg-green-700 px-6 py-4 text-white">
                <h2 className="text-xl font-semibold">
                  Edit District
                </h2>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleUpdate} className="p-6">
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
                    <FiEdit2 className="text-xl" />
                    <span>Update District</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DistrictPage;
