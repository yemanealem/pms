const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cartItems: 
    {
        serviceType: {
              type: String,
              ref: 'ServiceType',
              required: true,
        },
        description:{type: String},
        unitPrice: {type: Number},
        quantity: {type: Number, required: true},
        itemOrederedDate:{type:Date, default: Date.now()} ,
        paymentMethode:{type:String} ,
        recieved: {type:Number},
        paymentDescription: {type:String},
        uId: {type:Number}
    },
  


  customerAddress: {

        fullName: { type: String},
        phoneNumber: {type: String},
        homeNumber: { type: String},
        email: {type: String},
        address: {type: String},
        tinNum:{type:String},
        streetAdress: {type: String},
        companyName: {type: String},
        username: {type: String}
  },
    itemsPrice: { type: Number},
    taxPrice: { type: Number},
    totalPrice: { type: Number},
    status:{type:String},
    payment: {type: String},
    graphicDesign: {
        status: {type: String,default: 'Not started'},
        assigned_to: {type: String, default: null},
        username: String,
      },
   
    printing: {
        status: {type: String, default:'pending'},
        assigned_to: {type: String, default: null},
        username: String,
        quantity: {
          type: Number,
          default: 0,
        },
        log: {
          type: [
            {
              date: {
                type: Date,
                default: Date.now
              },
              quantity: Number,
              phaseId: String
            }
          ],
          default: []
        }       
      },

    finishing: {
      
        status: {type: String, 
          default:'pending'},
        assigned_to: {type: String, default: null},
        username: String,
        quantity: {
          type: Number,
          default: 0,

        },
        log: {
          type: [
            {
              date: {
                type: Date,
                default: Date.now
              },
              quantity: Number,
              phaseId: String
            }
          ],
          default: []
        }    
      },

    delivery: {
      status: {type: String, default:'pending'},
      assigned_to: {type: String, default: null},
      username: {type: String, default: null},
      quantity: {
        type: Number,
        default: 0,
      },
      log: {
        type: [
          {
            date: {
              type: Date,
              default: Date.now
            },
            quantity: Number,
            phaseId: String
          }
        ],
        default: []
      },
      new_quantity: {
        type: [
          {
            quantity: {
              type: Number,
              default: 0
            },
            status: {
              type: String,
              default: 'pending'
            }
            
          }
        ],
        default: []
      }
    }
  
});

orderSchema.methods.addQuantity = async function(quantity, phase) {

  this.quantity += quantity;
  if(phase==='printing'){
    this.printing.log.push({ date: new Date(), quantity, phaseId: phase });
  }
  if(phase==='finishing'){
    this.finishing.log.push({ date: new Date(), quantity, phaseId: phase });
  }
  if(phase==='delivery'){
    this.delivery.log.push({ date: new Date(), quantity, phaseId: phase });
  }
  
  
  this.markModified('log');
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;