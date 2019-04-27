const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Product = require('../models/product');
const ProductsController = require('../controllers/products');

//GET
router.get('/', ProductsController.products_get_all);

//POST
router.post('/', checkAuth, ProductsController.products_create_product);

// Get with ID
router.get('/:productId', ProductsController.products_get_product);

// PATCH
router.patch(
  '/:productId',
  checkAuth,
  ProductsController.products_update_product
);
// DELETE
router.delete(
  '/:productId',
  checkAuth,
  ProductsController.products_delete_product
);

module.exports = router;
