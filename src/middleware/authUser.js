const User = require("../db/models/user.model");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization").replace("Bearer ", "");

    // Verify Token
    const decoded = jwt.verify(token, process.env.MK_NODE_MONGO_SECRET);

    // Find user with token
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    if (!user) {
      throw new Error({ error: "You're not logged in." });
    }

    // Pass through token
    req.token = token;

    // Pass through user
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = authUser;
