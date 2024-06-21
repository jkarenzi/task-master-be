export {};
const request = require('supertest');
const app = require('../src/app');
require('dotenv').config()
const sendEmail = require('../src/utils/sendEmail')


const {connectDB, disconnectDB, getToken} = require('./testSetup')

beforeAll(connectDB)
afterAll(disconnectDB)

jest.mock('../src/utils/sendEmail')

describe('Board Controller tests', () => {
    let boardId:string;
    let token:string;

    const createBoardFormData = {
        name:'WEEK 1 BOARD',
        description:'my week 1 tasks'
    }

    const updateBoardFormData = {
        name:'WEEK 2 BOARD',
        description:'my week 1 tasks'
    }

    const failedValidationFormData = {
        theContent: 5
    }

    const signUpFormData = {
        fullName:'test test test',
        email:'test123@gmail.com',
        password:'testing123456'
    }

    const loginFormData = {
        email:'test123@gmail.com',
        password:'testing123456'
    }

    beforeAll(async() => {
        token = await getToken()
    })

    sendEmail.mockImplementationOnce(() => Promise.resolve({response:'ok'}))

   it('should create a new board successfully', async() => {
        const response = await request(app).post('/api/boards').send(createBoardFormData).set('Authorization', `Bearer ${token}`)
        boardId = response.body.data._id
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Board created successfully');
   })

   it('should return a 409 for duplicate board name upon creation', async() => {
        const response = await request(app).post('/api/boards').send(createBoardFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Board already exists');
   })

   it('should return a 400 for failed validation upon creating new board', async() => {
        const response = await request(app).post('/api/boards').send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
   })

   it('should get all boards successfully', async() => {
        const response = await request(app).get('/api/boards').set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
   })

   it('should update existing board successfully', async() => {
        const response = await request(app).patch(`/api/boards/${boardId}`).send(updateBoardFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined()
   })

   it('should return a 409 for duplicate board name upon updation', async() => {
        const createBoardData = {
            name:'WEEK 3 BOARD',
            description:'my week 1 tasks'
        }

        const createResponse = await request(app).post('/api/boards').send(createBoardData).set('Authorization', `Bearer ${token}`)

        const response = await request(app).patch(`/api/boards/${createResponse.body.data._id}`).send(updateBoardFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Board already exists');
   })

   it('should return a 400 for failed validation upon updation', async() => {
        const response = await request(app).patch(`/api/boards/${boardId}`).send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
   })

   it('should return a 409 if board is not found or does not belong to currently logged in user upon updation', async () => {
        await request(app).post('/api/auth/signup').send(signUpFormData);
        const loginResponse = await request(app).post('/api/auth/login').send(loginFormData);
        const createResponse = await request(app).post('/api/boards').send(createBoardFormData).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const response = await request(app).patch(`/api/boards/${createResponse.body.data._id}`).send(updateBoardFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Board not found or does not belong to currently logged in user');
   })

   it('should delete board successfully', async () => {
        const response = await request(app).delete(`/api/boards/${boardId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(204);
   })

   it('should return a 409 if board is not found or does not belong to currently logged in user upon deletion', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send(loginFormData);
        const createResponse = await request(app).post('/api/boards').send({name:'my board'}).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const response = await request(app).delete(`/api/boards/${createResponse.body.data._id}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Board not found or does not belong to currently logged in user');
   })
})