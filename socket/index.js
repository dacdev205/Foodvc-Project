const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3001",
  },
});

// Sử dụng Map thay vì Array cho activeUsers
const activeUsers = new Map();

function addUser(userId, socketId) {
  activeUsers.set(userId, socketId);
  console.log("New User Connected", activeUsers);
}

function removeUser(socketId) {
  for (let [userId, id] of activeUsers) {
    if (id === socketId) {
      activeUsers.delete(userId);
      console.log("User Disconnected", activeUsers);
      break;
    }
  }
}

function sendMessage(data) {
  const { receiverId } = data;
  const socketId = activeUsers.get(receiverId);
  console.log("Sending from socket to:", receiverId);
  if (socketId) {
    io.to(socketId).emit("receive-message", data);
  }
}

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    addUser(newUserId, socket.id);
    io.emit("get-users", Array.from(activeUsers.keys()));
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("get-users", Array.from(activeUsers.keys()));
  });

  socket.on("send-message", sendMessage);
});
