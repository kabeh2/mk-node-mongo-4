require("./db/mongoose");
const debug = require("debug")("app:dev");
const helmet = require("helmet");
const userRouter = require("./routers/userRouter");
const express = require("express");
const server = express();

server.use(express.json());
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(helmet());

if (server.get("env") === "development") {
  debug("Morgan Logger enabled...");
}

// Routers
server.use("/api/users", userRouter);

module.exports = server;
