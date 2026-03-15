import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderedItems: [
    {
      foodItemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FoodItem'
        // Not required — item may be deleted from menu
      },
      name: {
        type: String,
        required: true
      },
      quantity: { 
        type: Number, 
        required: true,
        min: 1
      },
      price: { 
        type: Number, 
        required: true 
      }
    }
  ],
  totalPrice: { 
    type: Number, 
    required: true 
  },
  orderStatus: { 
    type: String, 
    enum: ['Received', 'Preparing', 'Ready'], 
    default: 'Received',
    required: true 
  },
  orderTime: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
