// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token from header:", req.headers.authorization);

  if (token) {
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      req.userId = decoded.userId;

      // Fetch user from DB using the userId
      const user = await User.findOne({ where: { id: req.userId } });
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.fullName = `${user.firstName} ${user.lastName}`;
      console.log('User Full Name:', req.fullName);

    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return res.status(401).json({ error: 'Token is invalid or expired' });
    }
  }

  next();
};

module.exports = authMiddleware;
