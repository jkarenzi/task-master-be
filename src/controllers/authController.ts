import { Request, Response } from 'express';
const { errorHandler } = require('../middleware/errorHandler');
const {
  signUpSchema,
  loginSchema,
} = require('../middleware/validators/authSchema');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET as string;

const signUp = errorHandler(async (req: Request, res: Response) => {
  const formData = req.body;

  const validationResult = signUpSchema.validate(formData);

  if (validationResult.error) {
    return res
      .status(400)
      .json({
        status: 'error',
        message: validationResult.error.details[0].message,
      });
  }

  const user = await User.findOne({ email: formData.email });
  if (user) {
    return res
      .status(409)
      .json({ status: 'error', message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(formData.password, 10);

  const newUser = new User({
    fullName: formData.fullName,
    password: hashedPassword,
    email: formData.email,
  });

  await newUser.save();
  return res
    .status(201)
    .json({ status: 'success', message: 'Signup successful!' });
});

const login = errorHandler(async (req: Request, res: Response) => {
  const formData = req.body;

  const validationResult = loginSchema.validate(formData);

  if (validationResult.error) {
    return res
      .status(400)
      .json({
        status: 'error',
        message: validationResult.error.details[0].message,
      });
  }

  const user = await User.findOne({ email: formData.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: 'error', message: 'Account not found' });
  }

  const passwordMatch: boolean = await bcrypt.compare(
    formData.password,
    user.password
  );
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ status: 'error', message: 'Incorrect password' });
  }

  const token = await jwt.sign({ user }, jwtSecret, { expiresIn: '1h' });

  return res
    .status(200)
    .json({ status: 'success', message: 'Login successful', token });
});

module.exports = {
  signUp,
  login,
};
