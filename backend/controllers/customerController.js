const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const Customer = require('../models/customer');
const auth = require('../middlewares/verifyToken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}


router.get('/getall', auth.verifyToken, async (req, res) => {
  try {
    const customers = await Customer.find();
    const customersWithFullName = customers.map(customer => ({
      ...customer.toObject(),
      fullName: customer.fullName
    }));
    res.status(200).json(customersWithFullName);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getbyid/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Customer.findById(id);
    console.log(data)
    res.status(200).json(data);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.post('/add', auth.verifyToken, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const exists = await Customer.findOne({ username })
  if (exists) {
    res.status(404).send({ message: 'username aleardy exist' })
  }
  else {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const customer = new Customer({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      companyName: req.body.companyName,
      tinNum: req.body.tinNum,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      streetAdress: req.body.streetAdress,
      address: req.body.address,
      homeNumber: req.body.homeNumber,
      username: username,
      password: hashed
    });

    try {
      const newCustomer = await customer.save();
      res.status(201).json(newCustomer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});

router.delete('/delete/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Customer.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted succesfully" });
  }
  catch (error) {
    res.status(500).json({ message: err.message });
  }
})

router.put('/update/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const result = await Customer.findByIdAndUpdate(id, data, options);
    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;