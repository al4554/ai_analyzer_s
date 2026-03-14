import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SkillList = ({ skills, type = "found" }) => {
    const isFound = type === "found";
    const Icon = isFound ? CheckCircle2 : XCircle;
    const bgColor = isFound ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10';
    const textColor = isFound ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400';
    const borderColor = isFound ? 'border-green-200 dark:border-green-900/30' : 'border-red-200 dark:border-red-900/30';

    if (!skills || skills.length === 0) {
        return <p className="text-sm text-gray-500 italic px-2">No {isFound ? 'matching' : 'missing'} skills found.</p>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={skill} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${bgColor} ${textColor} ${borderColor} text-sm font-medium capitalize`}
                >
                    <Icon size={16} />
                    {skill}
                </motion.div>
            ))}
        </div>
    );
};

export default SkillList;
