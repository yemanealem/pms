const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Customer = require('../models/customer');
const { isObjectIdOrHexString } = require('mongoose');
const Employee = require('../models/employee');
const auth = require('../middlewares/verifyToken')


// CREATE
router.post('/add',  async (req, res, next) => {
  
  //  const _id=req.body.customerAddress._id
  // console.log('_id',req.body.customerAddress._id)
  try {
    const order = new Order({

      cartItems: req.body.cartItems,
      customerAddress: req.body.customerAddress,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      status:req.body.status,
      payment: req.body.payment
    });
    // const customer = await Customer.findOne({ email: order.customerAddress.email }).exec();
    // order.customerAddress.username = customer.username;
    order.delivery.new_quantity.push({ quantity: 0, status: 'pending' })
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    console.log('error',error)
    res.status(500).send(error);
  }
});

router.get('/fetch', auth.verifyToken, async (req, res) => {
  try {
    const order = await Order.find();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ
router.get('/fetch/:id', async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.sendStatus(404);
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

function validateQuantities(order) {
  const { cartItems, printing, finishing, delivery } = order;
  if (printing.quantity > cartItems.quantity) {
    return { message: "Quantity in printing phase can't exceed the total ordered quantity." };
  }

  if (finishing.quantity > printing.quantity) {
    return { message: "Quantity in finishing phase can't exceed quantity in printing." };
  }

  if (delivery.quantity > finishing.quantity) {
    return { message: "Quantity in delivery phase can't exceed quantity in finishing." };
  }

  return true;
}
router.put('/update/:id', auth.verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const result = await Order.findByIdAndUpdate(id, data, options);
    const validation = validateQuantities(result);
    if (validation !== true) {

      return res.status(400).json(validation);
    }
    return res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})
// update status
router.put('/:id/assignrole', auth.verifyToken, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {

    if (req.body.phase === 'GD') {

      try {

        order.graphicDesign.assigned_to = req.body.assigned_to || order.graphicDesign.assigned_to;
        order.graphicDesign.username = req.body.username || order.graphicDesign.username;


        const updatedOrder = await order.save();
        return res.status(200).json(updatedOrder);

      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }



    if (req.body.phase === 'PR') {
      try {

        order.printing.assigned_to = req.body.assigned_to || order.printing.assigned_to;
        order.printing.username = req.body.username || order.printing.username;

        const updatedOrder = await order.save();

        return res.status(200).json(updatedOrder);


      } catch (error) {

        return res.status(500).json({ error: error.message });
      }



    }

    if (req.body.phase === 'FN') {

      try {

        order.finishing.assigned_to = req.body.assigned_to || order.finishing.assigned_to;
        order.finishing.username = req.body.username || order.finishing.username;



        const updatedOrder = await order.save();
        return res.status(200).json(updatedOrder);

      } catch (error) {
        return res.status(500).json({ error: error.message });
      }


    }
    else {
      try {
        order.delivery.assigned_to = req.body.assigned_to || order.delivery.assigned_to;;
        order.delivery.username = req.body.username || order.delivery.username;

        employee = await Employee.findOne({ username: order.delivery.username }).exec()
        employee.new_notifications.push({ content: ` Dear ${employee.username}, you are assigned to deliver items`, orderId: order._id });
        await employee.save();

        // order.delivery.new_notifications.push({ content: ` Dear ${order.delivery.username}, you are assigned to deliver items of the order with id ${order._id}`, orderId:  order._id});


        const updatedOrder = await order.save();
        return res.status(200).json(updatedOrder);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    }


  }
})

router.put('/:id/updatestatus', auth.verifyToken, async (req, res) => {

  const order = await Order.findById(req.params.id);

  if (order) {

    if (req.body.phase === 'GD') {

      try {
        if (req.body.status === 'close') {
          order.graphicDesign.status = 'Waiting for approval'

        }
        if (req.body.status === 'approve'

        ) {
          order.graphicDesign.status = 'completed'


        }
        const updatedOrder = await order.save();

        return res.status(200).json(updatedOrder);

      } catch (error) {
        return res.status(500).json({ error: error.message });
      }



    }



    if (req.body.phase === 'PR') {
      let new_quantity = req.body.quantity;
      try {

        order.printing.quantity += Number(new_quantity);
        order.addQuantity(new_quantity, 'printing');


        const validation = validateQuantities(order);
        if (validation !== true) {
          return res.status(400).json(validation);
        }
        if (order.printing.quantity === order.cartItems.quantity) {
          order.printing.status = 'completed'
        }
        const updatedOrder = await order.save();


        return res.status(200).json(updatedOrder);


      } catch (error) {

        return res.status(500).json({ error: error.message });
      }



    }

    if (req.body.phase === 'FN') {
      let quantity = req.body.quantity;

      try {

        order.finishing.quantity += Number(quantity);
        order.addQuantity(quantity, 'finishing');

        const validation = validateQuantities(order);
        if (validation !== true) {
          return res.status(400).json(validation);
        }
        employee = await Employee.findOne({ username: order.delivery.username }).exec()
        employee.new_notifications.push({ content: ` Dear ${employee.username}, you are assigned to deliver items of a ${order.cartItems.serviceType} order`, orderId: order._id });
        await employee.save();
        for (let index = 0; index < order.delivery.new_quantity.length; index++) {
          if (order.delivery.new_quantity[index].status === 'pending') {
            order.delivery.new_quantity[index].quantity += Number(quantity);
          }
          else if ((order.delivery.new_quantity[index].status !== 'pending') && (index !== order.delivery.new_quantity.length)) {
            if (order.delivery.new_quantity.length > 1) {
              if (index === (order.delivery.new_quantity.length - 1)) {
                order.delivery.new_quantity.push({ quantity: quantity })
                index = order.delivery.new_quantity.length;
              }
              else {
                continue;
              }

            }
            else {
              order.delivery.new_quantity.push({ quantity: quantity })
              index = order.delivery.new_quantity.length;
            }

          }
        }
        if (order.finishing.quantity === order.cartItems.quantity) {
          order.finishing.status = 'completed'
        }

        const updatedOrder = await order.save();
        return res.status(200).json(updatedOrder);

      } catch (error) {

        return res.status(500).json({ error: error.message });
      }


    }
    // else {
    //   let new_quantity=req.body.quantity;
    //   try {
    //     order.delivery.quantity += Number(new_quantity);
    //     order.addQuantity(new_quantity, 'delivery');
    //     const username = order.customerAddress.username;

    //     const validation = validateQuantities(order);
    //     if (validation !== true) {
    //       return res.status(400).json(validation);
    //     }

    //     customer = await Customer.findOne({username: username}).exec()

    //     customer.new_notifications.push({ content: ` Dear ${customer.firstName}, it's reported that a total of ${order.delivery.quantity} items of your order are delivered, please click to confirm`, orderId:  order._id});
    //     // customer.notification.push(` Dear ${customer.firstName}, it's reported that a total of ${order.delivery.quantity} items of your order are delivered, please click to confirm`)
    //     customer.save()
    //     if(order.delivery.quantity === order.cartItems.quantity){
    //       order.delivery.status='completed but waiting for confirmition from customer'
    //     }

    //     const updatedOrder = await order.save();
    //     return res.status(200).json(updatedOrder);
    //   } catch (error) {
    //     return res.status(500).json({ error: error.message });
    //   }

    // }


  }
})


router.post('/orders', auth.verifyToken, async (req, res) => {

  const { startDate, endDate, phase, status, serviceType } = req.body;



  let filter = {};

  if (startDate && endDate) {
    filter['cartItems.itemOrederedDate'] = { $gte: startDate, $lte: endDate }
  }


  if (phase) {
    filter[`${phase}.status`] = status || { $exists: true };
  }

  if (serviceType) {
    filter['cartItems.serviceType'] = serviceType;
  }
  // console.log(filter)
  const orders = await Order.find(
    // {'cartItems.itemOrederedDate': { $gte: startDate, $lte: endDate }},
    filter

  );



  return res.status(200).json(orders);



});

router.post('/approve', async (req, res) => { 
  const id = req.body._id;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.sendStatus(404).json({mssg: 'Order not found'});
    }
    order.status= "Approved";
    await order.save();
    return res.status(200).json({mssg: 'Order status updated to approved'});

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

})

router.post('/payment_method', auth.verifyToken, async (req, res) => { 
  const id = req.body._id;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.sendStatus(404).json({mssg: 'Order not found'});
    }
    order.payment= "cash";
    await order.save();
    return res.status(200).json({mssg: 'Payment method changed to cash'});

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})




// DELETE
router.delete('/delete/:id', auth.verifyToken, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.sendStatus(404).json({mssg: 'Order not found'});
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;