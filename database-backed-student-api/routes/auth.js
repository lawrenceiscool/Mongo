const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Student = require("../models/Student");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole.js");
const router = express.Router();
// POST /api/auth/register

router.get("/me", auth, async (req, res) => {
res.json({
id: req.user.id,
role: req.user.role
});
});

router.post("/auth/register", async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.create({
email,
password
});
res.status(201).json({
id: user._id,
email: user.email,
role: user.role
});
} catch (error) {
res.status(400).json({
error: error.message
});
}
});
// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
const ok = user && await bcrypt.compare(password, user.password);
if (!ok) {
return res.status(401).json({
error: "Invalid credentials"
});
}
const token = jwt.sign(
{
id: user._id,
role: user.role
},
process.env.JWT_SECRET,
{
expiresIn: "1h"
}
);
res.json({ token });
} catch (error) {
res.status(500).json({
error: "Server error"
});
}
});
// Student routes: /api/students
router.get("/students", async (req, res) => {
try {
const students = await Student.find();
res.json(students);
} catch (error) {
res.status(500).json({ error: "Server error" });
}
});
router.get("/students/:id", async (req, res) => {
try {
const student = await Student.findById(req.params.id);
if (!student) {
return res.status(404).json({ error: "Student not found" });
}
res.json(student);
} catch (error) {
res.status(400).json({ error: "Invalid student ID" });
}
});
router.post("/students", auth, async (req, res) => {try {
const created = await Student.create(req.body);
res.status(201).json(created);
} catch (error) {
res.status(400).json({ error: error.message });
}
});
router.patch("/students/:id", auth, async (req, res) => {
try {
const updated = await Student.findByIdAndUpdate(
req.params.id,
req.body,
{ new: true, runValidators: true }
);
if (!updated) {
return res.status(404).json({ error: "Student not found" });
}
res.json(updated);
} catch (error) {
res.status(400).json({ error: error.message });
}
});
router.delete("/students/:id", auth, requireRole("admin"), async (req, res) => {
try {
const deleted = await Student.findByIdAndDelete(req.params.id);
if (!deleted) {
return res.status(404).json({ error: "Student not found" });
}
res.status(204).send();
} catch (error) {
res.status(400).json({ error: "Invalid student ID" });
}
});

module.exports = router;
