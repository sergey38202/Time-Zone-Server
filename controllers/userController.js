import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

import UserModel from '../models/UserModel.js';

dotenv.config();

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.SECRET_KEY;

const createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new UserModel({ email, username, password: hashedPassword, role: 'user' });
    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id, username: savedUser.username, role: savedUser.role }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ user: savedUser, token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  
      res.status(200).json({ user, token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getAllUsers = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden - Access denied' });
      }
  
      const users = await UserModel.find({ role: { $ne: 'admin' } });
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const getProfileInfo = async (req, res) => {
    try {
        const userData = {
          email: req.user.email,
          username: req.user.username,
          role: req.user.role,
        };
    
        res.json(userData);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Access denied' });
    }

    const userToDelete = await UserModel.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const resetPasswordDirectly = async (req, res) => {
  try {
      const { email, newPassword } = req.body;

      if (!newPassword || !email) {
          return res.status(400).json({ error: 'Email and new password are required.' });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { createUser, loginUser, getAllUsers, getProfileInfo, deleteUser, resetPasswordDirectly, };
