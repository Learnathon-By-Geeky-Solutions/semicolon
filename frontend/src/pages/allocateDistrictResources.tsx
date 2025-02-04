import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from 'recharts';
import { getDistrictById, updateDistrict } from '../helpers/district';
import PageLayout from '../components/layout/pageLayout';
import { useAuthStore } from '../store/authStore';
import { District } from '../types/districtTypes';
import LoadingSpinner from '../components/loadingSpinner';
import { mainNavItems } from '../config/navigation';
import { getShelters } from '../helpers/shelter';
import { Shelter } from '../types/shelterMapTypes';
import { toast } from 'react-hot-toast';
import { MdSave } from 'react-icons/md';



interface ResourceSummaryChartProps {
  resources: {
    food: { total: number; used: number };
    water: { total: number; used: number };
    medicine: { total: number; used: number };
  };
}

const ResourceSummaryChart: React.FC<ResourceSummaryChartProps> = ({ resources }) => {
  const COLORS = ['#4F46E5', '#10B981'];
  
  const createPieData = (used: number, total: number) => [
    { name: 'Used', value: used },
    { name: 'Available', value: total - used },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">Resource Usage Summary</h3>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(resources).map(([key, value]) => (
          <div key={key} className="text-center">
            <h4 className="font-semibold capitalize mb-2">{key}</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={createPieData(value.used, value.total)}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {createPieData(value.used, value.total).map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Label
                      value={`${Math.round((value.used / value.total) * 100)}%`}
                      position="center"
                      className="text-xl font-semibold"
                    />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-sm text-gray-600">
                Used: {value.used} / {value.total}
              </p>
              <p className="text-sm text-gray-600">
                Available: {value.total - value.used}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AllocateDistrictResources = () => {
  const { user } = useAuthStore();
  const [district, setDistrict] = useState<District | null>(null);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<string | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);

  useEffect(() => {
    if (user) {
      if(user.role === 'authority' || user.role === 'admin') setPermission('edit');
      else setPermission('view');
      
      const loadData = async () => {
        if (!user.district_id) return;
        try {
          const [districtData, sheltersData] = await Promise.all([
            getDistrictById(user.district_id),
            getShelters()
          ]);
          
          setDistrict(districtData);
          const filteredShelters = sheltersData.filter(
            shelter => shelter.district_id === user.district_id
          );
          setShelters(filteredShelters);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [user]);

  const handleUpdateDistrictResources = async (updatedDistrict: District) => {
    setLoading(true);
    try {
      await updateDistrict(updatedDistrict);
      setDistrict(updatedDistrict);
      toast.success('District resources updated successfully');
    } catch (error) {
      console.error('Error updating district:', error);
      toast.error('Failed to update district resources');
    } finally {
      setLoading(false);
    }
  };



  return (
    <PageLayout title="Allocate Resources" navItems={mainNavItems}>
        {loading ? <LoadingSpinner /> : (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Update Resources Form */}
        {permission === 'edit' && district && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <form 
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedDistrict = {
                  ...district,
                  district_name: formData.get('district_name') as string,
                  total_food: Number(formData.get('total_food')),
                  total_water: Number(formData.get('total_water')),
                  total_medicine: Number(formData.get('total_medicine')),
                };
                handleUpdateDistrictResources(updatedDistrict);
              }}
            >
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block">
                    <span className="text-gray-700 font-medium">District Name</span>
                    <input
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out p-3 bg-gray-50"
                      type="text"
                      name="district_name"
                      defaultValue={district.district_name}
                      disabled
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="text-gray-700 font-medium">Food Supply</span>
                    <input
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out p-3"
                      type="number"
                      name="total_food"
                      defaultValue={district.total_food}
                      min="0"
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="text-gray-700 font-medium">Water Supply</span>
                    <input
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out p-3"
                      type="number"
                      name="total_water"
                      defaultValue={district.total_water}
                      min="0"
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="text-gray-700 font-medium">Medicine Supply</span>
                    <input
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out p-3"
                      type="number"
                      name="total_medicine"
                      defaultValue={district.total_medicine}
                      min="0"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-3 rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                >
                <MdSave className="inline-block mr-2"/>
                Update Resources
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resource Summary */}
        <div className="mb-8">
          <ResourceSummaryChart
            resources={{
              food: {
                total: district?.total_food ?? 0,
                used: shelters.reduce((acc, shelter) => acc + (shelter.food || 0), 0),
              },
              water: {
                total: district?.total_water ?? 0,
                used: shelters.reduce((acc, shelter) => acc + (shelter.water || 0), 0),
              },
              medicine: {
                total: district?.total_medicine ?? 0,
                used: shelters.reduce((acc, shelter) => acc + (shelter.medicine || 0), 0),
              },
            }}
          />
        </div>

        {/* Distribution Charts */}
        {/* <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Distribution Across Shelters</h2>
          <div className="grid grid-cols-3 gap-8">
            <ResourcePieChart
              data={prepareChartData('food')}
              title="Food Distribution"
              total={district?.total_food || 0}
            />
            <ResourcePieChart
              data={prepareChartData('water')}
              title="Water Distribution"
              total={district?.total_water || 0}
            />
            <ResourcePieChart
              data={prepareChartData('medicine')}
              title="Medicine Distribution"
              total={district?.total_medicine || 0}
            />
          </div>
        </div> */}
      </div>)}
      
    </PageLayout>
    
  );
};

export default AllocateDistrictResources;