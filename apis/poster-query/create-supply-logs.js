const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// This wil create supply logs using sup_id and i_id as a foreign keys
// WARNING!: This will also updates the ingredients table! Careful EIEI

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const input_supplier_id = req.body.supplier_id;
            const input_ingredient_id = req.body.ingredient_id;
            const input_supply_quantity = parseInt(req.body.supply_quantity);

            const [result] = await pool.query(
                `INSERT INTO SUPPLY (sup_id, i_id, sup_quantity, sup_date)
                 VALUES (?, ?, ?, NOW())`,
                [input_supplier_id, input_ingredient_id, input_supply_quantity]
            );

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'failed to create supply logs' });
            }

            // Update existing INGREDIENT
            await pool.query(`
                UPDATE INGREDIENT
                SET i_amount = i_amount + ?
                WHERE i_id = ?;`,
                [input_supply_quantity, input_ingredient_id]
            );

            res.json({ message: 'supply log created successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Database error' });
        }
    });

    return router;
};