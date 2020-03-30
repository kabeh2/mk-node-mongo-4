require("dotenv").config();
const server = require("./src/server");
const debug = require("debug")("app:dev");

const port = process.env.PORT || process.env.MK_NODE_PORT;

server.listen(port, () => debug(`Server is listening on port ${port}...`));
