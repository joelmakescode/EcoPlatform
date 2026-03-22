const express = require("express");
const router = express.Router();

const discordAdminChannelsRoutes= require('./discordAdminChannels.route');
const discordCodeRoutes         = require('./discordCodes.route');
const discordFriendlistsRoutes  = require("./discordFriendlist.route");
const discordGuildLogsRoutes    = require('./discordGuildLogs.route');
const discordReportRoutes       = require("./discordReport.route");
const discordUserRoutes         = require("./discordUser.route");
const userRoutes                = require("./user.route");

//Discord Admin Channels
router.use(discordAdminChannelsRoutes);

// Discord Codes
router.use(discordCodeRoutes)

// Discord Friendlists
router.use(discordFriendlistsRoutes)

// Discord Guild Logs
router.use(discordGuildLogsRoutes);

// Discord Reports
router.use(discordReportRoutes);

// Discord Users
router.use(discordUserRoutes);

// Users
router.use(userRoutes);

module.exports = router;