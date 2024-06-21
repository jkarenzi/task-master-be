export {};
const request = require('supertest');
const app = require('../src/app');
require('dotenv').config()
const sendEmail = require('../src/utils/sendEmail')

const {connectDB, disconnectDB, getToken} = require('./testSetup')

beforeAll(connectDB)
afterAll(disconnectDB)

jest.mock('../src/utils/sendEmail')

describe('Label Controller tests', () => {
    let boardId:string;
    let labelId:string;
    let token:string;

    const createBoardFormData = {
        name:'WEEK 1 BOARD',
        description:'my week 1 tasks'
    }

    const updateLabelFormData = {
        name:'frontend',
        color:'#222222'
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

    it('should create a new label successfully', async() => {
        const boardResponse = await request(app).post('/api/boards').send(createBoardFormData).set('Authorization', `Bearer ${token}`)
        boardId = boardResponse.body.data._id
        const createLabelFormData = {
            name:'frontend',
            color:'#222222',
            boardId
        }

        const response = await request(app).post('/api/labels').send(createLabelFormData).set('Authorization', `Bearer ${token}`)
        labelId = response.body.data._id
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Label created successfully');
    })

    it('should return a 409 for duplicate label', async() => {
        const createLabelFormData = {
            name:'frontend',
            color:'#222222',
            boardId
        }

        const response = await request(app).post('/api/labels').send(createLabelFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Label already exists');
    })

    it('should return a 400 for failed validation upon creating new label', async() => {
        const response = await request(app).post('/api/labels').send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
    })
 
    it('should get all labels successfully', async() => {
        const response = await request(app).get(`/api/labels/${boardId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    })
 
    it('should update existing label successfully', async() => {
        const response = await request(app).patch(`/api/labels/${labelId}`).send(updateLabelFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined()
    })

    it('should return a 409 for duplicate label upon updation', async() => {
        const createLabelFormData = {
            name:'backend',
            color:'#333333',
            boardId
        }

        const labelResponse = await request(app).post('/api/labels').send(createLabelFormData).set('Authorization', `Bearer ${token}`)
        const response = await request(app).patch(`/api/labels/${labelResponse.body.data._id}`).send({name:'frontend',color:'#333333'}).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Label already exists');
    })
 
    it('should return a 400 for failed validation upon updation', async() => {
        const response = await request(app).patch(`/api/labels/${labelId}`).send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
    })
 
    it('should return a 409 if label is not found or does not belong to currently logged in user upon updation', async () => {
        await request(app).post('/api/auth/signup').send(signUpFormData);
        const loginResponse = await request(app).post('/api/auth/login').send(loginFormData);
        const boardResponse = await request(app).post('/api/boards').send(createBoardFormData).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const createLabelFormData = {
            name:'frontend',
            color:'#222222',
            boardId: boardResponse.body.data._id
        }

        const createResponse = await request(app).post('/api/labels').send(createLabelFormData).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const response = await request(app).patch(`/api/labels/${createResponse.body.data._id}`).send(updateLabelFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Label not found or does not belong to currently logged in user');
    })
 
    it('should delete label successfully', async () => {
        const response = await request(app).delete(`/api/labels/${labelId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(204);
    })
 
    it('should return a 409 if label is not found or does not belong to currently logged in user upon deletion', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send(loginFormData);
        const boardResponse = await request(app).post('/api/boards').send({name:'my board'}).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const createLabelFormData = {
            name:'backend',
            color:'#222222',
            boardId: boardResponse.body.data._id
        }

        const createResponse = await request(app).post('/api/labels').send(createLabelFormData).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const response = await request(app).delete(`/api/labels/${createResponse.body.data._id}`).send(updateLabelFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Label not found or does not belong to currently logged in user');
    })
})