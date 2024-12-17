const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/create-product', verifyToken, productController.createProduct);
router.post('/get-product', verifyToken, productController.getAllProducts);
router.post('/update-product/:id', verifyToken, productController.updateProduct);
router.delete('/delete-product/:id', verifyToken, productController.deleteProduct);

module.exports = router;
