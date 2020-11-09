const express = require("express");
const path = require("path");
const http = require("http");
const sio = require("socket.io");
const compression = require("compression");

const rooms = {};

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app).listen(port);
const io = sio(server, { origins: "*:*" });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../build")));
  app.use((req, res) =>
    res.sendFile(path.join(__dirname, "../../build/index.html"))
  );
} else {
  app.get("/", (req, res) => res.json({ status: "ok" }));
}
app.use(compression());
// Switch off the default 'X-Powered-By: Express' header
app.disable("x-powered-by");
io.sockets.on("connection", (socket) => {
  let currentRoomId = "";

  // Find
  socket.on("find", ({ roomId, user, game }) => {
    console.log("[server] find", socket.id);
    currentRoomId = roomId;
    socket.join(currentRoomId);
    if (!rooms[currentRoomId]) {
      // console.log('[server] clean room');
      rooms[currentRoomId] = {
        date: new Date(),
        users: [],
        game,
      };
      socket.emit("create");
    } else {
      socket.emit("join");
    }
    rooms[currentRoomId].users.push({
      id: socket.id,
      user,
    });
  });

  // Message
  socket.on("message", (message) =>
    socket.broadcast.to(currentRoomId).emit("message", message)
  );

  // Auth
  socket.on("auth", (data) => {
    console.log("[server] auth", socket.id);
    data.sid = socket.id;
    // sending to all clients in the room (channel) except sender
    socket.broadcast.to(currentRoomId).emit("approve", data);
  });

  // Accept
  socket.on("accept", (id) => {
    console.log("[server] accept", socket.id);
    io.sockets.connected[id].join(currentRoomId);
    // sending to all clients in 'game' room(channel), include sender
    io.in(currentRoomId).emit("bridge");
  });

  // Reject
  socket.on("reject", () => socket.emit("full"));

  // Leave
  socket.on("leave", () => {
    console.log("[server] leave", socket.id);
    socket.broadcast.to(currentRoomId).emit("hangup");
    socket.leave(currentRoomId);
  });
});
