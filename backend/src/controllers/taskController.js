const Task = require("../models/Task");
const { validateTask } = require("../utils/validators");

// Create Task (User)
const createTask = async (req, res, next) => {
  try {
    const error = validateTask(req.body);
    if (error) return res.status(400).json({ message: error });

    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      user: req.user._id
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (err) {
    next(err);
  }
};

// Get All Tasks (User gets own, Admin gets all)
const getTasks = async (req, res, next) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate("user", "name email role");
    } else {
      tasks = await Task.find({ user: req.user._id });
    }

    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

// Get Single Task
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate("user", "name email role");

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to access this task" });
    }

    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

// Update Task
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to update this task" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (err) {
    next(err);
  }
};

// Delete Task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this task" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
