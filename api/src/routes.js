const express = require('express');
const router = express.Router();
const Scan = require('./models/Scan');
const TagStats = require('./models/TagStats');

// 1. The "Welcome Mat" (Fixes Cannot GET /api)
router.get('/', (req, res) => {
  res.send('RFID API is Online and Connected!');
});

// 2. The Scanner Endpoint (Saves to DB)
router.post('/scan', async (req, res) => {
  try {
    const { tag, deviceId, readerId, metadata } = req.body;
    if (!tag) return res.status(400).json({ error: 'tag required' });

    // A. Create the Scan Log
    const scan = await Scan.create({ tag, deviceId, readerId, metadata });

    // B. Update the Statistics (Count + Last Seen)
    await TagStats.findOneAndUpdate(
      { tag },
      { $inc: { total: 1 }, $set: { lastSeen: scan.ts } },
      { upsert: true, new: true }
    );

    console.log(`Saved scan for tag: ${tag}`);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// 3. The Dashboard Endpoint (View Top Tags)
router.get('/stats/top', async (req, res) => {
  try {
    const limit = 50;
    // Get tags sorted by most scans
    const stats = await TagStats.find().sort({ total: -1 }).limit(limit);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'stats error' });
  }
});

// 4. History Endpoint (View single tag history)
router.get('/tags/:tag/history', async (req, res) => {
  try {
    const scans = await Scan.find({ tag: req.params.tag }).sort({ ts: -1 }).limit(100);
    res.json(scans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'history error' });
  }
});

module.exports = router;