require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const Job_title = require('./controllers/job_titleController');
const Employee = require('./controllers/employeeController');
const Customer = require('./controllers/customerController');
const ServiceType = require('./controllers/service_typeController');
const Product = require('./controllers/productController');
const Stock = require('./controllers/stokeController');
const Order = require('./controllers/orderController');
const Delivery = require('./controllers/deliveryController');
const CustomerMobile = require('./controllers/customerControllerMobile')

const path = require('path');
const app = express();



app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static('images'));

app.use('/api/job_title', Job_title);
app.use('/api/employee', Employee);
app.use('/api/customer', Customer);
app.use('/api/service_type', ServiceType);
app.use('/api/product', Product);
app.use('/api/order', Order);
app.use('/orderdetail/api/order', Order);
app.use('/mobile/api/delivery', Delivery)
app.use('/mobile/api/customer', CustomerMobile)






mongoose.set('strictQuery', false)
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) {
    console.log(err.message)
  }
  console.log('Connected to MongoDB Atlas');
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});