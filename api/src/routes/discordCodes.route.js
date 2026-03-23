const express = require("express");
const router = express.Router();
const discordCodesController = require('../controllers/discordCodes.controller');

// Create New Code
router.post('/discord-codes', discordCodesController.createNewCode);

// Select Data By Code
router.get('/discord-codes/:code', discordCodesController.getDiscordUserIdByCode);

// Remove Code
router.delete('/discord-codes', discordCodesController.deleteCode);

module.exports = router;