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
    { name: 'Samosa', price: 15, category: 'Snacks', description: 'Crispy deep-fried pastry with spiced potato filling', availability: true, image: 'https://placehold.co/300x200?text=Samosa' },
    { name: 'Vada Pav', price: 20, category: 'Snacks', description: 'Mumbai-style spicy potato fritter in a bread roll', availability: true, image: 'https://placehold.co/300x200?text=Vada+Pav' },
    { name: 'Masala Chai', price: 10, category: 'Beverages', description: 'Aromatic spiced Indian milk tea', availability: true, image: 'https://placehold.co/300x200?text=Masala+Chai' },
    { name: 'Cold Coffee', price: 35, category: 'Beverages', description: 'Refreshing blended iced coffee drink', availability: true, image: 'https://placehold.co/300x200?text=Cold+Coffee' },
    { name: 'Dal Rice', price: 60, category: 'Meals', description: 'Wholesome lentil soup served with steamed basmati rice', availability: true, image: 'https://placehold.co/300x200?text=Dal+Rice' },
    { name: 'Paneer Butter Masala', price: 80, category: 'Meals', description: 'Creamy cottage cheese curry with butter gravy', availability: true, image: 'https://placehold.co/300x200?text=Paneer' },
    { name: 'Gulab Jamun', price: 25, category: 'Desserts', description: 'Soft milk-solid balls soaked in rose-flavored sugar syrup', availability: true, image: 'https://placehold.co/300x200?text=Gulab+Jamun' },
    { name: 'Kulfi', price: 30, category: 'Desserts', description: 'Traditional Indian frozen dessert with pistachio', availability: true, image: 'https://placehold.co/300x200?text=Kulfi' },
  ];

  const created = await FoodItem.insertMany(items);
  console.log('Seeded', created.length, 'food items successfully!');
  created.forEach(i => console.log(' -', i.name, '₹' + i.price));

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
