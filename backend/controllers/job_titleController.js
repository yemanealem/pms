const express = require('express');
const router = express.Router();
const Job_title = require('../models/job_title');
const auth = require('../middlewares/verifyToken');

router.post('/add', auth.verifyToken, async (req, res) => {
  const job_title = new Job_title({
    code: req.body.code,
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newJob = await job_title.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/fetch', auth.verifyToken, async (req, res) => {
  try {
    const items = await Job_title.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/fetch/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Job_title.findById(id);
    res.status(200).json(data);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/update/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const result = await Job_title.findByIdAndUpdate(id, data, options);
    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete('/delete/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Job_title.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted succesfully" });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;


