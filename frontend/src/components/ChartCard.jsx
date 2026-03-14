import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import DashboardCard from './DashboardCard';

const ChartCard = ({ title, data }) => {
    // data format: [{ name: 'React', score: 100 }, { name: 'Node', score: 100 }, { name: 'AWS', score: 0 }]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const isMissing = payload[0].value === 0;
            return (
                <div className="bg-gray-900 text-white text-xs py-1.5 px-3 rounded shadow-lg">
                    <p className="font-medium">{`${label}: ${isMissing ? 'Missing' : 'Found'}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <DashboardCard title={title}>
            <div className="h-64 mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                        barSize={32}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6b7280', fontSize: 12 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={false}
                            domain={[0, 100]}
                        />
                        <Tooltip cursor={{ fill: '#f9fafb' }} content={<CustomTooltip />} />
                        <Bar 
                            dataKey="score" 
                            radius={[4, 4, 4, 4]}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.score > 0 ? '#3b82f6' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4 text-xs justify-center items-center">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    <span className="text-gray-600 font-medium">Found</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600 font-medium">Missing</span>
                </div>
            </div>
        </DashboardCard>
    );
};

export default ChartCard;
