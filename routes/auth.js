const { check, validationResult } = require('express-validator');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// generate access token function
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// register
router.post(
  '/register',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // check if user already exists
      const email = await User.findOne({ email: req.body.email });
      if (email) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // generate new hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      // save user and return response
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// login
router.post(
  '/login',
  [check('email').isEmail().withMessage('Invalid email'), check('password').notEmpty().withMessage('Password is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // find user by email in mongoDB
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // compare password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Wrong password' });
      }

      // generate access token
      const accessToken = generateAccessToken(user);

      // response with access token
      return res.status(200).json({
        username: user.username,
        accessToken,
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
