import { ResourceData } from '../../types/resourceAnalyticsTypes';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip} from 'recharts';
const COLORS = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'];

interface ResourcePieChartProps {
  data: ResourceData[];
  title: string;
  total: number;
}


export const ResourcePieChart = ({ data, title, total }: ResourcePieChartProps) => {
  const formattedData = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-center mb-3 text-gray-800">{title}</h3>
      <p className="text-sm text-center text-gray-600 mb-4">Total: {total}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {formattedData.map((entry, index) => (
                <Cell 
                  key={entry.name} 
                  fill={COLORS[index % COLORS.length]} 
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string, props: { payload?: { percentage: string } }) => [
                `${value} (${props.payload?.percentage}%)`,
                name
              ]}
            />
            <Legend 
              layout="horizontal" 
              align="center" 
              verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};