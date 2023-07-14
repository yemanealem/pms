const express = require('express');
const router = express.Router();
const ServiceType = require('../models/service_type');
const auth = require('../middlewares/verifyToken');

// Create a new service type
router.post('/add', auth.verifyToken, async (req, res) => {

  console.log(req.body.hasDefinedPrice)
  const service_type = new ServiceType({
    name: req.body.name,
    code: req.body.code,
    description: req.body.description,
    hasDefinedPrice: req.body.hasDefinedPrice,
    unitPrice: req.body.unitPrice
  });

  try {
    const newServiceType = await service_type.save();
    res.status(201).json(newServiceType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }









});

// Get all service types
router.get('/fetch', auth.verifyToken, async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find();
    res.json(serviceTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single service type
router.get('/fetch/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ServiceType.findById(id);
    res.status(200).json(data);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete a service type
router.delete('/delete/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ServiceType.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted succesfully" });
  }
  catch (error) {
    res.status(500).json({ message: err.message });
  }
})

//update a service type
router.put('/update/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const result = await ServiceType.findByIdAndUpdate(id, data, options);
    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})


module.exports = router;