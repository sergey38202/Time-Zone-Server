import express from 'express';

import { 
    createUser, 
    deleteUser, 
    getAllUsers, 
    getProfileInfo, 
    loginUser, 
    resetPasswordDirectly, 
} from '../controllers/userController.js';
import authenticateUser from '../middlewares/authMiddleware.js';

const route = express.Router();

route.post('/register', createUser);
route.post('/login', loginUser);
route.post('/reset-password-direct', resetPasswordDirectly);
route.get('/users', authenticateUser, getAllUsers);
route.get('/profile', authenticateUser, getProfileInfo);
route.delete('/user/:userId', authenticateUser, deleteUser);

export default route;
