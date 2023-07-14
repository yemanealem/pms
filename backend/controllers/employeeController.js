const express = require('express');
const router = express.Router();
const multer = require('multer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');


const Employee = require('../models/employee');
const auth = require('../middlewares/verifyToken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const DIR = './images/'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR)
  },
  filename: (req, file, cb) => {

    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
})



router.get('/getall', auth.verifyToken, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getbyid/:id', auth.verifyToken, async (req, res) => {

  try {
    const id = req.params.id;
    const data = await Employee.findById(id);
    res.status(200).json(data);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
})


router.post('/add', auth.verifyToken, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const exists = await Employee.findOne({ username })
  if (exists) {
    res.status(404).send({ message: 'username aleardy exist' })
  }
  else {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)


    const employee = new Employee({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      jobTitleId: req.body.jobTitleId,
      address: req.body.address,
      remark: req.body.remark,
      username: username,
      password: hashed
    })
    try {
      const newEmployee = await employee.save();
      // const employeesWithFullName = customers.map(employee => ({
      //   ...employee.toObject(),
      //   fullName: employee.fullName
      // }));
      res.status(200).json(newEmployee);

    } catch (err) {
      console.log(err)
      res.status(400).json({ message: err.message });
    }
  }
});

router.post('/login', async (req, res) => {

  const { username, password } = req.body


  try {
    const user = await Employee.findOne({ username: username });


    if (user) {

      if (await bcrypt.compare(password, user.password)) {
        res.send({
          _id: user._id,
          firstName: user.firstName,
          username: user.username,
          email: user.email,
          jobTitleId: user.jobTitleId,
          userName: user.userName,
          profilePicture: user.profilePicture,
          token: createToken(user._id),
          password: user.password,
          lastName: user.lastName,
          middleName: user.middleName

        });
        return;
      }
      else {
        res.status(401).send({ message: 'Password is not correct' });
        return
      }
    }

    res.status(401).send({ message: 'Invalid User Name' });



  }
  catch (error) {

    res.status(500).send({ mssg: error.message });

  }


})


router.put('/change-profile', upload.single('profilePicture'), auth.verifyToken, async (req, res) => {
  try {
    const { userId, username } = req.body;
    const url = req.protocol + '://' + req.get('host')




    // If a profile picture was uploaded, save the filename to the profilePicture variable
    if (req.file) {
      profilePicture = url + '/images/' + req.file.filename;
    }

    const updatedUser = await Employee.findByIdAndUpdate(
      userId,
      { $set: { profilePicture, username } },
      { new: true }

    );

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {

    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.put('/change-password', auth.verifyToken, async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Fetch the user from the database
    const user = await Employee.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the current password with the password stored in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password and save it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {

    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/delete/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Employee.findByIdAndDelete(id);
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
    const result = await Employee.findByIdAndUpdate(id, data, options);
    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'haftomtek23@gmail.com',
    pass: 'wdgxtawxjihhxham'
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await Employee.findOne({ email });

  if (!user) {
    res.status(401).send({ message: 'Your email is does not exist' });
  }

  // generate a random activation token
  const activationToken = Math.random().toString(36).substring(2, 15);

  // store the activation token in the user document
  user.activationToken = activationToken;
  await user.save();
  console.log(user);

  // send the activation link to the user's email
  const mailOptions = {
    from: "haftomtek2323@gmail.com",
    to: user.email,
    subject: "Password Reset",
    text: `Please click on this link to reset your password: http://localhost:3000/reset_password?activationToken=${activationToken}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    } else {
      console.log("Email sent: " + info.response);
      return res.json({ message: "Activation link sent to your email" });
    }
  });
});

router.post("/reset-password", async (req, res) => {
  const { password, activationToken } = req.body;
  const user = await Employee.findOne({ activationToken });
  if (!user) {
    res.status(401).send({ message: 'User not found' });
  }

  // hash the new password with salt=10
  const hashedPassword = await bcrypt.hash(password, 10);

  // update the user document with the new password and remove the activation token
  user.password = hashedPassword;
  user.activationToken = undefined;
  await user.save();

  return res.json({ message: "Password reset successfully" });
});

module.exports = router;