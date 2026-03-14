import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const SuggestionsPanel = ({ suggestions }) => {
    if (!suggestions || suggestions.length === 0) {
        return <p className="text-sm text-gray-500 italic">No suggestions provided.</p>;
    }

    return (
        <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="flex items-start gap-4 p-5 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20 shadow-sm"
                >
                    <div className="mt-0.5 text-amber-500 dark:text-amber-400 bg-white dark:bg-gray-900 p-1.5 rounded-lg shadow-sm">
                        <Lightbulb size={20} />
                    </div>
                    <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed font-semibold">
                        {suggestion}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

export default SuggestionsPanel;
