const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please use a valid email");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password can't be 'password'.");
      }
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// Login Function
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({ error: "Unable to login." });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send({ error: "Unable to login." });
  }

  return user;
};

// Generate Token
userSchema.methods.generateAuthToken = async function() {
  const user = this;

  // generate token
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.MK_NODE_MONGO_SECRET
  );

  // add token to tokens array
  //   user.tokens = [...user.tokens, token];
  user.tokens = user.tokens.concat({ token });

  // save updated tokens array
  await user.save();

  return token;
};

// Hash password Middleware
userSchema.pre("save", async function(next) {
  const user = this;

  // For any incoming/changing passwords, hash them
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
