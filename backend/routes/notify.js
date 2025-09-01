const express = require('express');
const { auth } = require('../middleware/auth');
const Notification = require('../model/NotificationModel');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/register', auth, async (req, res) => {
  const { symbol, targetPrice, method } = req.body;
  try {
    const n = new Notification({ userId: req.user.id, symbol, targetPrice, method });
    await n.save();
    return res.json(n);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.post('/test-email', auth, async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 2525,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    });
    await transporter.sendMail({ from: process.env.SMTP_FROM || 'no-reply@tradenest.local', to, subject, text });
    return res.json({ msg: 'Email sent (or simulated)' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Failed to send email', err: err.message });
  }
});

module.exports = router;
