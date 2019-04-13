const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//GET
router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          };
        })
      };
      // if (docs.length >= 0) {
      res.status(200).json(response);
      // } else {
      //   res.status(400).json({
      //     message: 'No Entries found'
      //   });
      // }
    })
    .catch(err => {
      console.log('Logged Output: err', err);
      res.json(500).json({
        error: err
      });
    });
});

//POST
router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created Product successfully',
        createProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Get with ID
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
      console.log('From Database', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + doc._id
          }
        });
      } else {
        res
          .status(404)
          .json({ message: 'No Valid entry found for provided ID' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// PATCH
router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update(
    { _id: id },
    // { $set: { name: req.body.newName, price: req.body.newPrice } }
    { $set: updateOps }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      });
    })
    .catch(err => {
      console.log('Logged Output: err', err);
      res.status(500).json({
        error: err
      });
    });
});
// DELETE
router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: { name: 'String', price: 'Number' }
        }
      });
    })
    .catch(err => {
      console.log('Logged Output: err', err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
