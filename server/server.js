const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
//console.log("MONGODB_URI:", process.env.MONGODB_URI);
const express = require("express");
const cors = require("cors");
const connectDB = require("../db/connect");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Stop server on failure
  });

// Mongoose Schema and Model
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.post("/submit", async (req, res) => {
  const { task, description } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  try {
    const saved = await Todo.create({ task, description });
    res.status(201).json({ message: "Todo saved", data: saved });
  } catch (err) {
    console.error("Error saving to DB:", err);
    res.status(500).json({ error: "Failed to save todo" });
  }
});

// GET route to fetch all todos
app.get("/entries", async (req, res) => {
  try {
    const data = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({ data });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.put("/entries/:id", async (req, res) => {
  const { id } = req.params;
  const { task, description, completed } = req.body;

  try {
    const updated = await Todo.findByIdAndUpdate(
      id,
      { task, description, completed },
      { new: true }
    );
    res.status(200).json({ message: "Updated", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete("/entries/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
