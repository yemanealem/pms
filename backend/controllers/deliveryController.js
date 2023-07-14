const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const Order = require('../models/order');
const Employee = require('../models/employee')
const auth = require('../middlewares/verifyToken')
const Customer = require('../models/customer')


const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

router.post('/assigned', auth.verifyToken, async (req, res) => {
  const username = req.body.username;


  try {

    const order = await Order.find({ 'delivery.username': username }).select('cartItems.serviceType customerAddress.fullName customerAddress.address customerAddress.streetAdress totalPrice delivery.quantity delivery.status delivery.new_quantity delivery.username').exec();
    if (order) {
      return res.status(200).json(order);
    } else {
      return res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/getById/:id', auth.verifyToken, async (req, res) => {
  const userId = req.params.id;
  const user = await Employee.findOne({ _id: userId }).exec();

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // return user details
  return res.json(user);
});

router.put('/editProfile/:id', auth.verifyToken, async (req, res) => {
  const userId = req.params.id;
  console.log("data", req.body)
  const updateUser = await Employee.updateMany({ _id: userId }, req.body).exec()
  console.log("www", updateUser)
  if (updateUser.modifiedCount == 1) {
    res.status(200).json({ success: true })
  }
})

router.post('/login', async (req, res) => {

  const { username, password } = req.body


  try {
    const user = await Employee.findOne({ username: username });


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
    const employee = await Employee.findById(userId)

    const notification = employee.new_notifications.find(n => n._id.toString() === notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    employee.old_notifications.push(notification);

    employee.new_notifications = employee.new_notifications.filter(n => n._id.toString() !== notificationId);

    await employee.save();

    return res.json(employee);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update_status', auth.verifyToken, async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const itemId = req.body.itemId;
    console.log(orderId, itemId)

    const order = await Order.findById(orderId);
    if (!order) {
      return res.sendStatus(404).json({ error: 'order not found' });
    }
    const itemIndex = order.delivery.new_quantity.findIndex(item => item._id.toString() === itemId.toString());
    console.log('item Index', itemIndex)
    if (itemIndex === -1) {
      return res.sendStatus(404).json({ error: 'item not found' });;
    }

    order.delivery.new_quantity[itemIndex].status = 'delivered';
    console.log(order.customerAddress.username)
    customer = await Customer.findOne({ username: order.customerAddress.username }).exec();
    console.log(customer)
    customer.new_notifications.push({ content: ` Dear ${customer.username}, it is reported that ${order.delivery.new_quantity[itemIndex].quantity} items of your order is/are delivered, click here to confirm`, orderId: order._id })

    await customer.save();
    await order.save();

    res.status(200).json({ mssg: 'status updated to delivered' });
  } catch (err) {
    return res.json(err);
  }
});
module.exports = router;