const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/charge', auth, async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ msg: 'Amount required' });
  return res.json({ success: true, id: 'pay_' + Date.now(), amount });
});

module.exports = router;
