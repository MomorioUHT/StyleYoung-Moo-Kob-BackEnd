const express = require('express');

module.exports = (pool) => {
    const router = express.Router();

    // router.get('/', async (req, res) => {
    //     try {
    //         const [rows] = await pool.query('SELECT * FROM users'); // ตัวอย่าง query
    //         res.json(rows);
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ error: 'Database error' });
    //     }
    // });

    router.get('/', (req, res) => {
        res.send('API TEST');
    });

    return router;
};
