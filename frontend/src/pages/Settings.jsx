import { useState, useEffect } from 'react';
import { Moon, Sun, Sliders, Trash2, CheckCircle } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
    const [weights, setWeights] = useState(() => {
        const saved = localStorage.getItem('analysisWeights');
        return saved ? JSON.parse(saved) : { skill: 25, experience: 40, projects: 35 };
    });
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const handleSaveWeights = () => {
        localStorage.setItem('analysisWeights', JSON.stringify(weights));
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
    };

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear your locally stored analysis data?")) {
            localStorage.removeItem('latestAnalysis');
            alert("Local analysis data cleared.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Customize your analysis experience and manage your data.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Settings */}
                <DashboardCard title="Appearance" className="h-full">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${darkMode ? 'bg-primary-600' : 'bg-gray-200'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                </DashboardCard>

                {/* Data Management */}
                <DashboardCard title="Data Management" className="h-full">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage your locally stored analysis history and preferences.
                        </p>
                        <button
                            onClick={handleClearHistory}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <Trash2 size={18} />
                            Clear Local Analysis History
                        </button>
                    </div>
                </DashboardCard>

                {/* Analysis Preferences */}
                <DashboardCard title="Analysis Weights" className="md:col-span-2">
                    <div className="space-y-6 max-w-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Adjust how much each category affects your overall ATS Score. (Total should aim for 100%)
                        </p>
                        
                        <div className="space-y-4">
                            {[
                                { key: 'skill', label: 'Skill Match Weight', icon: CheckCircle },
                                { key: 'experience', label: 'Experience Weight', icon: Sliders },
                                { key: 'projects', label: 'Projects Weight', icon: Trash2 }
                            ].map(({ key, label }) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <label className="text-gray-700 dark:text-gray-300">{label}</label>
                                        <span className="text-primary-600">{weights[key]}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={weights[key]}
                                        onChange={(e) => setWeights({ ...weights, [key]: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                            <button
                                onClick={handleSaveWeights}
                                className="btn-primary px-6"
                            >
                                Save Preferences
                            </button>
                            <AnimatePresence>
                                {showSaved && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-green-600 text-sm font-medium flex items-center gap-1"
                                    >
                                        <CheckCircle size={16} />
                                        Saved successfully
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};

export default Settings;
