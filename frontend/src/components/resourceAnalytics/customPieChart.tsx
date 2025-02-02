import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ResourceData } from '../../types/resourceAnalyticsTypes';
const CustomPieChart = ({ data, dataKey, nameKey, colors }: { 
    data: ResourceData[], 
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
  export default CustomPieChart;