const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get all supply logs endpoint
 * Retrieves supply log entries joined with supplier and ingredient information
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    s.supply_id,
                    s.sup_id,
                    sup.sup_name,
                    s.i_id,
                    i.i_name,
                    s.sup_quantity,
                    s.sup_date
                FROM SUPPLY s
                JOIN SUPPLIER sup ON s.sup_id = sup.sup_id
                JOIN INGREDIENT i ON s.i_id = i.i_id
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any supply logs found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
