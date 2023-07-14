const express = require('express');
const router = express.Router();
const Stoke = require('../models/stoke');
const auth = require('../middlewares/verifyToken');

// Get all stoke transactions
router.get('/getall', auth.verifyToken, async (req, res) => {
  try {
    const entries = await Stoke.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single Stoke entry by ID
router.get('/getone/:id', auth.verifyToken, async (req, res) => {
  try {
    const stock = await Stoke.findById(req.params.id);
    if (!stock) {
      return res.status(404).send();
    }
    res.send(stock);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Create a new Stoke entry
router.post('/add', auth.verifyToken, async (req, res) => {
  const entry = new Stoke({
    productId: req.body.productId,
    balanceIn: req.body.balanceIn,
    balanceOut: req.body.balanceOut,
    date: req.body.date,
    createdBy: req.body.createdBy
  });

  try {
    const newEntry = await entry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



router.delete('/delete/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Stoke.findByIdAndDelete(id);
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
    const result = await Stoke.findByIdAndUpdate(id, data, options);
    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


