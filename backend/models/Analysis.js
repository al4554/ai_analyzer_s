const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    resume_name: {
        type: String,
        required: true
    },
    ats_score: {
        type: Number,
        required: true
    },
    similarity_score: {
        type: Number,
        required: true
    },
    skills_found: [{
        type: String
    }],
    missing_skills: [{
        type: String
    }],
    resume_strength: {
        skills:     { type: Number, default: 0 },
        projects:   { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        education:  { type: Number, default: 0 }
    },
    job_description: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Analysis', analysisSchema);
