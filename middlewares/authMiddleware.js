import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

import UserModel from '../models/UserModel.js';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user = await UserModel.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

export default authenticateUser;
