const { User } = require('../db/models');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
	register: async (req, res, next) => {
		try {
			const { name, email, password } = req.body;

			const exist = await User.findOne({ where: { email } });
			if (exist) {
				return res.status(400).json({
					status: false,
					message: 'email already used!',
					data: null,
				});
			}

			const hashPassword = await bcryp.hash(password, 10);

			const user = await User.create({
				name,
				email,
				password: hashPassword,
			});

			return res.status(200).json({
				status: true,
				message: 'user registered!',
				data: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
			});
		} catch (err) {
			throw err;
		}
	},

	login: async (req, res, next) => {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({ where: { email } });
			if (!user) {
				return res.status(400).json({
					status: false,
					message: 'credential is not valid!',
					data: null,
				});
			}

			const passwordCorrect = await bcryp.compare(password, user.password);
			if (!passwordCorrect) {
				return res.status(400).json({
					status: false,
					message: 'credential is not valid!',
					data: null,
				});
			}

			const payload = {
				id: user.id,
				name: user.name,
				email: user.email,
			};

			const token = await jwt.sign(payload, JWT_SECRET_KEY);

			return res.status(200).json({
				status: true,
				message: 'login success!',
				data: {
					token,
				},
			});
		} catch (err) {
			throw err;
		}
	},

	whoami: async (req, res, next) => {
		try {
			return res.status(200).json({
				status: true,
				message: 'success!',
				data: {
					id: req.user.id,
					name: req.user.name,
					email: req.user.email,
				},
			});
		} catch (err) {
			throw(err);
		}
	},
};
