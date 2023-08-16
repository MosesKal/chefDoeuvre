const express = require("express");
const morgan = require("morgan");
const auth = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const vendeurRoutes = require("./routes/seler");
const miningRoutes = require("./routes/mining");

const cors = require("cors");
require("dotenv").config();
const app = express();

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);

app.use(morgan("dev"));
app.set("socketio", io);
app.use(cors());

/** fichiers statiques */

app.use(express.static("uploads"));
app.use(express.json());

app.use(auth);
app.use(adminRoutes);
app.use(vendeurRoutes);
app.use(miningRoutes);

app.listen(2000, () => {
  console.log("Listening on 2000 ");
});
