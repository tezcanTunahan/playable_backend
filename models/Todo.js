const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
      max: 50,
    },
    status: {
      type: Boolean,
      required: true,
      min: 6,
    },
    img: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);
