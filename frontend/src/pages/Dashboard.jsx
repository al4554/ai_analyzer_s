import { useState, useEffect } from 'react';
import { Target, FileCheck, BrainCircuit, Activity, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import ResumeStrengthChart from '../components/ResumeStrengthChart';
import DashboardCard from '../components/DashboardCard';
import SkillList from '../components/SkillList';
import SuggestionsPanel from '../components/SuggestionsPanel';
import { getHistory } from '../services/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [latestAnalysis, setLatestAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                // Try to get latest from history
                const history = await getHistory();
                if (history && history.length > 0) {
                    setLatestAnalysis(history[0]);
                }
            } catch (error) {
                console.error("Failed to fetch history API, falling back to local storage if available", error);
                const localData = localStorage.getItem('latestAnalysis');
                if (localData) {
                    setLatestAnalysis(JSON.parse(localData));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="text-primary-600"
                    >
                        <Activity size={48} />
                    </motion.div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!latestAnalysis) {
        return (
            <div className="max-w-7xl mx-auto space-y-6">
                 <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8">Dashboard Overview</h1>
                 <DashboardCard className="text-center py-24">
                     <BrainCircuit size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                     <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Analysis Found</h3>
                     <p className="text-gray-500 dark:text-gray-400 mb-6">Upload a resume to get deep AI insights, ATS scoring, and more.</p>
                     <a href="/analyze" className="btn-primary inline-flex">Analyze a Resume</a>
                 </DashboardCard>
            </div>
        );
    }

    const { 
        ats_score = 0, 
        similarity_score = 0, 
        skills_found = [], 
        missing_skills = [], 
        resume_strength = { skills: 0, projects: 0, experience: 0, education: 0 },
        suggestions = [] 
    } = latestAnalysis || {};

    const avgStrength = Math.round((resume_strength.skills + resume_strength.projects + resume_strength.experience + resume_strength.education) / 4);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">Dashboard Overview</h1>
            
            {/* Top section: Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="ATS Score" 
                    value={ats_score} 
                    subtitle="/ 100"
                    icon={Target}
                />
                <StatCard 
                    title="Semantic Match" 
                    value={(similarity_score * 100).toFixed(0) + "%"} 
                    subtitle="Similarity"
                    icon={FileCheck}
                />
                <StatCard 
                    title="Resume Strength" 
                    value={avgStrength}
                    subtitle="/ 100"
                    icon={BrainCircuit}
                />
            </div>

            {/* Middle section: Strength Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ResumeStrengthChart strength={resume_strength || { skills: 0, projects: 0, experience: 0, education: 0 }} />
                </div>
                
                <DashboardCard title="Quick Insights" className="h-full">
                    <div className="space-y-6">
                        <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-900/20">
                            <div className="flex items-center gap-3 mb-2 text-primary-700 dark:text-primary-400">
                                <AlertCircle size={20} />
                                <span className="font-bold">Top Recommendation</span>
                            </div>
                            <p className="text-sm text-primary-800 dark:text-primary-300 leading-relaxed font-medium">
                                {suggestions && suggestions.length > 0 ? suggestions[0] : "Focus on tailoring your skills to the JD."}
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Summary</h4>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Skills Identified</span>
                                <span className="font-bold text-gray-900 dark:text-gray-100">{skills_found?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Missing Keywords</span>
                                <span className="font-bold text-red-500">{missing_skills?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* Bottom section: Skills and Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <DashboardCard title="Missing Skills Analysis">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3">Critical Missing Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {missing_skills && missing_skills.length > 0 ? (
                                        missing_skills.map((skill) => (
                                            <span key={skill} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-full text-xs font-bold transition-colors hover:bg-red-100">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No missing skills detected matching the JD.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-3">Skills Found</h4>
                                <SkillList skills={skills_found} type="found" />
                            </div>
                        </div>
                    </DashboardCard>
                </div>
                
                <div className="lg:col-span-3">
                    <DashboardCard title="AI Recommendations">
                        <SuggestionsPanel suggestions={suggestions} />
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
