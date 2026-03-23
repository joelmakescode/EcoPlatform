const express = require('express');
const router = express.Router();
const discordAdminChannelsController = require('../controllers/discordAdminChannels.controller');

// Create Admin Channel
router.post('/discord-admin-channels', discordAdminChannelsController.createAdminChannel)

// Get Admin Channel
router.get('/discord-admin-channels/:channelName', discordAdminChannelsController.getAdminChannelIdByName);

// Update Admin Channel
router.patch('/discord-admin-channels', discordAdminChannelsController.patchChannelIdByName)

module.exports = router;