const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all providers
router.get('/providers', (req, res) => {
  try {
    const providers = db.prepare("SELECT id, name, role, lat, lng FROM users WHERE role = 'provider'").all();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
