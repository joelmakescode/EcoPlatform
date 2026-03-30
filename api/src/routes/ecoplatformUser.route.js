const express = require('express');
const router = express.Router();
const ecoplatformUserController = require('../controllers/ecoplatformUser.controller');

// Create New Ecoplatform User
router.post('/ecoplatform-user/register', ecoplatformUserController.createEcoplatformUser);

// Login User
router.post('/ecoplatform-user/login', ecoplatformUserController.loginEcoplatformUser);

// Get Ecoplatform User
router.get('/ecoplatform-user/:username', ecoplatformUserController.getEcoplatformUser);

module.exports = router;