const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const app = express(); 
const PORT = process.env.PORT || 3000;
connectDB();
app.use(express.json());
app.use("/api", authRoutes);
app.get("/", (req, res) => {
res.send(`
<h1>Complete Student REST API</h1>
<p>This API supports GET, POST, PATCH, and DELETE.</p>
<ul>
<li>GET /api/students</li>
<li>GET /api/students/:id</li>
<li>POST /api/students</li>
<li>PATCH /api/students/:id</li>
<li>DELETE /api/students/:id</li>
</ul>
`);
});
app.use((req, res) => {
res.status(404).json({ error: "Route not found" });
});
app.listen(PORT, () => {
console.log(`Running on http://localhost:${PORT}`);
});
