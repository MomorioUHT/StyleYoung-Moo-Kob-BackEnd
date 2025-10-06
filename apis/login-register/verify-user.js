const express = require('express');
const jwt = require('jsonwebtoken');
const validateApiKey = require('../../middleware/validate-api-key');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// Momorio's Note
// DeTokenizer from token to find a customer or staff

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
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

                // Fetch all possible user from database
                const [customerResult, staffResult] = await Promise.all([
                    pool.query(
                        'SELECT c_id, c_firstname, c_lastname, c_username, c_tel, c_address FROM CUSTOMER WHERE c_id = ?',
                        [decoded.sub]
                    ),
                    pool.query(
                        'SELECT s_id, s_firstname, s_lastname, s_username, s_position FROM STAFF WHERE s_id = ?',
                        [decoded.sub]
                    )
                ]);

                const customer = customerResult[0];
                const staff = staffResult[0];

                if (customer.length === 0 && staff.length === 0) {
                    return res.status(404).json({ error: 'user not found' });
                }

                const returnUser = staff.length > 0 ? staff[0] : customer[0];

                return res.status(200).json({
                    message: 'token value',
                    user: returnUser,
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
