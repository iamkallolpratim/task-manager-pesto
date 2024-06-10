const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const randomString = require('../utils/genarateRandom');

const taskSchema = mongoose.Schema(
  {
    task_id: {
      type: String,
      required: true,
      trim: true,
      default: randomString(10),
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed', 'cancelled'],
      default: 'todo',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

/**
 * @typedef Task
 */
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
