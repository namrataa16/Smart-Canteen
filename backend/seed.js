import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.js';
import FoodItem from './models/FoodItem.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcanteen';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Ensure superadmin exists
  await User.deleteMany({ email: 'superadmin@canteen.com' });
  const adminUser = await User.create({
    name: 'Super Admin',
    email: 'superadmin@canteen.com',
    password: 'password123',
    role: 'admin'
  });
  console.log('Admin user created:', adminUser.email);

  // Clear and seed food items
  await FoodItem.deleteMany({});

  const items = [
    {
      name: 'Samosa',
      price: 15,
      category: 'Snacks',
      description: 'Crispy deep-fried pastry stuffed with spiced potato & peas filling',
      availability: true,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Burger',
      price: 80,
      category: 'Snacks',
      description: 'Juicy double-patty burger with lettuce, cheese & special sauce',
      availability: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Pizza',
      price: 120,
      category: 'Meals',
      description: 'Delicious hand-tossed cheesy pizza loaded with fresh toppings',
      availability: true,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Sandwich',
      price: 50,
      category: 'Snacks',
      description: 'Toasted grilled vegetable sandwich with mint chutney & cheese',
      availability: true,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Maggi',
      price: 40,
      category: 'Snacks',
      description: "Everyone's favorite instant masala noodles, desi style",
      availability: true,
      image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'French Fries',
      price: 60,
      category: 'Snacks',
      description: 'Golden crispy salted potato fries served hot',
      availability: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Tea',
      price: 10,
      category: 'Beverages',
      description: 'Aromatic homestyle masala chai with ginger & cardamom',
      availability: true,
      image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Coffee',
      price: 25,
      category: 'Beverages',
      description: 'Rich freshly brewed hot coffee with creamy froth',
      availability: true,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Cold Coffee',
      price: 35,
      category: 'Beverages',
      description: 'Refreshing chilled blended coffee with ice cream',
      availability: true,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Vada Pav',
      price: 20,
      category: 'Snacks',
      description: 'Mumbai street-style spicy potato fritter in a soft bread bun',
      availability: true,
      image: 'https://images.unsplash.com/photo-1606491956391-70868b5d0f47?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Paneer Butter Masala',
      price: 80,
      category: 'Meals',
      description: 'Soft cottage cheese cubes in rich, creamy buttery tomato gravy',
      availability: true,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Dal Rice',
      price: 60,
      category: 'Meals',
      description: 'Wholesome comfort food — yellow lentil soup with steamed basmati rice',
      availability: true,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Gulab Jamun',
      price: 25,
      category: 'Desserts',
      description: 'Soft melt-in-mouth milk-solid balls soaked in rose-scented sugar syrup',
      availability: true,
      image: 'https://images.unsplash.com/photo-1666365490927-1ddd044de2de?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Kulfi',
      price: 30,
      category: 'Desserts',
      description: 'Traditional dense Indian frozen dessert with pistachio & saffron',
      availability: true,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop'
    },
  ];

  const created = await FoodItem.insertMany(items);
  console.log('Seeded', created.length, 'food items successfully!');
  created.forEach(i => console.log(' -', i.name, '₹' + i.price));

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
