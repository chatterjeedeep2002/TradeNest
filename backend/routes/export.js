const express = require('express');
const { auth } = require('../middleware/auth');
const Holdings = require('../model/HoldingsModel');
const Orders = require('../model/OrdersModel');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const router = express.Router();

router.get('/holdings/csv', auth, async (req, res) => {
  try {
    const data = await Holdings.find({}).lean();
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('holdings.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.get('/orders/csv', auth, async (req, res) => {
  try {
    const data = await Orders.find({}).lean();
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.get('/holdings/pdf', auth, async (req, res) => {
  try {
    const data = await Holdings.find({}).lean();
    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.attachment('holdings.pdf');
    doc.pipe(res);
    doc.fontSize(18).text('Holdings Report', { underline: true });
    doc.moveDown();
    data.forEach((row) => {
      doc.fontSize(12).text(JSON.stringify(row));
      doc.moveDown();
    });
    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
