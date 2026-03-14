import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Navigation } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import UploadBox from '../components/UploadBox';
import { analyzeResume } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Analyze = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!file || !jobDescription) {
            setError("Please provide both a resume and a job description.");
            return;
        }

        setError(null);
        setIsAnalyzing(true);
        
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('job_description', jobDescription);

        try {
            const response = await analyzeResume(formData);
            if (response.data) {
                // Save locally so dashboard can pick it up immediately
                localStorage.setItem('latestAnalysis', JSON.stringify(response.data));
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.error || "An error occurred during analysis.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">Analyze Resume</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Upload your resume and paste the target job description to get AI-powered insights.</p>
            
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0 }}
                        className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/20 text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DashboardCard title="1. Upload Resume" className="h-full">
                    <UploadBox 
                        selectedFile={file} 
                        onFileSelect={setFile} 
                        onClear={() => setFile(null)} 
                    />
                </DashboardCard>

                <DashboardCard title="2. Job Description" className="h-full flex flex-col">
                    <textarea 
                        className="w-full flex-1 min-h-[16rem] p-4 text-sm leading-relaxed bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none text-gray-900 dark:text-gray-100" 
                        placeholder="Paste the complete job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>
                </DashboardCard>
            </div>

            <div className="flex justify-end mt-8">
                <button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing}
                    className="btn-primary px-10 py-4 text-lg shadow-lg shadow-primary-500/20"
                >
                    {isAnalyzing ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Bot size={24} />
                            </motion.div>
                            Analyzing Resume...
                        </>
                    ) : (
                        <>
                            <Navigation size={20} />
                            Analyze Match
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Analyze;
