const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

// Get all tasks or filter by pending/completed status.
router.get("/", async (req, res) => {
  try {
    const filter = {
      user: req.session.userId,
    };

    if (req.query.status === "completed") {
      filter.completed = true;
    }

    if (req.query.status === "pending") {
      filter.completed = false;
    }

    const tasks = await Task.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({ tasks });
  } catch {
    return res.status(500).json({
      message: "Unable to retrieve tasks",
    });
  }
});

// Create a new task.
router.post("/", async (req, res) => {
  try {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      user: req.session.userId,
      title: req.body.title.trim(),
      description:
        typeof req.body.description === "string"
          ? req.body.description.trim()
          : "",
      dueDate: req.body.dueDate || null,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch {
    return res.status(500).json({
      message: "Unable to create task",
    });
  }
});

// Edit a task or change its completion status.
router.patch("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const updates = {};

    if (req.body.title !== undefined) {
      if (typeof req.body.title !== "string" || !req.body.title.trim()) {
        return res.status(400).json({
          message: "Task title cannot be empty",
        });
      }

      updates.title = req.body.title.trim();
    }

    if (req.body.description !== undefined) {
      if (typeof req.body.description !== "string") {
        return res.status(400).json({
          message: "Description must be text",
        });
      }

      updates.description = req.body.description.trim();
    }

    if (req.body.completed !== undefined) {
      if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({
          message: "Completed must be true or false",
        });
      }

      updates.completed = req.body.completed;
    }

    if (req.body.dueDate !== undefined) {
      updates.dueDate = req.body.dueDate || null;
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.session.userId,
      },
      updates,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch {
    return res.status(500).json({
      message: "Unable to update task",
    });
  }
});

// Delete a task.
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Unable to delete task",
    });
  }
});

module.exports = router;
