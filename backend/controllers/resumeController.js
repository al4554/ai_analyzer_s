const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const analysisService = require('../services/analysisService');
const Analysis = require('../models/Analysis');

const analyzeResumeEndpoint = async (req, res) => {
    try {
        const { job_description } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Please upload a resume file.' });
        }

        if (!job_description) {
            return res.status(400).json({ error: 'Please provide a job description.' });
        }

        let resumeText = '';

        // Extract text based on file type
        if (file.mimetype === 'application/pdf') {
            const pdfData = await pdfParse(file.buffer);
            resumeText = pdfData.text;
        } else if (
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.mimetype === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            resumeText = result.value;
        } else {
             return res.status(400).json({ error: 'Unsupported file format.' });
        }

        if (!resumeText || resumeText.trim() === '') {
             return res.status(400).json({ error: 'Could not extract text from the uploaded file.' });
        }

        // Run Analysis
        const analysisResults = analysisService.analyzeResume(resumeText, job_description);

        // Save to Database
        const analysisRecord = new Analysis({
            resume_name: file.originalname,
            ats_score: analysisResults.ats_score,
            similarity_score: analysisResults.similarity_score,
            skills_found: analysisResults.skills_found,
            missing_skills: analysisResults.missing_skills,
            resume_strength: analysisResults.resume_strength,
            job_description: job_description
        });

        await analysisRecord.save();

        res.status(200).json({
            message: 'Analysis complete',
            data: analysisResults
        });

    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ error: 'An error occurred during resume analysis.', details: error.message });
    }
};

const getHistory = async (req, res) => {
    try {
        const history = await Analysis.find().sort({ created_at: -1 });
        res.status(200).json(history);
    } catch (error) {
         console.error('Error fetching history:', error);
         res.status(500).json({ error: 'An error occurred fetching history.' });
    }
}

module.exports = {
    analyzeResumeEndpoint,
    getHistory
};
