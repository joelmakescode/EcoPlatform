const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM stocks');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const stockResult = await pool.query('SELECT * FROM stocks WHERE id=$1', [req.params.id]);
  if (!stockResult.rows[0]) return res.status(404).json({ message: 'Stock nicht gefunden' });

  const historyResult = await pool.query('SELECT price, timestamp FROM stock_history WHERE stock_id=$1 ORDER BY timestamp DESC', [req.params.id]);

  res.json({ ...stockResult.rows[0], history: historyResult.rows });
});

router.post('/:id/price', auth, async (req, res) => {
  const { price } = req.body;
  try {
    await pool.query('UPDATE stocks SET current_price=$1 WHERE id=$2', [price, req.params.id]);
    await pool.query('INSERT INTO stock_history (stock_id, price) VALUES ($1, $2)', [req.params.id, price]);
    res.json({ message: 'Preis aktualisiert' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;