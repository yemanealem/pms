const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const auth = require('../middlewares/verifyToken');


// Get all products
router.get('/getall', auth.verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product
router.get('/getone/:id', auth.verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a product
router.post('/add', auth.verifyToken, async (req, res) => {
  console.log('server', req.body)
  const product = new Product({
    code: req.body.code,
    name: req.body.name,
    quantity: req.body.quantity,
    unitPrice: req.body.unitPrice,
    measurement: req.body.measurement,
    description: req.body.description,
    serviceType: req.body.serviceType
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/delete/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted succesfully" });
  }
  catch (error) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/update/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const result = await Product.findByIdAndUpdate(id, data, options);
    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
