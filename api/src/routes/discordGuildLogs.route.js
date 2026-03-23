const express = require("express");
const router = express.Router();
const discordGuildLogsController = require('../controllers/discordGuildLogs.controller');

// Create New Guild Log Channel
router.post('/guild-logs', discordGuildLogsController.createNewGuildLogChannel)

// Get Guild Log Channel By GuildId
router.get('/guild-logs/:guildId', discordGuildLogsController.getGuildLogChannel);

// Update Guild Log Channel
router.patch('/guild-logs', discordGuildLogsController.removeOrUpdateGuildLogChannel);

module.exports = router;
