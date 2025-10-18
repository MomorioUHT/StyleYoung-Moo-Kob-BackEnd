/**
 * Middleware to validate API key from request headers
 * Checks if the 'api-key' header matches the expected API_KEY from environment variables
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with error if validation fails, otherwise calls next()
 */
module.exports = function validateApiKey(req, res, next) {
    const apiKey = req.headers['api-key'];
    const validKey = process.env.API_KEY;

    // Check if API key is provided
    if (!apiKey) {
        return res.status(401).json({ error: 'no api key found' });
    }

    // Validate API key
    if (apiKey !== validKey) {
        return res.status(403).json({ error: 'invalid api key' });
    }

    next();
};
