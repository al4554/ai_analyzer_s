import { useState, useCallback } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadBox = ({ onFileSelect, selectedFile, onClear }) => {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all ${
                            isDragActive 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx"
                        />
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud size={32} />
                            </div>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-bold text-primary-600 dark:text-primary-400">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">PDF or DOCX (MAX. 5MB)</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between p-4 border border-primary-200 dark:border-primary-900/30 bg-primary-50 dark:bg-primary-900/10 rounded-xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-lg shadow-sm">
                                <File size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1 italic">"{selectedFile.name}"</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze</p>
                            </div>
                        </div>
                        <button
                            onClick={onClear}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UploadBox;
