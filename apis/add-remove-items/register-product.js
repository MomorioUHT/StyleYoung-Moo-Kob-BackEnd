const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const validateApiKey = require('../../middleware/validate-api-key');
const generate = require('../../middleware/random-id');

module.exports = (pool) => {
    const router = express.Router();

    const uploadDir = path.join(__dirname, '../../uploads/products');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../../uploads/products')); 
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
            cb(null, filename);
        }
    });

    const upload = multer({ storage });

    // upload.single('p_picture')
    router.post('/', validateApiKey, upload.single('p_picture'), async (req, res) => {
        try {
            const product_name = req.body.product_name;
            const product_price = parseFloat(req.body.product_price);
            const product_weight = parseFloat(req.body.product_weight);
            const product_grade = parseInt(req.body.product_grade);

            // Duplicate
            const [rows] = await pool.query(`SELECT p_name FROM PRODUCT WHERE p_name = ?`, [product_name]);
            if (rows.length > 0) {
                return res.status(409).json({ message: 'this product already exists' });
            }

            // Generate id
            const random_id = generate();
            // Picture Path
            const pictureFile = req.file ? req.file.filename : null; // จะเก็บชื่อไฟล์ใน DB

            // Save to DB
            await pool.query(`
                INSERT INTO PRODUCT (p_id, p_name, p_price, p_grade, p_weight, p_quantity, p_picture)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [random_id, product_name, product_price, product_grade, product_weight, 0, pictureFile]
            );

            res.status(201).json({ message: 'product register successfully', p_picture: pictureFile });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
