const stockService = require('../services/stocks_service');

async function getAllStocks(req, res) {
    try {
        const stocks = await stockService.getAllStocks();
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { getAllStocks };