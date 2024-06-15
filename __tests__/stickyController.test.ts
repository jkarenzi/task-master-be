export {};
const request = require('supertest');
const app = require('../src/app');
require('dotenv').config()
const sendEmail = require('../src/utils/sendEmail')

const {connectDB, disconnectDB, getToken} = require('./testSetup')

beforeAll(connectDB)
afterAll(disconnectDB)

jest.mock('../src/utils/sendEmail')

describe('Sticky Notes  Controller Test', () => {
    let stickyId:string;
    let token:string;

    const createStickyNoteFormData = {
        content: 'This is my first sticky note'
    }

    const updateStickyNoteFormData = {
        content: 'This is my second sticky note'
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
        console.log(token)
    })

    sendEmail.mockImplementationOnce(() => Promise.resolve({response:'ok'}))

    it('should create new sticky note successfully', async() => {
        const response = await request(app).post('/api/sticky_notes').send(createStickyNoteFormData).set('Authorization', `Bearer ${token}`)
        console.log(response.body)
        stickyId = response.body.data._id
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Sticky note created successfully');
    })

    it('should return a 400 if validation fails upon creating a sticky note', async () => {
        const response = await request(app).post('/api/sticky_notes').send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
    })

    it('should get all sticky notes successfully', async () => {
        const response = await request(app).get('/api/sticky_notes').set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    })

    it('should update sticky note successfully', async() => {
        const response = await request(app).patch(`/api/sticky_notes/${stickyId}`).send(updateStickyNoteFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined()
    })

    it('should return a 400 if validation fails upon updating a sticky note', async () => {
        const response = await request(app).patch(`/api/sticky_notes/${stickyId}`).send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
    })

    it('should return a 409 if sticky note is not found or doesnt belong to currently logged in user upon updation', async () => {
        await request(app).post('/api/auth/signup').send(signUpFormData);
        const loginResponse = await request(app).post('/api/auth/login').send(loginFormData);
        const createResponse = await request(app).post('/api/sticky_notes').send(createStickyNoteFormData).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const response = await request(app).patch(`/api/sticky_notes/${createResponse.body.data._id}`).send(updateStickyNoteFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Sticky not found or does not belong to currently logged in user');
    })

    it('should delete a sticky note successfully', async () => {
        const response = await request(app).delete(`/api/sticky_notes/${stickyId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(204);
    })

    it('should return a 409 if sticky note is not found or doesnt belong to currently logged in user upon deletion', async () => {
        await request(app).post('/api/auth/signup').send(signUpFormData);
        const loginResponse = await request(app).post('/api/auth/login').send(loginFormData);
        const createResponse = await request(app).post('/api/sticky_notes').send(createStickyNoteFormData).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const response = await request(app).delete(`/api/sticky_notes/${createResponse.body.data._id}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Sticky not found or does not belong to currently logged in user');
    })

})

