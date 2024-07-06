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
router.delete('/:id', verify, async (req, res) => {
  const userId = req.user.id;
  const todoId = req.params.id;
  console.log(userId, todoId);
  try {
    const todo = await Todo.findOne({ userId: userId, _id: todoId });
    if (todo) {
      await todo.deleteOne();
      res.status(200).json('Todo has been deleted...');
    } else {
      res.status(404).json('Todo not found...');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// get Todos
router.get('/', verify, async (req, res) => {
  const userId = req.user.id;
  const todos = await Todo.find({ userId: userId });
  res.status(200).json(todos);
});

// change todo status
router.patch('/:id', verify, async (req, res) => {
  const userId = req.user.id;
  const todoId = req.params.id;
  try {
    const todo = await Todo.findOne({ userId: userId, _id: todoId });
    if (todo) {
      todo.status = !todo.status;
      await todo.save();
      res.status(200).json(todo);
    } else {
      res.status(404).json('Todo not found...');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
