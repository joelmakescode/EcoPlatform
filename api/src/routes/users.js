const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
require('dotenv').config();

router.post('/register', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [username]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, balance FROM users WHERE id=$1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'User nicht gefunden' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/balance', auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE id=$2 RETURNING id, username, balance',
      [amount, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;