const User = require('../models/User');
const connectDB = require('../config/database');
require('dotenv').config({ path: '../.env' }); // ← Add path to .env


const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@farmmanager.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'Farm Administrator',
      email: 'admin@farmmanager.com',
      password: 'admin123456', // Will be hashed automatically
      role: 'admin',
      phone: '+1234567890',
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@farmmanager.com');
    console.log('Password: admin123456');
    console.log('Please change the password after first login!');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit();
  }
};

createAdmin();