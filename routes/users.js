const verify = require('../middlewares/auth');
const User = require('../models/User');
const router = require('express').Router();

// get current user when user refrehes the page they send a token and we verify it and send the user data back
// token they store inside the local storage.
router.get('/me', verify, async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
