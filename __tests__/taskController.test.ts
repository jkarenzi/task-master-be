export {};
const request = require('supertest');
const app = require('../src/app');
require('dotenv').config()


const {connectDB, disconnectDB, getToken} = require('./testSetup')

beforeAll(connectDB)
afterAll(disconnectDB)


describe('Task Controller tests', () => {
    let boardId:string;
    let categoryId:string;
    let taskId:string;
    let token:string;
    const fakeId = '667086bd065bc1073ac4ad01'

    const createBoardFormData = {
        name:'WEEK 1 BOARD',
        description:'my week 1 tasks'
    }

    const failedValidationFormData = {
        theContent: 5
    }

    beforeAll(async() => {
        token = await getToken()
    })

    it('should create a new task successfully', async() => {
        const boardResponse = await request(app).post('/api/boards').send(createBoardFormData).set('Authorization', `Bearer ${token}`)
        boardId = boardResponse.body.data._id
        const createCategoryFormData = {
            name:'To do',
            boardId
        }
        const categoryResponse = await request(app).post('/api/categories').send(createCategoryFormData).set('Authorization', `Bearer ${token}`)
        categoryId = categoryResponse.body.data._id
        const createTaskFormData = {
            boardId,
            title:'Task 1',
            categoryId: categoryResponse.body.data._id,
            labels:[]
        }

        const response = await request(app).post('/api/tasks').send(createTaskFormData).set('Authorization', `Bearer ${token}`)
        taskId = response.body.data._id

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task created successfully');
    })
 
    it('should return a 400 for failed validation upon creating new task', async() => {
        const response = await request(app).post('/api/tasks').send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
    })
 
    it('should get all tasks successfully', async() => {
        const response = await request(app).get(`/api/tasks/all/${boardId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    })

    it('should get one task successfully', async() => {
        const response = await request(app).get(`/api/tasks/${taskId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    })
 
    it('should update existing task successfully', async() => {
        const updateTaskFormData = {
            title:'Task 1',
            description:'first task',
            categoryId,
            labels:[] 
        }

        const response = await request(app).patch(`/api/tasks/${taskId}`).send(updateTaskFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined()
    })
 
    it('should return a 400 for failed validation upon updation', async() => {
        const response = await request(app).patch(`/api/tasks/${taskId}`).send(failedValidationFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined()
    })
 
    it('should return a 409 if task is not found or does not belong to currently logged in user upon updation', async () => {
        const updateTaskFormData = {
            title:'Task 1',
            description:'first task',
            categoryId,
            labels:[]
        }

        const response = await request(app).patch(`/api/tasks/${fakeId}`).send(updateTaskFormData).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Task not found or does not belong to currently logged in user');
    })
 
    it('should delete task successfully', async () => {
        const response = await request(app).delete(`/api/tasks/${taskId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(204);
    })
 
    it('should return a 409 if task is not found or does not belong to currently logged in user upon deletion', async () => {
        const response = await request(app).delete(`/api/tasks/${fakeId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Task not found or does not belong to currently logged in user');
    })
})