require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// In serverless, we might be mounting this app under /api
app.use('/api', resumeRoutes);

// Database connection is usually handled per-request in serverless 
// but we can call it here or in the entry point.
connectDB();

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

