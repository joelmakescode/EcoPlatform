const express = require("express");
const router = express.Router();

const discordUserRoutes = require("./discordUser.route");
const discordGuildLogsRoutes = require('./discordGuildLogs.route');
const reportRoutes = require("./report.route");
const userRoutes = require("./user.route");


// Discord Users
router.use(discordUserRoutes);

// Guild Logs
router.use(discordGuildLogsRoutes);

//Reports
router.use(reportRoutes);

// Users
router.use(userRoutes);

module.exports = router;