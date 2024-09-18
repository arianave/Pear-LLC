const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
process.env.PORT = 3000;
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a sample model (change this based on your data)
const UserSchema = new mongoose.Schema({
 name: String,
 age: Number,
 email: String
 });

const User = mongoose.model('User', UserSchema);

// API endpoint to fetch data
app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });