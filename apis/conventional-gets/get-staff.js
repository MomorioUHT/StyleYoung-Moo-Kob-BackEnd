const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get all staff endpoint
 * Retrieves staff data excluding sensitive fields (password, token)
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
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
