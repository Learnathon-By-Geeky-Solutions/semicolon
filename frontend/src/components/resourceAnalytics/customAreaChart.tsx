import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from 'recharts';
const CustomAreaChart = ({ data, dataKey, color, name }: {
    data: { name: string; [key: string]: number | string }[],
    dataKey: string,
    color: string,
    name: string
  }) => 
    
    
    (
      
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
export default CustomAreaChart;
  