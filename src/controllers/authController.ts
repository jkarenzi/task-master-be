import { Request, Response } from 'express';
const { errorHandler } = require('../middleware/errorHandler');
const {
  signUpSchema,
  loginSchema,
  updateTwoFactorAuthSchema
} = require('../middleware/validators/authSchema');
const sendEmail = require('../utils/sendEmail')
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

  const savedUser = await newUser.save();

  const token = await jwt.sign({ _id: savedUser._id }, jwtSecret, { expiresIn: '1h' });
  const verifyLink = `${process.env.APP_URL}/api/auth/verify_email/${token}`

  await sendEmail('verify', formData.email, {name:formData.fullName, link:verifyLink})
  
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

  if(user.twoFactorAuth.isEnabled){
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000);
    await User.findByIdAndUpdate(user._id, {'twoFactorAuth.code':twoFactorCode})
    await sendEmail('2fa',user.email,{name:user.fullName, code:twoFactorCode.toString()})
    return res.status(200).json({status:'success',message:'A Two Factor Auth Code has been sent to your email'})
  }

  const token = await jwt.sign({ user }, jwtSecret, { expiresIn: '1h' });

  return res
    .status(200)
    .json({ status: 'success', message: 'Login successful', token });
});

const verifyEmail = async (req: Request, res: Response) => {
  try{
    const token = req.params.token
    const userId = await jwt.verify(token, jwtSecret)
    console.log(userId)

    await User.findByIdAndUpdate(userId,{isVerified:true},{new:true})
    return res.status(200).json({status:'success',message:'Email verification successful'})
  }catch(err){
    return res.status(409).json({status:'error',message:'Invalid or expired token'})
  } 
}

const requestVerifyLink = errorHandler(async (req:Request, res:Response) => {
  //@ts-expect-error yet to come up with the right type
  const userId = req.user._id
  const user = await User.findById(userId)
  if(user.isVerified){
    return res.status(400).json({status:'error',message:'User email is already verified'})
  }

  const token = await jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '1h' });
  const verifyLink = `${process.env.APP_URL}/api/auth/verify_email/${token}`

  await sendEmail('verify', user.email, {name:user.fullName, link:verifyLink})

  return res.status(200).json({status:'success',message:'Email sent successfully'})
})

const verifyTwoFactorCode = errorHandler(async (req:Request,res:Response) => {
  const { twoFactorCode } = req.body
  const userId = req.params.userId

  if(!twoFactorCode){
    return res.status(409).json({status:'error',message:'Two Factor Code is required'})
  }

  const user = await User.findOne({_id:userId})
  if(!user){
    return res.status(404).json({status:'error',message:'User not found'})
  }

  if(user.twoFactorAuth.code !== parseInt(twoFactorCode)){
    return res.status(401).json({status:'error',message:'Invalid code'})
  }

  await User.findByIdAndUpdate(user._id, {'twoFactorAuth.code':null})
  const token = await jwt.sign({ user }, jwtSecret, { expiresIn: '1h' });

  return res
    .status(200)
    .json({ status: 'success', message: 'Login successful', token });
})

const requestTwoFactorCode = errorHandler(async (req:Request, res:Response) => {
  const userId = req.params.userId
  const user = await User.findOne({_id:userId})
  if(!user){
    return res.status(404).json({status:'error',message:'User not found'})
  }

  if(!user.twoFactorAuth.isEnabled){
    return res.status(401).json({status:'error',message:'Please enable two factor authentication before requesting code'})
  }

  const twoFactorCode = Math.floor(100000 + Math.random() * 900000);
  await User.findByIdAndUpdate(user._id, {'twoFactorAuth.code':twoFactorCode})
  await sendEmail('2fa',user.email,{name:user.fullName, code:twoFactorCode.toString()})
  return res.status(200).json({status:'success',message:'A Two Factor Auth Code has been sent to your email'})
})

const toggleTwoFactorAuth = errorHandler(async (req:Request, res:Response) => {
  //@ts-expect-error yet to come up with the right type
  const userId = req.user._id
  const formData = req.body

  const validationResult = updateTwoFactorAuthSchema.validate(formData);

  if (validationResult.error) {
    return res
      .status(400)
      .json({
        status: 'error',
        message: validationResult.error.details[0].message,
      });
  }

  await User.findByIdAndUpdate(userId, {'twoFactorAuth.isEnabled':formData.status},{new:true})

  return res.status(200).json({status:'success',message:'Update successful'})
})

module.exports = {
  signUp,
  login,
  verifyEmail,
  requestVerifyLink,
  verifyTwoFactorCode,
  requestTwoFactorCode,
  toggleTwoFactorAuth
};
