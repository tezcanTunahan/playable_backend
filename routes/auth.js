// access token & refresh token
const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Token = require('../models/token');
const jwt = require('jsonwebtoken');
const verify = require('../middlewares/auth');

// generete access token function
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};
// generate refresh token function
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

// register
router.post('/register', async (req, res) => {
  try {
    //  generate new hashed password
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
    res.status(500).json(err);
  }
});

// login
router.post('/login', async (req, res) => {
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

    // check if the user has a refresh token and delete if exists
    const oldRefreshToken = await Token.findOne({ userId: user._id });
    if (oldRefreshToken) {
      await Token.deleteOne({ userId: user._id });
    }

    // generate new refresh token
    const refreshToken = generateRefreshToken(user);

    // save refresh token in mongoDB for future use
    const newRefreshToken = new Token({
      refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days expiry
    });
    await newRefreshToken.save();

    // response with access token and refresh token
    return res.status(200).json({
      username: user.username,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// refresh token
router.post('/refresh', async (req, res) => {
  // take the refresh token from the user
  const refreshToken = req.body.token;
  // send error if there is no token or it is invalid
  if (!refreshToken) {
    return res.status(401).json('You are not authenticated');
  }
  try {
    // check if the refresh token is in the database
    const existingRefreshToken = await Token.findOne({ refreshToken: refreshToken });
    if (!existingRefreshToken) {
      return res.status(403).json('Refresh token is not in database');
    }
    // verify the token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json('Token is not valid');
      }
      // if the token is valid, check if it has expired
      if (existingRefreshToken.expiresAt < new Date()) {
        return res.status(403).json('Token has expired');
      }
      try {
        await Token.deleteOne({ refreshToken: refreshToken });
        const newRefreshToken = generateRefreshToken(user);
        const newToken = new Token({
          refreshToken: newRefreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });
        newToken.save();
        // generate new access token
        const newAccessToken = generateAccessToken(user);
        // send new access token and refresh token to the user
        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      } catch (deleteErr) {
        res.status(500).json({ message: 'Error deleting refresh token', error: deleteErr });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// logout
router.post('/logout', verify, async (req, res) => {
  const refreshToken = req.body.token;
  await Token.deleteOne({ refreshToken: refreshToken });
  res.status(200).json('You logged out');
});

module.exports = router;
