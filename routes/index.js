const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const media = require('../controllers/media');
const storage = require('../utils/storage');
const middlewares = require('../utils/middlewares');
const multer = require('multer')();
const qr = require('qr-image');

router.get('/home', async (req, res, next) => {
	return res.status(200).json({
		status: true,
		message: 'welcome to coba CI-CD API',
		data: null,
	});
});

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/oauth', user.googleOAuth2);
router.get('/user', middlewares.auth, user.whoami);

router.post('/storage/images', storage.image.single('media'), media.strogeSingle);
router.post('/storage/multi/images', storage.image.array('media'), media.storageArray);
router.post('/imagekit/upload', multer.single('media'), media.imagekitUpload);

router.get('/test/qr', async (req, resn, next) => {
	try {
		const data = await qr
	} catch (error) {
		next(error);
	}
});


router.get('/error', async (req, res, next) => {
	return res.status(200).json({
		status: true,
		message: 'welcome to coba CI-CD API',
		data: null,
	});
});

module.exports = router;

werewolf
