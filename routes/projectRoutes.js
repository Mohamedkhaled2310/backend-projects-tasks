const app = require('express');
const { createProject,getProjectById ,getProjectsForUser, addMemberToProject } = require('../controllers/projectController');

const routes = app.Router();

routes.post('/create', createProject);
routes.get('/', getProjectsForUser);
routes.get('/:id', getProjectById);
routes.post('/:projectId/add-member', addMemberToProject);

module.exports = routes;