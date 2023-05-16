const request = require('supertest');
const app = require('../app.js');
const truncate = require('../utils/truncate');

// reset database user
truncate.user();

const user = {
	name: 'sabrina',
	email: 'sabrina3@mail.com',
	password: 'password123',
	token: '',
};

// register
describe('/register [POST]', () => {
	test('Register success', async () => {
		try {
			const res = await request(app).post('/register').send(user);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.data).toHaveProperty('id');
			expect(res.body.data).toHaveProperty('name');
			expect(res.body.data).toHaveProperty('email');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('user registered!');
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});

	test('Register: email already used!', async () => {
		try {
			const res = await request(app).post('/register').send(user);

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe('email already used!');
			expect(res.body.data).toBe(null);
		} catch (error) {
			expect(error).toBe('error'); // test gagal karena err != 'error'
		}
	});
});

// login
describe('/login [POST]', () => {
	// positive case
	test('Login dengan email dan password yang benar.', async () => {
		try {
			// hit endpoint
			const res = await request(app).post('/login').send(user);

			// expect
			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.data).toHaveProperty('token');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('login success!');

			user.token = res.body.data.token;
		} catch (error) {
			expect(error).toBe('error');
		}
	});

	// negative case
	test('Login dengan email dan password yang salah.', async () => {
		try {
			// body data
			const email = 'hacker@gmail.com'; // email tidak terdaftar
			const password = '1234';

			// hit endpoint
			const res = await request(app).post('/login').send({
				email,
				password,
			});

			// expect
			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe('credential is not valid!');
		} catch (error) {
			expect(error).toBe('error');
		}
	});
});

// whoami
describe('/whoami [GET]', () => {
	// positive case
	test('Akses dengan mengirimkan token didalam header.', async () => {
		console.log(`INI TOKEN ${user.token}`);
		try {
			// hit endpoint
			const res = await request(app).get('/whoami').set('token', user.token);

			// expect
			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.data).toHaveProperty('id');
			expect(res.body.data).toHaveProperty('name');
			expect(res.body.data).toHaveProperty('email');
			expect(res.body.status).toBe(true);
			expect(res.body.message).toBe('success!');
		} catch (error) {
			expect(error).toBe('error');
		}
	});

	// negative case
	test('Akses dengan tidak mengirimkan token didalam header.', async () => {
		try {
			// hit endpoint
			const res = await request(app).get('/whoami');

			// expect
			expect(res.statusCode).toBe(401);
			expect(res.body).toHaveProperty('status');
			expect(res.body).toHaveProperty('message');
			expect(res.body).toHaveProperty('data');
			expect(res.body.status).toBe(false);
			expect(res.body.message).toBe("you're not authorized!");
		} catch (error) {
			expect(error).toBe('error');
		}
	});
});
