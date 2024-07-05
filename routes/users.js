const verify = require('../middlewares/auth');
const User = require('../models/User');
const router = require('express').Router();

// delete user
router.delete('/', verify, async (req, res) => {
  if (req.user.id) {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } else {
    res.status(403).json({ message: 'You are not allowed to delete this user' });
  }
});
// get current user
router.get('/me', verify, async (req, res) => {
  if (req.user.id) {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  }
});

// get all users
router.get('/all', async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

module.exports = router;
