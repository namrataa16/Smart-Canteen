import FoodItem from '../models/FoodItem.js';

// @desc    Fetch all food items or filter by category
// @route   GET /api/menu
// @access  Public
const getFoodItems = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const foodItems = await FoodItem.find(filter);
    res.json(foodItems);
  } catch (error) {
    console.error('getFoodItems error:', error.message);
    res.status(500).json({ message: 'Server error fetching food items' });
  }
};

// @desc    Create a food item
// @route   POST /api/menu
// @access  Private/Admin
const createFoodItem = async (req, res) => {
  try {
    const { name, price, description, image, category, availability } = req.body;

    const foodItem = new FoodItem({
      name,
      price,
      description,
      image,
      category,
      availability: availability !== undefined ? availability : true,
    });

    const createdFoodItem = await foodItem.save();
    res.status(201).json(createdFoodItem);
  } catch (error) {
    console.error('createFoodItem error:', error.message);
    res.status(500).json({ message: error.message || 'Server error creating food item' });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);

    if (foodItem) {
      await foodItem.deleteOne();
      res.json({ message: 'Food item removed' });
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    console.error('deleteFoodItem error:', error.message);
    res.status(500).json({ message: 'Server error deleting food item' });
  }
};

// @desc    Update a food item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateFoodItem = async (req, res) => {
  try {
    const { name, price, description, image, category, availability } = req.body;

    const foodItem = await FoodItem.findById(req.params.id);

    if (foodItem) {
      foodItem.name = name || foodItem.name;
      foodItem.price = price !== undefined ? price : foodItem.price;
      foodItem.description = description || foodItem.description;
      foodItem.image = image || foodItem.image;
      foodItem.category = category || foodItem.category;
      if (availability !== undefined) {
        foodItem.availability = availability;
      }

      const updatedFoodItem = await foodItem.save();
      res.json(updatedFoodItem);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    console.error('updateFoodItem error:', error.message);
    res.status(500).json({ message: 'Server error updating food item' });
  }
};

export { getFoodItems, createFoodItem, updateFoodItem, deleteFoodItem };
