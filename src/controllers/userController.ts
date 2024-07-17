import { Request, Response } from 'express';
import { IUser } from '../custom';
const { errorHandler } = require('../middleware/errorHandler');
const User = require('../models/User')
const bcrypt = require('bcrypt')
const {updatePasswordSchema, updateEmailSchema, updateFullNameSchema} = require('../middleware/validators/userSchema')
const cloudinary = require('../middleware/cloudinary')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const jwtSecret = process.env.JWT_SECRET

interface cloudinaryUploadResult {
  public_id: string,
  url: string,
  [key: string]: unknown;
}

const getAllUsers = errorHandler(async (req: Request, res: Response) => {
  const users = await User.find()
  return res.status(200).json({status:'success',data:users})
});

const getUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId
    const user = await User.findById(userId)
    if(!user){
        return res.status(404).json({status:'error',message:'User not found'})
    }

    return res.status(200).json({status:'success',data:user})
});

const changePassword = errorHandler(async (req: Request, res: Response) => {
    const formData = req.body
    const userId = req.user!._id

    const validationResult = updatePasswordSchema.validate(formData)

    if(validationResult.error){
        return res.status(400).json({status:'error', message:validationResult.error.details[0].message})
    }

    const user = await User.findOne({_id:userId})
    const passwordMatch:boolean = await bcrypt.compare(formData.oldPassword, user.password);

    if(!passwordMatch){
        return res.status(401).json({status:'error',message:'Incorrect password'})
    }

    const hashedPassword = await bcrypt.hash(formData.newPassword, 10)
    await User.findByIdAndUpdate(userId,{password: hashedPassword},{new:true})
    return res.status(200).json({status:'success', message:'Password successfully updated'})
});

const changeEmail = errorHandler(async (req: Request, res: Response) => {
    const formData = req.body
    const userId = req.user!._id

    const validationResult = updateEmailSchema.validate(formData)

    if(validationResult.error){
        return res.status(400).json({status:'error', message:validationResult.error.details[0].message})
    }

    
    const user = await User.findOne({_id:userId})

    const passwordMatch:boolean = await bcrypt.compare(formData.password, user.password);
    if(!passwordMatch){
        return res.status(401).json({status:'error', message: 'Incorrect password'})
    }

    const existingUser = await User.findOne({email:formData.newEmail})
    if(existingUser){
        return res.status(409).json({status:'error', message:'Email already exists'})
    }

    const updatedDoc = await User.findByIdAndUpdate(userId,{email:formData.newEmail},{new:true})
    const token = await jwt.sign({ updatedDoc }, jwtSecret, { expiresIn: '1h' });
    return res.status(200).json({status:'success', message: 'Email successfully updated', data:{token}})
});

const changeFullName = errorHandler(async (req: Request, res: Response) => {
  const formData = req.body
  const userId = req.user!._id

  const validationResult = updateFullNameSchema.validate(formData)

  if(validationResult.error){
      return res.status(400).json({status:'error', message:validationResult.error.details[0].message})
  }

  const updatedUser = await User.findByIdAndUpdate(userId,{fullName:formData.fullName},{new:true})
  const token = await jwt.sign({ updatedUser }, jwtSecret, { expiresIn: '1h' });

  return res.status(200).json({status:'success', data:{token}})

})

const changeProfileImg = errorHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id
    const user = await User.findOne({_id:userId})
    
    if(!(req.files && req.files.image)){
      return res.status(409).json({status:'error', message:'No file uploaded'});
    }

    const file =  req.files.image[0]

    const uploadResult:cloudinaryUploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream((error:Error, uploadResult:cloudinaryUploadResult) => {
        if (error) {
          return reject(error);
        }
        return resolve(uploadResult);
      }).end(file.buffer);
    });


    await cloudinary.uploader.destroy(user.profileImg.publicId,{invalidate:true})

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      {
        profileImg: {
          publicId:uploadResult.public_id,
          url:uploadResult.url
        }
      },
      {new:true}
    )

    const token = await jwt.sign({ updatedUser }, jwtSecret, { expiresIn: '1h' });

    return res.status(200).json({status:'success', message:'Profile Image successfully updated', data:{token}})
});

const removeProfileImg = errorHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id
    const user = await User.findOne({_id:userId})

    if(user.profileImg.publicId === 'default'){
      return res.status(409).json({status:'error', message:'No profile image exists'})
    }

    const result = await cloudinary.uploader.destroy(user.profileImg.publicId,{invalidate:true})

    let updatedUser: IUser;
    if(result.result === 'ok'){
      updatedUser = await User.findByIdAndUpdate(
        user._id, 
        {
          profileImg: {
            publicId: 'default',
            url: process.env.DEFAULT_PROFILE_IMG
          }
        }
      )

      const token = await jwt.sign({ updatedUser }, jwtSecret, { expiresIn: '1h' });
      return res.status(200).json({status:'success', data:{token}})
    }else{
      return res.status(400).json({status:'error', message:'An error occured. Try again later'})
    }
});

const deleteUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId
    const deletedUser = await User.findByIdAndDelete(userId)
    if(!deletedUser){
        return res.status(404).json({status:'error',message:'User not found'})
    }

    return res.status(204).json({})
});

module.exports = {
    getAllUsers,
    getUser,
    changeFullName,
    changeEmail,
    changePassword,
    changeProfileImg,
    removeProfileImg,
    deleteUser
}