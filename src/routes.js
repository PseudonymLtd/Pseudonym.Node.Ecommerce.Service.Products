const express = require('express');
const productsController = require('./controllers/products');

const router = express.Router();

router.get('/products', productsController.getProducts);
router.post('/products', productsController.postProducts);
router.put('/product', productsController.putProduct);
router.put('/product/:id', productsController.updateProduct);
router.get('/product/:id', productsController.getProduct);
router.delete('/product/:id', productsController.deleteProduct);

module.exports = router;