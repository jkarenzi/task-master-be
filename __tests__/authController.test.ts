export {};
const request = require('supertest');
const app = require('../src/server');
const bcrypt = require('bcrypt');
const {
  signUpSchema,
  loginSchema,
} = require('../src/middleware/validators/authSchema');
const jwt = require('jsonwebtoken')
const User = require('../src/models/User');

jest.mock('../src/models/User');
jest.mock('../src/middleware/validators/authSchema');
jest.mock('bcrypt');
jest.mock('jsonwebtoken')

describe('Auth Controller Tests', () => {
    const signUpFormData = {
        fullName: 'test tester',
        email: 'test@gmail.com',
        password: 'test123456',
    };

    const loginFormData = {
        email: 'test@gmail.com',
        password: 'test123456',
    };

    const returnedUser = {
        _id:"some id",
        fullName:"mock user",
        email:"mock@gmail.com",
        password:"password1234",
        createdAt: "some date",
        updatedAt: "some date"
    }

  it('should return a 201 if signup is successful', async () => {
    signUpSchema.validate.mockReturnValueOnce({ error: null });

    User.findOne.mockImplementationOnce(() => Promise.resolve(null));

    bcrypt.hash.mockResolvedValueOnce('hashed password');

    User.prototype.save.mockResolvedValueOnce(returnedUser);

    const response = await request(app).post('/api/auth/signup').send(signUpFormData);
    expect(response.status).toBe(201);
    expect(User.prototype.save).toHaveBeenCalled();
  });

  it('should return a 400 if validation fails on signup', async () => {
    signUpSchema.validate.mockReturnValueOnce({ error: { details: [{ message: 'Validation failed' }] } });

    const response = await request(app).post('/api/auth/signup').send(signUpFormData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  })

  it('should return a 409 if email already exists', async () => {
    signUpSchema.validate.mockReturnValueOnce({ error: null });
  
    User.findOne.mockImplementationOnce(() => Promise.resolve({
        _id:"some id",
        fullName:"mock user",
        email:"mock@gmail.com",
        password:"password1234",
        createdAt: "some date",
        updatedAt: "some date"
    }));

    const response = await request(app).post('/api/auth/signup').send(signUpFormData);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already in use');
  })

  it('should return a 500 if an error occurs during signup', async () => {
    signUpSchema.validate.mockReturnValueOnce({ error: null });
    User.findOne.mockImplementationOnce(() => {throw new Error('DB error')})

    const response = await request(app).post('/api/auth/signup').send(signUpFormData);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  })

  it('should return a 200 if login is successful', async () => {
    loginSchema.validate.mockReturnValueOnce({ error: null });
    User.findOne.mockImplementationOnce(() => Promise.resolve(returnedUser))

    bcrypt.compare.mockResolvedValueOnce(true)

    jwt.sign.mockResolvedValueOnce("fake token")

    const response = await request(app).post('/api/auth/login').send(loginFormData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  })

  it('should return a 400 if validation fails on login', async () => {
    loginSchema.validate.mockReturnValueOnce({ error: { details: [{ message: 'Validation failed' }] } });
    
    const response = await request(app).post('/api/auth/login').send(loginFormData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined()
  })

  it('should return a 404 if account if not found during login', async () => {
    loginSchema.validate.mockReturnValueOnce({ error: null });
    User.findOne.mockImplementationOnce(() => Promise.resolve(null))
    const response = await request(app).post('/api/auth/login').send(loginFormData);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Account not found');
  })

  it('should return a 401 if password provided is incorrect, in login', async () => {
    loginSchema.validate.mockReturnValueOnce({ error: null });
    User.findOne.mockImplementationOnce(() => Promise.resolve(returnedUser))

    bcrypt.compare.mockResolvedValueOnce(false)

    const response = await request(app).post('/api/auth/login').send(loginFormData);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect password');
  })

  it('should return a 500 if an error occurs during login', async () => {
    loginSchema.validate.mockReturnValueOnce({ error: null });
    User.findOne.mockImplementationOnce(() => {throw new Error('DB error')})

    const response = await request(app).post('/api/auth/login').send(loginFormData);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  })
});
