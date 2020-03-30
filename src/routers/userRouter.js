const User = require("../db/models/user.model");
const authUser = require("../middleware/authUser");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/me", authUser, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.patch("/me", authUser, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdate = ["username", "email", "password"];
    const verifiedUpdate = updates.every(update =>
      allowedUpdate.includes(update)
    );

    if (!verifiedUpdate) {
      return res
        .status(400)
        .send({ error: "Unidentified fields being updated." });
    }

    updates.forEach(update => (req.user[update] = req.body[update]));

    await req.user.save();

    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.delete("/me", authUser, async (req, res) => {
  try {
    await req.user.remove();

    res.status(200).send({ userDeleted: req.user });
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
