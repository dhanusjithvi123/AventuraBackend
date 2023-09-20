const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    chatRoom_id: {
        type: Schema.Types.ObjectId,
        ref: 'chatRoom',
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
    timeseries: true
});

const messageModel = mongoose.model('message', MessageSchema);
module.exports = messageModel; // Corrected "module.exports" here
