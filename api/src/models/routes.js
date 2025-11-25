const express = require('express');
const router = express.Router();
const Scan = require('./models/Scan');
const TagStats = require('./models/TagStats');
const auth = require('./middleware/auth');

// POST /api/scan
router.post('/scan', auth, async (req, res) => {
  try {
    const { tag, deviceId, readerId, metadata } = req.body;
    if (!tag) return res.status(400).json({ error: 'tag required' });
    const scan = await Scan.create({ tag, deviceId, readerId, metadata });
    await TagStats.findOneAndUpdate(
      { tag },
      { $inc: { total: 1 }, $set: { lastSeen: scan.ts } },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /api/tags/:tag/history?limit=100
router.get('/tags/:tag/history', async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit||100), 1000);
    const scans = await Scan.find({ tag: req.params.tag }).sort({ ts: -1 }).limit(limit).exec();
    res.json(scans);
  });
  
  // GET /api/stats/top?days=7&limit=50
  router.get('/stats/top', async (req, res) => {
    const days = parseInt(req.query.days || 7);
    const limit = Math.min(parseInt(req.query.limit || 50), 500);
    const since = new Date(Date.now() - days*24*60*60*1000);
    const agg = await Scan.aggregate([
      { $match: { ts: { $gte: since } } },
      { $group: { _id: "$tag", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);
    res.json(agg);
});

module.exports = router;
