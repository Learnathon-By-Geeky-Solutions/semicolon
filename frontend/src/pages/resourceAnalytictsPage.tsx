import { useEffect, useState } from 'react';
import { getDistricts } from '../helpers/district';
import { getShelters } from '../helpers/shelter';
import { District } from '../types/districtTypes';
import { Shelter } from '../types/shelterMapTypes';
import LoadingSpinner from '../components/loadingSpinner';
import { ResourceType, ResourceData, ResourceColors, ResourceLabels, AreaChartData } from '../types/resourceAnalyticsTypes';
import CustomPieChart from '../components/resourceAnalytics/customPieChart';
import CustomAreaChart from '../components/resourceAnalytics/customAreaChart';
import PageLayout from '../components/layout/pageLayout';
import { mainNavItems } from '../config/navigation';

const ResourceAnalytictsPage = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedResource, setSelectedResource] = useState<ResourceType>("food");
  const [loading, setLoading] = useState(true);

  const resourceColors: ResourceColors = {
    food: "#22C55E", // green-600
    water: "#0EA5E9", // sky-500
    medicine: "#EC4899", // pink-500
  };

  const resourceLabels: ResourceLabels = {
    food: "Food Supplies",
    water: "Water Supplies",
    medicine: "Medical Supplies"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtsData, sheltersData] = await Promise.all([
          getDistricts(),
          getShelters()
        ]);
        setDistricts(districtsData);
        setShelters(sheltersData);
        if (districtsData.length > 0) {
          setSelectedDistrictId(districtsData[0]._id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const selectedDistrictShelters = shelters.filter(
    shelter => shelter.district_id === selectedDistrictId
  );

  const totals = selectedDistrictShelters.reduce((acc, shelter) => {
    (Object.keys(resourceColors) as ResourceType[]).forEach(resource => {
      acc[resource] = (acc[resource] || 0) + (shelter[resource] || 0);
    });
    return acc;
  }, {} as Record<ResourceType, number>);

  // Prepare data for pie chart
  const pieData: ResourceData[] = Object.entries(totals).map(([name, value]) => ({ name, value }));

  // Prepare data for area charts
  const areaData: AreaChartData[] = selectedDistrictShelters.map(shelter => ({
    name: shelter.name,
    ...(Object.keys(resourceColors) as ResourceType[]).reduce((acc, resource) => ({
      ...acc,
      [resource]: shelter[resource]
    }), {})
  }));

  return (
    <PageLayout
      title="Resource Analytics"
      navItems={mainNavItems}
      headerRightContent={
        <select
          value={selectedDistrictId}
          onChange={(e) => setSelectedDistrictId(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {districts.map(district => (
            <option key={district._id} value={district._id}>
              {district.district_name}
            </option>
          ))}
        </select>
      }
    >
      {loading ? <LoadingSpinner /> : (
      <div className="flex-1 overflow-y-auto p-6">
        {/* Resource Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(totals).map(([resource, total]) => (
            <button 
              key={resource}
              className={`bg-white p-4 rounded-lg shadow cursor-pointer transition-all duration-200 w-full text-left
                ${selectedResource === resource ? 'ring-2 ring-green-500' : 'hover:ring-2 hover:ring-green-200'}
              `}
              style={{ borderLeft: `4px solid ${resourceColors[resource as ResourceType]}` }}
              onClick={() => setSelectedResource(resource as ResourceType)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedResource(resource as ResourceType);
                }
              }}
              role="tab"
              aria-selected={selectedResource === resource}
              aria-controls={`${resource}-panel`}
              tabIndex={0}
            >
              <div className="text-sm font-medium text-gray-600 capitalize">
                {resourceLabels[resource as ResourceType]}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {selectedDistrictShelters.length} shelters
              </div>
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Resource Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Overall Resource Distribution
              </h3>
              <div className="text-sm text-gray-500">
                Total Resources: {Object.values(totals).reduce((a, b) => a + b, 0).toLocaleString()}
              </div>
            </div>
            <div className="h-[300px]">
              <CustomPieChart 
                data={pieData}
                dataKey="value"
                nameKey="name"
                colors={Object.values(resourceColors)}
              />
            </div>
          </div>

          {/* Resource Distribution by Shelter */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {resourceLabels[selectedResource]} by Shelter
              </h3>
              <div className="text-sm text-gray-500">
                Average: {Math.round(totals[selectedResource] / selectedDistrictShelters.length).toLocaleString()}
              </div>
            </div>
            <div className="h-[300px]">
              <CustomAreaChart 
                data={areaData}
                dataKey={selectedResource}
                color={resourceColors[selectedResource]}
                name={resourceLabels[selectedResource]}
              />
            </div>
          </div>

          {/* Shelter List */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Shelter Details
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shelter Name
                    </th>
                    {Object.entries(resourceLabels).map(([key, label]) => (
                      <th 
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedDistrictShelters.map((shelter) => (
                    <tr key={shelter._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{shelter.name}</div>
                      </td>
                      {Object.keys(resourceLabels).map(resource => (
                        <td 
                          key={resource}
                          className={`px-6 py-4 whitespace-nowrap ${
                            selectedResource === resource ? 'font-bold' : ''
                          }`}
                        >
                          {shelter[resource as ResourceType]?.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>)}
    </PageLayout>
  );
};

export default ResourceAnalytictsPage;