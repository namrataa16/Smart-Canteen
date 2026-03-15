import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  category: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  availability: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
export default FoodItem;
