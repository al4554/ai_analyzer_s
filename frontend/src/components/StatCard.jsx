import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => {
    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-all duration-200 hover:shadow-md flex flex-col"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl">
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
