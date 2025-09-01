const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const User = require("../model/UserModel");

const router = express.Router();

router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

router.put("/users/:id", auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (role) user.role = role;
    await user.save();
    const safe = user.toObject();
    delete safe.password;
    return res.json(safe);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
