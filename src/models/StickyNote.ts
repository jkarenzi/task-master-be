export {}
const mongoose = require('mongoose');

const StickyNoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content:{
        type: String,
        required: true
    } 
},{ timestamps: true });


const StickyNote = mongoose.model('StickyNote', StickyNoteSchema);

module.exports = StickyNote;
