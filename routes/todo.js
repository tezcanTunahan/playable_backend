const verify = require('../middlewares/auth');
const router = require('express').Router();
const Todo = require('../models/Todo');
const User = require('../models/User');
// create Todo
router.post('/', verify, async (req, res) => {
  console.log(req.user.id);
  if (req.user.id) {
    const newTodo = new Todo({
      title: req.body.title,
      desc: req.body.desc,
      img: req.body.img,
      userId: req.user.id,
      status: false,
    });
    try {
      const todo = await newTodo.save();
      res.status(200).json(todo);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// delete Todo

// get Todos
router.get('/', verify, async (req, res) => {
  const userId = req.user.id;
  const todos = await Todo.find({ userId: userId });
  res.status(200).json(todos);
});

module.exports = router;
