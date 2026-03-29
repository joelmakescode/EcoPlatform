const express = require('express');
const router = express.Router();
const ecoplatformUserController = require('../controllers/ecoplatformUser.controller');

// Create New Ecoplatform User
router.post('/ecoplatform-user', ecoplatformUserController.createEcoplatformUser);

// Get Ecoplatform User
router.get('/ecoplatform-user/:username', ecoplatformUserController.getEcoplatformUser);

module.exports = router;