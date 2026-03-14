import { useState, useEffect } from 'react';
import { Calendar, Search, AlertCircle } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { getHistory } from '../services/api';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(data);
            } catch (error) {
                console.error("Error fetching history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8">Analysis History</h1>

            <DashboardCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search resumes..." 
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 uppercase text-gray-500 dark:text-gray-400 font-bold text-xs border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Resume Name</th>
                                <th className="px-6 py-4 text-center">ATS Score</th>
                                <th className="px-6 py-4 text-center">Similarity</th>
                                <th className="px-6 py-4 whitespace-nowrap">Date Analyzed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                            Loading history...
                                        </div>
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <AlertCircle className="mx-auto text-gray-300 dark:text-gray-700 mb-2" size={32} />
                                        <p className="text-gray-500 dark:text-gray-400">No previous analyses found.</p>
                                    </td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1 italic">"{item.resume_name}"</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                item.ats_score > 75 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                                                item.ats_score > 50 ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
                                                'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                            }`}>
                                                {item.ats_score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-gray-700 dark:text-gray-300">
                                            {(item.similarity_score * 100).toFixed(0)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                                                <Calendar size={14} />
                                                {formatDate(item.created_at)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </DashboardCard>
        </div>
    );
};

export default History;
