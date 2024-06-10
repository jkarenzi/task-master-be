const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    imageUrl: {
      type: Object,
      default: {
        publicId: 'default',
        url: process.env.DEFAULT_PROFILE_IMG,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorCode: {
      type: Object,
      default: {
        isEnabled: false,
        code: null,
      },
    },
  },
  { timestamps: true }
);

const User = model('User', UserSchema);

module.exports = User;
