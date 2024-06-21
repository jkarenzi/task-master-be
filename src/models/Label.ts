export {}
const mongoose = require('mongoose');

const LabelSchema = new mongoose.Schema({
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
    },
    color:{
        type:String,
        required: true
    }
},{ timestamps: true });


const Label = mongoose.model('Label', LabelSchema);

module.exports = Label;
