const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 50,
    },
    status: {
      type: Boolean,
      required: true,
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

// Export the model or retrieve the existing one to avoid model overwrite errors in watch mode
module.exports = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);
