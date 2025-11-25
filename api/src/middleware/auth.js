// simple API key middleware
module.exports = (req, res, next) => {
    const key = req.get('x-api-key') || req.query.api_key;
    if (!key || key !== process.env.API_KEY) return res.status(401).json({ error: 'unauthorized' });
    next();
  };
  