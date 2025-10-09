const express = require('express');

const validateApiKey = require('../../middleware/validate-api-key');
const generate = require('../../middleware/random-id');

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const supplier_name = req.body.supplier_name;
            const supplier_tel = req.body.supplier_tel;
            const supplier_address = req.body.supplier_address;

            // Check if any duplicate supplier name
            const [rows] = await pool.query(`SELECT sup_name FROM SUPPLIER WHERE sup_name = ?`, [supplier_name]);
            if (rows.length > 0) {
                return res.status(409).json({ message: 'this supplier already exists'})
            }

            // Generate an id for that supplier
            const random_id = generate();

            // Save to database
            const [result] = await pool.query(`
                INSERT INTO SUPPLIER (sup_id, sup_name, sup_tel, sup_address)
                VALUES (?, ?, ?, ?)`,
                [random_id, supplier_name, supplier_tel, supplier_address]
            );

            res.status(201).json({ message: 'supplier register successfully'})

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
