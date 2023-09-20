const { chatRoomFinder } = require('../service/chatHelper'); // Update the path as needed
 // Make sure this path is correct

function socketConnect(io, activeUsers) {
  let joined = false;
  let chatRoomId;
  io.on("connection", (socket) => {
    console.log('socket connected');

    socket.on('activate', async (userId) => {
      console.log("4");
      const newUserId = userId;
      if (!activeUsers[userId]) {
        activeUsers[newUserId] = { user_id: userId, socketId: socket.id };
      }
      if (activeUsers) {
        io.emit('active-users', activeUsers);
      }
    });

    socket.on("join", async (userIds) => {
      const newUserId = userIds.sender_id;
      chatRoomId = await chatRoomFinder(userIds.sender_id, userIds.receiver_id);
    
      if (!activeUsers[userIds.sender_id]) {
        activeUsers[newUserId] = { user_id: userIds.sender_id, socketId: socket.id };
      }
    
      if (chatRoomId) {
        joined = true;
        socket.join(chatRoomId);
        console.log('joined', userIds.sender_id);
        console.log("3");
      }
      io.emit("active-users", activeUsers);
    });
    

    socket.on("disconnectUser", (userId) => {
      Object.keys(activeUsers).forEach((key) => {
        if (activeUsers[key].user_id === userId) {
          delete activeUsers[key];
        }
        console.log("2");
      });
      console.log(activeUsers, 'after');

      io.emit("active-users", activeUsers);
    });

    socket.on("send-message", (data) => {
      if (!joined) {
        socket.join(chatRoomId);
        joined = true; // Add this line to prevent joining multiple times
      }
      console.log("1");
      console.log(data);
      console.log(activeUsers);
      const { receiver_id } = data;
      const receiver = activeUsers[receiver_id];
      console.log(receiver);
      if (receiver) {
       console.log(data.message)
        const message = { user: "receiver", message: data.message, time: Date.now() };
        console.log("61",message);
        socket.to(receiver.socketId).emit("receive-message", message);
      }
    });
  });
}

module.exports = socketConnect;
