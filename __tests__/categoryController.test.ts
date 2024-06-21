export {};
const request = require('supertest');
const app = require('../src/app');
require('dotenv').config()
const sendEmail = require('../src/utils/sendEmail')

const {connectDB, disconnectDB, getToken} = require('./testSetup')

beforeAll(connectDB)
afterAll(disconnectDB)

jest.mock('../src/utils/sendEmail')

describe('Category Controller tests', () => {
    let boardId:string;
    let categoryId:string;
    let token:string;

    const createBoardFormData = {
        name:'WEEK 1 BOARD',
        description:'my week 1 tasks'
    }

    const updateCategoryFormData = {
        name:'Doing'
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

    it('should create a new category successfully', async() => {
        const boardResponse = await request(app).post('/api/boards').send(createBoardFormData).set('Authorization', `Bearer ${token}`)
        boardId = boardResponse.body.data._id

        const createCategoryFormData = {
            name:'To do',
            boardId
        }

        const response = await request(app).post('/api/categories').send(createCategoryFormData).set('Authorization', `Bearer ${token}`)
        categoryId = response.body.data._id
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Category created successfully');
    })

    it('should return a 409 for duplicate category name', async() => {
        const createCategoryFormData = {
            name:'To do',
            boardId
        }

        const response = await request(app).post('/api/categories').send(createCategoryFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Category already exists');
   })
 
    it('should return a 400 for failed validation upon creating new category', async() => {
        const response = await request(app).post('/api/categories').send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
    })
 
    it('should get all categories successfully', async() => {
        const response = await request(app).get(`/api/categories/${boardId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    })
 
    it('should update existing category successfully', async() => {
        const response = await request(app).patch(`/api/categories/${categoryId}`).send(updateCategoryFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined()
    })

    it('should return a 409 for duplicate category name upon updation', async() => {      
        const createCategoryFormData = {
            name:'TEST',
            boardId
        }

        const categoryResponse = await request(app).post('/api/categories').send(createCategoryFormData).set('Authorization', `Bearer ${token}`)
        const response = await request(app).patch(`/api/categories/${categoryResponse.body.data._id}`).send(updateCategoryFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Category already exists');
    })
 
    it('should return a 400 for failed validation upon updation', async() => {
        const response = await request(app).patch(`/api/categories/${categoryId}`).send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
    })
 
    it('should return a 409 if category is not found or does not belong to currently logged in user upon updation', async () => {
        await request(app).post('/api/auth/signup').send(signUpFormData);
        const loginResponse = await request(app).post('/api/auth/login').send(loginFormData);
        const boardResponse = await request(app).post('/api/boards').send(createBoardFormData).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const createCategoryFormData = {
            name:'To do',
            boardId: boardResponse.body.data._id
        }

        const createResponse = await request(app).post('/api/categories').send(createCategoryFormData).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const response = await request(app).patch(`/api/categories/${createResponse.body.data._id}`).send(updateCategoryFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Category not found or does not belong to currently logged in user');
    })
 
    it('should delete category successfully', async () => {
        const response = await request(app).delete(`/api/categories/${categoryId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(204);
    })
 
    it('should return a 409 if category is not found or does not belong to currently logged in user upon deletion', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send(loginFormData);
        const boardResponse = await request(app).post('/api/boards').send({name:'my board'}).set('Authorization', `Bearer ${token}`)
        const createCategoryFormData = {
            name:'To do list',
            boardId: boardResponse.body.data._id
        }

        const createResponse = await request(app).post('/api/categories').send(createCategoryFormData).set('Authorization', `Bearer ${loginResponse.body.token}`)
        const response = await request(app).delete(`/api/categories/${createResponse.body.data._id}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Category not found or does not belong to currently logged in user');
    })
})