const express = require("express");
const router = express.Router();
const discordFriendlistController = require('../controllers/discordFriendlist.controller');

// Create New Friend
router.post('/friendlist', discordFriendlistController.createNewFriend);

// Get Friendlist
router.get('/friendlist', discordFriendlistController.getFriendlist);

// Delete a Friend
router.delete('/friendlist', discordFriendlistController.deleteFriend);