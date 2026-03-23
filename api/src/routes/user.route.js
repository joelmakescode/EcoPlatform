const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Create a New User
router.post('/users', userController.createUser);

// Get User Balance
router.get('/users/balance', userController.getUserBalance);

//Update User Balance
router.patch('/users/balance', userController.addUserBalance);

module.exports = router;