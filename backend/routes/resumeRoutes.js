const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const resumeController = require('../controllers/resumeController');

router.post('/analyze-resume', upload.single('resume'), resumeController.analyzeResumeEndpoint);
router.get('/history', resumeController.getHistory);

module.exports = router;
