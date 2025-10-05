const app = require('express');
const { createProject, getProjectsForUser, addMemberToProject } = require('../controllers/projectController');

const routes = app.Router();

routes.post('/create', createProject);
routes.get('/', getProjectsForUser);
routes.post('/:projectId/add-member', addMemberToProject);

module.exports = routes;