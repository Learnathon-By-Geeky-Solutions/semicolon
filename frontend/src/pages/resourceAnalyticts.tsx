import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getDistricts } from '../helpers/district';
import { getShelters } from '../helpers/shelter';
import { District } from '../types/districtTypes';
import { Shelter } from '../types/shelterMapTypes';
import LoadingSpinner from '../components/loadingSpinner';

const CustomPieChart = ({ data, dataKey, nameKey, colors }: { 
  data: any[], 
  dataKey: string, 
  nameKey: string, 
  colors: string[] 
}) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey={dataKey}
          nameKey={nameKey}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const CustomAreaChart = ({ data, dataKey, color, name }: {
  data: any[],
  dataKey: string,
  color: string,
  name: string
}) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area 
          name={name}
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          fill={color} 
          fillOpacity={0.3} 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const ResourceAnalyticts = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedResource, setSelectedResource] = useState<string>("food");
  const [loading, setLoading] = useState(true);

  const resourceColors = {
    food: "#22C55E", // green-600
    water: "#0EA5E9", // sky-500
    medicine: "#EC4899", // pink-500
  };

  const resourceLabels = {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  const selectedDistrictShelters = shelters.filter(
    shelter => shelter.district_id === selectedDistrictId
  );

  const totals = selectedDistrictShelters.reduce((acc, shelter) => {
    Object.keys(resourceColors).forEach(resource => {
      acc[resource] = (acc[resource] || 0) + (shelter[resource as keyof Shelter] || 0);
    });
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for pie chart
  const pieData = Object.entries(totals).map(([name, value]) => ({ name, value }));

  // Prepare data for area charts
  const areaData = selectedDistrictShelters.map(shelter => ({
    name: shelter.name,
    ...Object.keys(resourceColors).reduce((acc, resource) => ({
      ...acc,
      [resource]: shelter[resource as keyof Shelter]
    }), {})
  }));

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
            className="flex items-center px-6 py-3 text-gray-100 hover:bg-green-700"
          >
            <span className="mx-3">Districts</span>
          </a>
          <a
            href="/analytics"
            className="flex items-center px-6 py-3 bg-green-700 text-white"
          >
            <span className="mx-3">Analytics</span>
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
              <h2 className="text-2xl font-bold text-gray-800">Resource Analytics</h2>
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
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Resource Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(totals).map(([resource, total]) => (
              <div 
                key={resource}
                className={`bg-white p-4 rounded-lg shadow cursor-pointer transition-all duration-200 ${
                  selectedResource === resource ? 'ring-2 ring-green-500' : ''
                }`}
                style={{ borderLeft: `4px solid ${resourceColors[resource]}` }}
                onClick={() => setSelectedResource(resource)}
              >
                <div className="text-sm font-medium text-gray-600 capitalize">
                  {resourceLabels[resource as keyof typeof resourceLabels]}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {selectedDistrictShelters.length} shelters
                </div>
              </div>
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
              <CustomPieChart 
                data={pieData}
                dataKey="value"
                nameKey="name"
                colors={Object.values(resourceColors)}
              />
            </div>

            {/* Resource Distribution by Shelter */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {resourceLabels[selectedResource as keyof typeof resourceLabels]} by Shelter
                </h3>
                <div className="text-sm text-gray-500">
                  Average: {Math.round(totals[selectedResource] / selectedDistrictShelters.length).toLocaleString()}
                </div>
              </div>
              <CustomAreaChart 
                data={areaData}
                dataKey={selectedResource}
                color={resourceColors[selectedResource]}
                name={resourceLabels[selectedResource as keyof typeof resourceLabels]}
              />
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
                            {shelter[resource as keyof Shelter]?.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResourceAnalyticts;