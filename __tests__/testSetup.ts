export {}
const request = require('supertest')
const app = require('../src/app');
const mongoose = require('mongoose')
require('dotenv').config()
const User = require('../src/models/User')
const bcrypt = require('bcrypt')

const url = process.env.MONGO_URL
const dbName = process.env.DB_NAME


const connectDB = async () => {
    await mongoose.connect(url, {dbName}) 
    console.log('Mongo db connected')
}

const disconnectDB = async () => {
   await mongoose.connection.dropDatabase()
   await mongoose.connection.close()
}

const getToken = async() => {
    const signupFormData = {
        fullName: 'Testing Tester',
        email:'testing@gmail.com',
        password:'test123456'
    }

    const loginFormData = {
        email:'testing@gmail.com',
        password:'test123456'
    }

    await request(app).post('/api/auth/signup').send(signupFormData)
    const loginResponse = await request(app).post('/api/auth/login').send(loginFormData)
    return loginResponse.body.token
}

const getAdminToken = async() => {
    const password = await bcrypt.hash('admin123456', 10);
    const user = new User({
        fullName: 'Test Admin',
        email: 'admin@admin.com',
        password: password,
        role: 'admin'
    });

    const newUser = await user.save();
    const loginResponse = await request(app).post('/api/auth/login').send({email:newUser.email, password: 'admin123456'})
    return loginResponse.body.token
}

module.exports = {getToken, getAdminToken, connectDB, disconnectDB}