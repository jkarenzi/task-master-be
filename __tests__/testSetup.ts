export {}
const request = require('supertest')
const app = require('../src/app');
const mongoose = require('mongoose')
require('dotenv').config()

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

module.exports = {getToken, connectDB, disconnectDB}