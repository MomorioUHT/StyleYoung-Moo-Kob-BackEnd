const express = require('express');
const jwt = require('jsonwebtoken');
const validateApiKey = require('../../middleware/validate-api-key');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Missing or invalid Authorization header' });
            }

            // Get the token
            const token = authHeader.split(' ')[1];

            // Verify the token
            jwt.verify(token, JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ error: 'invalid or expired token' });
                }

                // Fetch user from database
                const [rows] = await pool.query(
                    'SELECT c_id, c_firstname, c_lastname, c_username, c_tel, c_address FROM CUSTOMER WHERE c_id = ?',
                    [decoded.sub]
                );

                if (rows.length === 0) {
                    return res.status(404).json({ error: 'user not found' });
                }

                return res.status(200).json({
                    message: 'token value',
                    user: rows[0],
                    issued_at: new Date(decoded.iat * 1000),
                    expires_at: new Date(decoded.exp * 1000)
                });
            });
        } catch (err) {
            console.error('verify-me error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
