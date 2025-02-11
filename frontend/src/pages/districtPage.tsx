import React, { useState, useEffect } from "react";
import { District, NewDistrict } from "../types/districtTypes";
import { getDistricts, createDistrict, updateDistrict, deleteDistrict } from "../helpers/district";
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/loadingSpinner";
import DistrictModal from "../components/district/districtModal";

const initialFormData: NewDistrict = {
  district_name: "",
  total_food: 0,
  total_water: 0,
  total_medicine: 0,
};

const DistrictPage: React.FC = () => {
  const { user } = useAuthStore();
  const [permissions, setPermissions] = useState("view");
  const [districts, setDistricts] = useState<District[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<NewDistrict>(initialFormData);

  useEffect(() => {
    setIsLoading(true);
    if(user){
      if(user.role === "admin"){
        setPermissions("edit");
      }
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    setIsLoading(true);
    try {
      const districtsData = await getDistricts();
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
    setIsLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDistrict(formData);
      setIsAddModalOpen(false);
      setFormData(initialFormData);
      fetchDistricts();
    } catch (error) {
      console.error("Error creating district:", error);
    }
  };

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

  const handleDelete = async (district: District) => {
    if (!window.confirm("Are you sure you want to delete this district?")) return;

    try {
      await deleteDistrict(district);
      fetchDistricts();
    } catch (error) {
      console.error("Error deleting district:", error);
    }
  };

  const handleNumberInput = (field: 'total_food' | 'total_water' | 'total_medicine', value: string) => {
    const numberValue = value === '' ? 0 : Number(value);
    if (numberValue < 0) {
      alert(`${field.replace('_', ' ')} cannot be negative`);
      return;
    }
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
      {isLoading ? <LoadingSpinner /> : (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8">
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
          <DistrictModal
            isOpen={isAddModalOpen}
            title="Add New District"
            formData={formData}
            onSubmit={handleCreate}
            onClose={() => {
              setIsAddModalOpen(false);
              setFormData(initialFormData);
            }}
            onNumberInput={handleNumberInput}
            onNameChange={(value) => setFormData(prev => ({ ...prev, district_name: value }))}
            submitButtonText="Create District"
          />

          {/* Edit District Modal */}
          <DistrictModal
            isOpen={isEditModalOpen}
            title="Edit District"
            formData={formData}
            onSubmit={handleUpdate}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedDistrict(null);
              setFormData(initialFormData);
            }}
            onNumberInput={handleNumberInput}
            onNameChange={(value) => setFormData(prev => ({ ...prev, district_name: value }))}
            submitButtonText="Update District"
          />
        </div>
      )}
    </PageLayout>
  );
};

export default DistrictPage;
