const express = require('express');
const validate = require('../../middlewares/validate');
const taskValidation = require('../../validations/task.validation');
const taskController = require('../../controllers/task.controller');
// const { googleAuth } = require('../../middlewares/googleAuth');

const router = express.Router();

router.get('/', taskController.getTasks);
router.post('/', validate(taskValidation.createTask), taskController.createTask);
router.get('/:taskId', validate(taskValidation.getTask), taskController.getTask);
router.patch('/:taskId', validate(taskValidation.updateTask), taskController.updateTask);
router.delete('/:taskId', validate(taskValidation.deleteTask), taskController.deleteTask);

module.exports = router;
