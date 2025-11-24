const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/livestock', require('./routes/livestock'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/fields', require('./routes/fields'));

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Farm Management API is working!' });
});

// Test database connection route
app.get('/api/db-test', async (req, res) => {
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    res.json({
      message: 'Database connected successfully!',
      userCount: userCount,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
