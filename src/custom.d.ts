// custom.d.ts


import { Document } from 'mongoose';

interface IUser extends Document {
    fullName: string,
    email: string,
    password: string,
    role: string,
    profileImg: {
      publicId: string,
      url?: string
    },
    isVerified: boolean,
    twoFactorAuth: {
        isEnabled: boolean,
        code: number,
    } 
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser,
    files?: {
      image?: Express.Multer.File[];
    };
  }
}
