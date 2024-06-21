export {}
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    boardId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Board'
    },
    name:{
        type:String,
        required: true
    }
},{ timestamps: true });


const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
