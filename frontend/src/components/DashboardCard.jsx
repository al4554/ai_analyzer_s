import { motion } from 'framer-motion';

const DashboardCard = ({ title, children, className = "" }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-all duration-200 hover:shadow-md ${className}`}
        >
            {title && <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">{title}</h2>}
            {children}
        </motion.div>
    );
};

export default DashboardCard;
