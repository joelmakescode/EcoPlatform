const express = require("express");
const router = express.Router();
const discordGuildLogsController = require('../controllers/discordGuildLogs.controller');

// Create New Guild Log Channel
router.post('/guild-logs', discordGuildLogsController.createNewGuildLogChannel)

// Update Guild Log Channel
router.patch('/guild-logs', discordGuildLogsController.removeOrUpdateGuildLogChannel);

module.exports = router;
