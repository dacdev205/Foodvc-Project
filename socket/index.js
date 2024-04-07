const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3001",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  const removedUser = users.find((user) => user.socketId === socketId);
  users = users.filter((user) => user.socketId !== socketId);
  if (removedUser) {
  }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, content }) => {
    const user = getUser(receiverId);
    if (user?.socketId) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        content,
      });
    }
  });
  
  

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
