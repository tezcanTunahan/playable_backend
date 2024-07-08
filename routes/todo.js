const verify = require('../middlewares/auth');
const router = require('express').Router();
const Todo = require('../models/Todo');
const { query, validationResult, body, param } = require('express-validator');

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

    const { title, desc, img } = req.body;
    const newTodo = new Todo({
      title,
      desc,
      img,
      userId: req.user.id,
      status: false,
    });

    try {
      const todo = await newTodo.save();
      res.status(201).json(todo); // Changed to 201 for resource creation
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
// delete Todo
router.delete('/:id', verify, [param('id').isMongoId().withMessage('Invalid Todo ID')], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const todoId = req.params.id;

  try {
    const todo = await Todo.findOne({ userId: userId, _id: todoId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await todo.deleteOne();
    res.status(200).json({ message: 'Todo has been deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// change todo status
router.patch('/:id', verify, [param('id').isMongoId().withMessage('Invalid Todo ID')], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const todoId = req.params.id;

  try {
    const todo = await Todo.findOne({ userId: userId, _id: todoId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.status = !todo.status;
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

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

module.exports = router;
