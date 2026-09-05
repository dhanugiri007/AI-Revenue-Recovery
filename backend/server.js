require('dotenv').config();
require('dns').setServers(['8.8.8.8','8.8.4.4']);
const http = require("http");
const { Server } = require("socket.io");
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initSocket } = require("./src/config/socket");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});