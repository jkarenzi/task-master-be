export {};
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose')
const User = require('../src/models/User')
const bcrypt = require('bcrypt')
require('dotenv').config();
const cloudinary = require('../src/middleware/cloudinary')
const { connectDB, disconnectDB, getAdminToken } = require('./testSetup');

jest.mock('../src/middleware/cloudinary')

beforeAll(connectDB);
afterAll(disconnectDB);

interface cloudinaryUploadResult {
    public_id: string,
    url: string,
    [key: string]: unknown;
}

describe('User Controller tests', () => {
    let token:string;
    let userId:string;

    beforeAll(async() => {
        const password = await bcrypt.hash('test123456', 10);
        const user = new User({
            fullName: 'Test User',
            email: 'test@example.com',
            password: password
        });

        const newUser = await user.save();
        userId = newUser._id;

        token = await getAdminToken()
    })

    it('should get all users', async () => {
        const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200);
    });

    it('should get a user by ID', async () => {
        const res = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('_id', userId.toString());
    });

    it('should return 404 if user not found', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();
        const res = await request(app)
        .get(`/api/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
    });

    it('should change the password', async () => {
        const res = await request(app)
        .patch('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
            oldPassword: 'admin123456',
            newPassword: 'test123456',
        })

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Password successfully updated');
    });

    it('should return 400 if password validation fails', async () => {
        const res = await request(app)
        .patch('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
            oldPassword: '',
            newPassword: 'short',
        })
          
        expect(res.status).toBe(400)
        expect(res.body.message).toBeDefined();
    });

    it('should return 401 if old password is incorrect', async () => {
        const res = await request(app)
        .patch('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
            oldPassword: 'wrongpassword',
            newPassword: 'newpassword',
        })

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Incorrect password');
    });

    it('should change the email', async () => {
        const res = await request(app)
        .patch('/api/users/email')
        .set('Authorization', `Bearer ${token}`)
        .send({
            password: 'test123456',
            newEmail: 'new@example.com',
        })

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Email successfully updated');
        expect(res.body.data.email).toBe('new@example.com');
    });

    it('should return 400 if email validation fails', async () => {
        const res = await request(app)
          .patch('/api/users/email')
          .set('Authorization', `Bearer ${token}`)
          .send({
            password: 'newpassword',
            newEmail: 'invalid-email',
          })

        expect(res.status).toBe(400)
        expect(res.body.message).toBeDefined();
    });

    it('should return 401 if password is incorrect when changing email', async () => {
        const res = await request(app)
        .patch('/api/users/email')
        .set('Authorization', `Bearer ${token}`)
        .send({
            password: 'wrongpassword',
            newEmail: 'new@example.com',
        })

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Incorrect password');
    });

    it('should return a 409 if email already exists upon changing email', async () => {
        const res = await request(app)
        .patch('/api/users/email')
        .set('Authorization', `Bearer ${token}`)
        .send({
            password: 'test123456',
            newEmail: 'test@example.com',
        })

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('Email already exists');
    });

    it('should return a 204 upon successfully deleting a user', async () => {
        const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(204);
    })

    it('should return a 404 if user is not found upon deletion', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();
        const res = await request(app)
        .delete(`/api/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found')
    })

    it('should return a 409 if user tries to remove a non existent profile image', async () => {
        const res = await request(app)
        .delete('/api/users/profileImg')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('No profile image exists')
    })

    it('should change profile image successfully', async () => {
        cloudinary.uploader.upload_stream.mockImplementationOnce((callback:(error: Error|null, result: cloudinaryUploadResult) => void) => {
            callback(null, {public_id:'testid', url:'https://fakeurl.com/fake.png'});   
        });

        const res = await request(app)
        .patch('/api/users/profileImg')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('image', Buffer.from('mock-image-data'), 'image.jpg')

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Profile Image successfully updated')
    })

    it('should return a 400 if an error occurs while removing profile image', async () => {
        cloudinary.uploader.destroy.mockImplementationOnce(() => Promise.resolve({result:'not ok'}))
        const res = await request(app)
        .delete('/api/users/profileImg')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occured. Try again later')
    })

    it('should remove profile image successfully', async () => {
        cloudinary.uploader.destroy.mockImplementationOnce(() => Promise.resolve({result:'ok'}))
        const res = await request(app)
        .delete('/api/users/profileImg')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(204);
    })
});