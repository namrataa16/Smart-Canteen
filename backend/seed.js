import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.js';
import FoodItem from './models/FoodItem.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcanteen';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Ensure superadmin exists and is an admin with hashed password
  await User.deleteMany({ email: 'superadmin@canteen.com' });
  const adminUser = await User.create({
    name: 'Super Admin',
    email: 'superadmin@canteen.com',
    password: 'password123',
    role: 'admin'
  });
  console.log('Admin user created and hashed:', adminUser.email);
  console.log('Hashed password in DB:', adminUser.password);

  // Clear and seed food items
  await FoodItem.deleteMany({});

  const items = [
    { name: 'Samosa', price: 15, category: 'Snacks', description: 'Crispy deep-fried pastry with spiced potato filling', availability: true, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600' },
    { name: 'Vada Pav', price: 20, category: 'Snacks', description: 'Mumbai-style spicy potato fritter in a bread roll', availability: true, image: 'https://images.unsplash.com/photo-1606491956391-70868b5d0f47?q=80&w=600' },
    { name: 'Pizza', price: 120, category: 'Meals', description: 'Delicious cheesy pizza with fresh toppings', availability: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600' },
    { name: 'Sandwich', price: 50, category: 'Snacks', description: 'Grilled vegetable sandwich with mint chutney', availability: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600' },
    { name: 'Maggi', price: 40, category: 'Snacks', description: 'Everyone\'s favorite masala noodles', availability: true, image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600' },
    { name: 'French Fries', price: 60, category: 'Snacks', description: 'Crispy golden potato fries', availability: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600' },
    { name: 'Masala Chai', price: 10, category: 'Beverages', description: 'Aromatic spiced Indian milk tea', availability: true, image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=600' },
    { name: 'Coffee', price: 25, category: 'Beverages', description: 'Rich brewed hot coffee', availability: true, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600' },
    { name: 'Cold Coffee', price: 35, category: 'Beverages', description: 'Refreshing blended iced coffee drink', availability: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600' },
    { name: 'Paneer Butter Masala', price: 80, category: 'Meals', description: 'Creamy cottage cheese curry with butter gravy', availability: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600' },
    { name: 'Dal Rice', price: 60, category: 'Meals', description: 'Wholesome lentil soup served with steamed rice', availability: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600' },
    { name: 'Gulab Jamun', price: 25, category: 'Desserts', description: 'Soft milk-solid balls in sugar syrup', availability: true, image: 'https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=600' },
    { name: 'Kulfi', price: 30, category: 'Desserts', description: 'Traditional Indian frozen dessert', availability: true, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600' },
  ];

  const created = await FoodItem.insertMany(items);
  console.log('Seeded', created.length, 'food items successfully!');
  created.forEach(i => console.log(' -', i.name, '₹' + i.price));

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
