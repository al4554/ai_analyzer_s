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

const ResumeStrengthChart = ({ strength = {} }) => {
    const data = [
        { name: 'Skills', score: strength?.skills || 0 },
        { name: 'Projects', score: strength?.projects || 0 },
        { name: 'Experience', score: strength?.experience || 0 },
        { name: 'Education', score: strength?.education || 0 }
    ];

    return (
        <DashboardCard title="Resume Strength">
            <div className="h-64 mt-6 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.9}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            domain={[0, 100]}
                            tick={{ fill: '#9ca3af', fontSize: 11 }}
                        />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-bold border border-gray-700">
                                            {payload[0].payload.name}: {payload[0].value}%
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar 
                            dataKey="score" 
                            radius={[6, 6, 0, 0]}
                            fill="url(#barGradient)"
                            barSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-6">
                {data.map(item => (
                    <div key={item.name} className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">{item.name}</p>
                        <p className={`text-sm font-bold ${item.score >= 70 ? 'text-green-600' : item.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {item.score}%
                        </p>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
};

export default ResumeStrengthChart;
