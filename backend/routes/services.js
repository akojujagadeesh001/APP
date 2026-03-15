const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const services = db.prepare('SELECT * FROM services').all();
  res.json(services);
});

module.exports = router;
