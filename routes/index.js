const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

const middlewares = require('../utils/middlewares');

router.get('/home', async (req, res, next) => {
  return res.status(200).json({
		status: true,
		message: 'welcome to coba CI-CD API',
		data: null,
	});
});

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/whoami', middlewares.auth, user.whoami);

module.exports = router;