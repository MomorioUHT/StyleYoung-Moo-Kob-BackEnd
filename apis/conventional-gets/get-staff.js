const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// This will not get the 'password' and 'token' field

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    s_id, 
                    s_firstname,
                    s_lastname,
                    s_username,
                    s_tel,
                    s_position,
                    s_lastlogin 
                FROM STAFF
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any staff found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
