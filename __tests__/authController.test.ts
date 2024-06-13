export {};
const request = require('supertest');
const app = require('../src/app');
require('dotenv').config()
const User = require('../src/models/User');
const sendEmail = require('../src/utils/sendEmail')
const jwt = require('jsonwebtoken')
import mongoose, {Document} from 'mongoose'
const {connectDB, disconnectDB, getToken} = require('./testSetup')


beforeAll(connectDB)
afterAll(disconnectDB)

jest.mock('../src/utils/sendEmail')

interface IUser extends Document {
  _id:mongoose.Types.ObjectId,
  fullName:string,
  email:string,
  password:string,
  imageUrl:{
    public_id:string,
    url?:string
  },
  isVerified:boolean,
  twoFactorAuth:{
    isEnabled:true,
    code: number
  },
  role:string
}


describe('Auth Controller Tests', () => {
  let user:IUser;
  const signUpFormData = {
      fullName: 'test tester',
      email: 'test@gmail.com',
      password: 'test123456',
  };

  const loginFormData = {
      email: 'test@gmail.com',
      password: 'test123456',
  };

  const fakeId = '65f47d055e66592dd6c5b7c1'

  sendEmail.mockImplementationOnce(() => Promise.resolve({response:'ok'}))
    
  it('should return a 201 if signup is successful', async () => {
    const response = await request(app).post('/api/auth/signup').send(signUpFormData);
    expect(response.status).toBe(201);
  });

  it('should return a 400 if validation fails on signup', async () => {
    const formData = {
      fullName: 'test tester',
      email: 'testgmail.com',
      password: 'test123456',
    }

    const response = await request(app).post('/api/auth/signup').send(formData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  })

  it('should return a 409 if email already exists', async () => {
    const response = await request(app).post('/api/auth/signup').send(signUpFormData);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already in use');
  })

  it('should return a 200 if login is successful with 2fa disabled', async () => {
    const response = await request(app).post('/api/auth/login').send(loginFormData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  })

  it('should return a 200 if upon login with 2fa enabled', async () => {
    user = await User.findOne({email:loginFormData.email})
    await User.findByIdAndUpdate(user._id,{'twoFactorAuth.isEnabled':true})
    const response = await request(app).post('/api/auth/login').send(loginFormData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('A Two Factor Auth Code has been sent to your email');
  })

  it('should return a 400 if validation fails on login', async () => {
    const formData = {
      email:'testgmail.com',
      password:'karenzi123456'
    }
    
    const response = await request(app).post('/api/auth/login').send(formData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined()
  })

  it('should return a 404 if account if not found during login', async () => {
    const formData = {
      email:'user@gmail.com',
      password:'user123456'
    }

    const response = await request(app).post('/api/auth/login').send(formData);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Account not found');
  })

  it('should return a 401 if password provided is incorrect, in login', async () => {
    const formData = {
      email:'test@gmail.com',
      password:'user123456'
    }

    const response = await request(app).post('/api/auth/login').send(formData);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect password');
  })

   // email verification tests
  it('should verify email successfully', async () => {
    const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'1h'})
    const response = await request(app).get(`/api/auth/verify_email/${token}`)
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email verification successful');
  })

  it('should request new email link successfully', async () => {
    const token = await getToken()
    const response = await request(app).post('/api/auth/request_new_link').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email sent successfully');
  })

  it('should return a 400 if user is already verified, upon requesting new link', async () => {
    const token = await getToken()
    const {_id} = await User.findOne({email:'testing@gmail.com'})
    await User.findByIdAndUpdate(_id,{isVerified:true})
    const response = await request(app).post('/api/auth/request_new_link').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User email is already verified');
  })

  it('should return a 409 when token is invalid on verify email', async () => {
    const token = 'fake token'
    const response = await request(app).get(`/api/auth/verify_email/${token}`)
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Invalid or expired token');
  })

   // 2fa tests
  it('should verify 2fa code successfully', async () => {
    await request(app).post('/api/auth/login').send(loginFormData);
    const {twoFactorAuth} = await User.findById(user._id)
    
    const response = await request(app).post(`/api/auth/verify_code/${user._id.toHexString()}`).send({
      twoFactorCode:twoFactorAuth.code
    })

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');

  })

  it('should request new 2fa code successfully', async () => {
    const response = await request(app).post(`/api/auth/request_new_code/${user._id.toHexString()}`)
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('A Two Factor Auth Code has been sent to your email');
  })

  it('should return a 409 for failed validation upon verifying 2fa code', async () => {
    const response = await request(app).post(`/api/auth/verify_code/${user._id.toHexString()}`).send({
      twoFactorCode:null
    })

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Two Factor Code is required');
  })

  it('should return a 404 when user is not found upon verifying 2fa code', async () => {
    const response = await request(app).post(`/api/auth/verify_code/${fakeId}`).send({
      twoFactorCode:123456
    })

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  })

  it('should return a 401 when 2fa code provided is incorrect', async () => {
    await request(app).post('/api/auth/login').send(loginFormData);
    const response = await request(app).post(`/api/auth/verify_code/${user._id.toHexString()}`).send({
      twoFactorCode:1111111
    })

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid code');
  })

  it('should return a 404 when user is not found upon requesting new 2fa code', async () => {
    const response = await request(app).post(`/api/auth/request_new_code/${fakeId}`)
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  })

  it('should return a 401 when user requests new 2fa code but their 2fa is disabled', async () => {
    await User.findByIdAndUpdate(user._id,{'twoFactorAuth.isEnabled':false})
    const response = await request(app).post(`/api/auth/request_new_code/${user._id.toHexString()}`)
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Please enable two factor authentication before requesting code');
  })

  it('should update 2fa enabled status', async () => {
    const token = await getToken()
    const response = await request(app).patch('/api/auth/toggle_2fa').send({status:false}).set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Update successful');
  })

  it('should return a 400 for failed validation upon enabling/disabling 2fa', async () => {
    const token = await getToken()
    const response = await request(app).patch('/api/auth/toggle_2fa').send({status:'nice'}).set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined()
  })
});
