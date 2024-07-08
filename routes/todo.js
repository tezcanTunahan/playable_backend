const verify = require('../middlewares/auth');
const router = require('express').Router();
const Todo = require('../models/Todo');
const { query, validationResult, body } = require('express-validator');

// POST /todo
router.post(
  '/',
  verify,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('desc').notEmpty().withMessage('Description is required'),
    body('img').optional().isURL().withMessage('Image must be a valid URL'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
);

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

// GET /todos?pages=1&limit=10
router.get(
  '/',
  verify,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('search').optional().isString().withMessage('Search must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    // Arama filtresi oluştur
    let filter = { userId: userId };
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // 'i' seçeneği büyük/küçük harf duyarsız arama yapar
    }

    try {
      const todos = await Todo.find(filter).skip(skip).limit(limit);

      const totalTodos = await Todo.countDocuments(filter);
      const totalPages = Math.ceil(totalTodos / limit);

      res.status(200).json({
        todos,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);
