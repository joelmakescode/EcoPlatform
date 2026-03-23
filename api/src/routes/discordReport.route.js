const express = require('express');
const router = express.Router();
const reportController = require('../controllers/discordReport.controller');

// Create New Report
router.post('/reports', reportController.createNewReport);

// Get Report Data
router.get('/reports/:messageId', reportController.getReportData);

// Update/Finish Report
router.patch('/reports', reportController.finishReport);

module.exports = router;