const app = require('express');
const { createTask, getTaskByProject, updateTask,updateTaskStatus, deleteTask } = require('../controllers/taskController');
const routes = app.Router();

routes.post('/create',createTask);
routes.get('/:projectId/getByProject',getTaskByProject);
routes.put('/:taskId/update-task',updateTask);
routes.put('/:taskId/update-status',updateTaskStatus);
routes.delete('/:taskId/delete-task',deleteTask);

module.exports = routes;