export {}
const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name:{
        type:String,
        required: true
    },
    description:{
        type:String
    }
},{ timestamps: true });


const Board = mongoose.model('Board', BoardSchema);

module.exports = Board;
