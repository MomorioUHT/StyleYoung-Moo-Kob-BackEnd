module.exports = function validateApiKey(req, res, next) {
    const apiKey = req.headers['api-key'];
    const validKey = process.env.API_KEY;

    if (!apiKey) {
        return res.status(401).json({ error: 'no api key found' });
    }

    if (apiKey !== validKey) {
        return res.status(403).json({ error: 'invalid api key' });
    }

    next();
};
