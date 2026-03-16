const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocks_controller');

router.get('/', stocksController.getAllStocks)

module.exports = router;