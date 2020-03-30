const mongoose = require("mongoose");

mongoose.connect(
  `mongodb://${process.env.MK_NODE_MONGO_HOST}:${process.env.MK_NODE_MONGO_PORT}/${process.env.MK_NODE_MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
);
