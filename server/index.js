const http = require("http");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const expenseRoutes = require("./routes/expense");
const profileRoutes = require("./routes/profile");
const connectDB = require("./db");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));
app.use(authRoutes);
app.use(categoryRoutes);
app.use(expenseRoutes);
app.use(profileRoutes);

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
