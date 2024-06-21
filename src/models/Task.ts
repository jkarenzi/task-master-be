export {}
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
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
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    labels:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Label'
    }],
    title:{
        type:String,
        required: true
    },
    description:{
        type:String
    },
    dueDate:{
        type:Date
    }
},{ timestamps: true });


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
