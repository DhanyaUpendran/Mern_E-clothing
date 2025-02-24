import jwt from 'jsonwebtoken';
import User from '../models/user.signup.js';

// Main authentication middleware
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers or cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Please login to access this resource' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};