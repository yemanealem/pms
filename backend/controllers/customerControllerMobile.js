const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const Order = require('../models/order');
const Customer = require('../models/customer');
const { listenerCount } = require('../models/job_title');
const auth = require('../middlewares/verifyToken');
const nodemailer = require('nodemailer');


const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

router.post('/orders', auth.verifyToken, async (req, res) => {
  const email = req.body.email;


  try {
    const order = await Order.find({ 'customerAddress.email': email })
    if (order) {
      return res.status(200).json(order);
    } else {
      return res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {

  const { username, password } = req.body


  try {
    const user = await Customer.findOne({ username: username });

    if (user) {

      if (await bcrypt.compare(password, user.password)) {
        res.send({
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          jobTitleId: user.jobTitleId,
          userName: user.userName,
          profilePicture: user.profilePicture,
          token: createToken(user._id),
          password: user.password
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

router.post('/pop_notifications', auth.verifyToken, async (req, res) => {
  const userId = req.body.userId;
  const notificationId = req.body.notificationId;
  try {
    const customer = await Customer.findById(userId)
    if (customer) {
      if (req.body.status === 'Accepted') {
        const notification = customer.new_notifications.find(n => n._id.toString() === notificationId);

        if (!notification) {
          return res.status(404).json({ error: 'Notification not found' });
        }

        customer.old_notifications.push(notification);

        customer.new_notifications = customer.new_notifications.filter(n => n._id.toString() !== notificationId);

        await customer.save();


        return res.json(customer);
      }
      else return;
    } else {
      return res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update_status', auth.verifyToken, async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const itemId = req.body.itemId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.sendStatus(404).json({ error: 'Order not found' });;
    }
    const itemIndex = order.delivery.new_quantity.findIndex(item => item._id.toString() === itemId.toString());
    if (itemIndex === -1) {
      return res.sendStatus(404).json({ error: 'item not found' });;
    }
    order.delivery.new_quantity[itemIndex].status = 'accepted';
    order.delivery.quantity += order.delivery.new_quantity[itemIndex].quantity;
    order.delivery.new_quantity.splice(itemIndex, 1);
    if (order.delivery.quantity === order.cartItems.quantity) {
      order.delivery.status = 'completed'
    }
    await order.save();
    return res.json({ message: 'order item status updated to accepted' });
  } catch (err) {
    return res.sendStatus(500);
  }
});


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
  const user = await Customer.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // generate a random activation token
  const activationToken = Math.random().toString(36).substring(2, 15);

  user.activationToken = activationToken;
  await user.save();

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
      return res.json({ message: "Activation link sent to your email" });
    }
  });
});

router.post("/reset_password", async (req, res) => {
  const { activationToken, password } = req.body;

  const user = await Customer.findOne({ activationToken });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.activationToken = undefined;
  await user.save();

  return res.json({ message: "Password reset successfully" });
});

router.put('/change-password', auth.verifyToken, async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Fetch the user from the database
    const user = await Customer.findById(userId);

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



module.exports = router;