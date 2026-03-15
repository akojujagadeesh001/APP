const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get bookings based on role
router.get('/', authMiddleware, (req, res) => {
  const { role, id: userId } = req.user;
  
  let bookings;
  if (role === 'customer') {
    bookings = db.prepare(`
      SELECT b.*, s.name as service_name, s.category as service_category, u.name as provider_name 
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.provider_id = u.id
      WHERE b.customer_id = ?
      ORDER BY b.id DESC
    `).all(userId);
  } else if (role === 'provider') {
    // Providers see available (pending) jobs, and jobs they have accepted
    bookings = db.prepare(`
      SELECT b.*, s.name as service_name, s.category as service_category, u.name as customer_name 
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.customer_id = u.id
      WHERE b.status = 'pending' OR b.provider_id = ?
      ORDER BY b.id DESC
    `).all(userId);
  } else if (role === 'admin') {
    bookings = db.prepare(`SELECT * FROM bookings ORDER BY id DESC`).all();
  }

  res.json(bookings);
});

// Create booking (Customer only)
router.post('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).json({ error: 'Forbidden' });

  const { service_id, date, time, address, details } = req.body;
  
  // Get service estimate
  const service = db.prepare('SELECT price_estimate FROM services WHERE id = ?').get(service_id);
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const insert = db.prepare(`
    INSERT INTO bookings (customer_id, service_id, status, date, time, address, details, final_price) 
    VALUES (?, ?, 'pending', ?, ?, ?, ?, ?)
  `);
  
  const info = insert.run(req.user.id, service_id, date, time, address, details, service.price_estimate);
  res.status(201).json({ id: info.lastInsertRowid, message: 'Booking created' });
});

// Update booking (Provider accept/complete, Customer rate)
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { action, rating } = req.body; // action: 'accept', 'complete', 'rate'
  const { role, id: userId } = req.user;

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (role === 'provider' && action === 'accept') {
    if (booking.status !== 'pending') return res.status(400).json({ error: 'Job not available' });
    db.prepare("UPDATE bookings SET provider_id = ?, status = 'accepted' WHERE id = ?").run(userId, id);
    res.json({ message: 'Job accepted' });
  } 
  else if (role === 'provider' && action === 'complete') {
    if (booking.status !== 'accepted' || booking.provider_id !== userId) return res.status(400).json({ error: 'Cannot complete this job' });
    db.prepare("UPDATE bookings SET status = 'completed' WHERE id = ?").run(id);
    res.json({ message: 'Job completed' });
  }
  else if (role === 'customer' && action === 'rate') {
    if (booking.status !== 'completed' || booking.customer_id !== userId) return res.status(400).json({ error: 'Cannot rate this job' });
    db.prepare("UPDATE bookings SET rating = ? WHERE id = ?").run(rating, id);
    res.json({ message: 'Rating added' });
  }
  else {
    res.status(400).json({ error: 'Invalid action' });
  }
});

module.exports = router;
