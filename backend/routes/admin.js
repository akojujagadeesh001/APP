const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  const completedBookingsRow = db.prepare("SELECT COUNT(*) as count, SUM(final_price) as total_revenue FROM bookings WHERE status = 'completed'").get();
  
  const completedCount = completedBookingsRow.count;
  const totalRevenue = completedBookingsRow.total_revenue || 0;
  
  // Platform takes 15% commission
  const platformFees = totalRevenue * 0.15;
  const providerEarnings = totalRevenue - platformFees;

  res.json({
    totalBookings,
    completedBookings: completedCount,
    totalRevenue,
    platformFees,
    providerEarnings
  });
});

module.exports = router;
