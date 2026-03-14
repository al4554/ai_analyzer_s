const natural = require('natural');
const mlDistance = require('ml-distance');

// ─── Expanded Skill Database ───────────────────────────────────────────────
const SKILL_DB = [
    // Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "php",
    "go", "rust", "kotlin", "swift", "scala", "r",
    // Frontend
    "react", "vue", "angular", "nextjs", "html", "css", "sass",
    // Backend
    "node", "express", "django", "flask", "fastapi", "spring", "laravel",
    // DevOps & Cloud
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible",
    "jenkins", "github actions", "ci/cd", "linux",
    // Databases
    "mongodb", "sql", "mysql", "postgresql", "redis", "elasticsearch",
    "cassandra", "dynamodb", "sqlite",
    // AI/ML
    "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
    "pandas", "numpy", "data analysis", "nlp", "computer vision",
    // Architecture & Practices
    "rest api", "graphql", "microservices", "system design", "agile", "scrum",
    "git", "jira", "unit testing", "tdd"
];

// ─── Text Normalization ─────────────────────────────────────────────────────
const normalizeText = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')  // remove punctuation
        .replace(/\s+/g, ' ')
        .trim();
};

// ─── Section Analysis ───────────────────────────────────────────────────────
const analyzeSections = (text) => {
    const lower = text.toLowerCase();

    const sectionKeywords = {
        skills:     ['skills', 'technical skills', 'core competencies', 'technologies', 'expertise'],
        projects:   ['projects', 'personal projects', 'academic projects', 'portfolio', 'side projects'],
        experience: ['experience', 'work experience', 'employment', 'work history', 'internship', 'professional experience'],
        education:  ['education', 'academic background', 'qualifications', 'degree', 'university', 'college', 'bachelor', 'master'],
    };

    const scores = { skills: 0, projects: 0, experience: 0, education: 0 };

    for (const [section, keywords] of Object.entries(sectionKeywords)) {
        const found = keywords.some(kw => lower.includes(kw));
        if (!found) { scores[section] = 20; continue; } // section header missing

        // Score based on content richness in that section
        let contentScore = 40; // baseline for having the section

        if (section === 'skills') {
            const skillsFound = SKILL_DB.filter(s => lower.includes(s)).length;
            contentScore += Math.min(60, skillsFound * 6);
        } else if (section === 'experience') {
            const hasMetrics = /\d+[\+%]?\s*(years?|months?|users?|projects?|clients?|people|team|revenue|million|k\b)/i.test(text);
            const bulletCount = (text.match(/[•\-\*]\s+\w/g) || []).length;
            contentScore += hasMetrics ? 30 : 0;
            contentScore += Math.min(30, bulletCount * 3);
        } else if (section === 'projects') {
            const techMentions = SKILL_DB.filter(s => lower.includes(s)).length;
            contentScore += Math.min(60, techMentions * 5);
        } else if (section === 'education') {
            const hasDegree = /bachelor|master|phd|b\.tech|m\.tech|b\.e|m\.e|b\.sc|m\.sc/i.test(text);
            const hasGpa   = /gpa|cgpa|percentage|\d\.\d+/i.test(text);
            contentScore += hasDegree ? 30 : 0;
            contentScore += hasGpa    ? 10 : 0;
        }

        scores[section] = Math.min(100, contentScore);
    }

    return scores;
};

// ─── Main Analysis Function ─────────────────────────────────────────────────
const analyzeResume = (resumeText, jobDescription) => {

    // 1. Normalize
    const resumeNorm = normalizeText(resumeText);
    const jdNorm     = normalizeText(jobDescription);

    // 2. Skill Extraction
    const skills_found   = [];
    const missing_skills = [];

    SKILL_DB.forEach(skill => {
        const normSkill = normalizeText(skill);
        if (resumeNorm.includes(normSkill))                      skills_found.push(skill);
        else if (jdNorm.includes(normSkill))                     missing_skills.push(skill);
    });

    const totalSkills = skills_found.length + missing_skills.length;
    const skill_match_percentage = totalSkills === 0 ? 0 : skills_found.length / totalSkills;

    // 3. TF-IDF Cosine Similarity (fixed: tfidf.documents are plain objects, not Maps)
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();
    tfidf.addDocument(resumeNorm);
    tfidf.addDocument(jdNorm);

    // Use Object.keys() — NOT .keys() — because natural stores docs as plain objects
    const allTerms = new Set([
        ...Object.keys(tfidf.documents[0]),
        ...Object.keys(tfidf.documents[1])
    ]);
    const vocab = Array.from(allTerms);

    const resumeVec = vocab.map(term => tfidf.tfidf(term, 0));
    const jdVec     = vocab.map(term => tfidf.tfidf(term, 1));

    let similarity_score = 0;
    try {
        similarity_score = mlDistance.similarity.cosine(resumeVec, jdVec);
    } catch (e) {
        console.error('Cosine similarity error:', e.message);
    }
    if (isNaN(similarity_score) || !isFinite(similarity_score)) similarity_score = 0;

    // 4. Section Analysis
    const resume_strength = analyzeSections(resumeText);
    const section_strength_score = (
        resume_strength.skills +
        resume_strength.projects +
        resume_strength.experience +
        resume_strength.education
    ) / 400; // normalized 0–1

    // 5. Improved ATS Score Formula
    // ATS = (similarity × 60) + (skill_match × 25) + (section_strength × 15)
    let ats_score = (similarity_score * 60) + (skill_match_percentage * 25) + (section_strength_score * 15);
    ats_score = Math.round(Math.min(100, Math.max(0, ats_score)));

    // 6. Rule-Based Suggestions Engine
    const suggestions = [];

    if (missing_skills.length > 5) {
        suggestions.push(`Consider adding more technical skills relevant to the role. Missing: ${missing_skills.slice(0, 4).join(', ')} and more.`);
    } else if (missing_skills.length > 0) {
        suggestions.push(`Add these missing skills to align with the job: ${missing_skills.join(', ')}.`);
    }

    if (resume_strength.experience < 50) {
        suggestions.push('Add measurable achievements to your work experience (e.g., "Improved performance by 30%", "Led a team of 5").');
    }

    if (resume_strength.projects < 50) {
        suggestions.push('Include personal or academic projects demonstrating technical skills with links to GitHub or live demos.');
    }

    if (resume_strength.skills < 50) {
        suggestions.push('Expand your Skills section with specific tools, languages, and frameworks you know.');
    }

    if (resume_strength.education < 40) {
        suggestions.push('Add your degree, institution, GPA, and graduation year to the Education section.');
    }

    if (similarity_score < 0.3) {
        suggestions.push('Your resume vocabulary differs significantly from the job description — mirror key terms from the job posting.');
    }

    if (ats_score >= 80 && suggestions.length === 0) {
        suggestions.push('Great match! Your resume is well-tailored. Consider reviewing formatting and ensuring PDF exports cleanly.');
    }

    if (suggestions.length === 0) {
        suggestions.push('Your resume looks solid. Focus on quantifiable achievements to stand out further.');
    }

    return {
        ats_score,
        similarity_score: Number(similarity_score.toFixed(2)),
        skills_found,
        missing_skills,
        resume_strength,
        suggestions
    };
};

module.exports = { analyzeResume };
