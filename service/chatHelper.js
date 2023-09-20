const chatRoomModel = require("../models/conversation.js");

async function chatRoomFinder(sender_id, receiver_id) {
    const result = await chatRoomModel.findOne({
        $or: [
            { sender_id: sender_id, receiver_id: receiver_id },
            { sender_id: receiver_id, receiver_id: sender_id },
        ],
    });

    if (result) {
        console.log(result._id);
        return result._id;
    } else {
        return null;
    }
}

module.exports = {
    chatRoomFinder: chatRoomFinder
};
