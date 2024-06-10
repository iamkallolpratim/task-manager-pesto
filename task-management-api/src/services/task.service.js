const httpStatus = require('http-status');
const { Task } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a task
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 */
const createTask = async (taskBody) => {
  return Task.create(taskBody);
};

/**
 * Retrieves all tasks from the database and returns them as a JSON object.
 *
 * @return {Promise<Array<Object>>} A promise that resolves to an array of task objects.
 */
const queryTasks = async () => {
  const tasks = await Task.find();
  return tasks;
};

/**
 * Retrieves a task from the database by its ID.
 *
 * @param {string} id - The ID of the task to retrieve.
 * @return {Promise<Task>} A promise that resolves to the retrieved task.
 */
const getTaskById = async (id) => {
  return Task.findById(id);
};

/**
 * Updates a task by its ID with the provided update body.
 *
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} updateBody - The data to update the task with.
 * @returns {Promise<Task>} - A promise that resolves to the updated task.
 * @throws {ApiError} - If the task with the given ID is not found.
 */
const updateTaskById = async (taskId, updateBody) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  Object.assign(task, updateBody);
  await task.save();
  return task;
};

/**
 * Deletes a task by its ID.
 *
 * @param {string} taskId - The ID of the task to delete.
 * @return {Promise<Object>} The deleted task object.
 * @throws {ApiError} If the task with the given ID is not found.
 */
const deleteTaskById = async (taskId) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  await task.remove();
  return task;
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
