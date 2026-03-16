// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { addUser } = require('../controllers/user_controller');

router.post('/', addUser);

module.exports = router;