const app = require('express');
const { loginUser, registerUser, getPrpfile } = require('../controllers/authController');
const authMiddlware = require('../middleware/authMiddleware');
const routes = app.Router();

routes.post('/login',loginUser);
routes.post('/register',registerUser);
routes.get('/profile',authMiddlware,getPrpfile);

module.exports = routes;