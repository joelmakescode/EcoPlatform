const express = require('express');
const router = express.Router();
const discordUserController = require('../controllers/discordUser.controller');

// Create New User
router.post('/discord-users', discordUserController.createDiscordUser);

// Get a User
router.get('/discord-users', discordUserController.getUserByDiscordId);

// Update Discord User Autofill
router.patch('/discord-users/autofill', discordUserController.updateDiscordUserAutofill);

// Update Discord User Language
router.patch('/discord-users/language', discordUserController.updateDiscordUserLanguage);

// Update Discord User Password
router.patch('/discord-users/password', discordUserController.updateDiscordUserPasswordHash);


module.exports = router;
