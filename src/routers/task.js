// Import packages
const express = require('express');

// Import modules
const Task = require('../models/task');
const auth = require('../middleware/auth');

// Use express router
const router = new express.Router();

// Create task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(err);
    }
});

// Get all tasks
router.get('/tasks', auth, async (req, res) => {
    const owner = req.user._id;
    try {
        // Either or the 2 methods mentioned below works
        // const tasks = await Task.find({ owner });
        // res.send(tasks);
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send();
    }
});

// Get single task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const owner = req.user._id;

    try {
        const task = await Task.findOne({ _id, owner });
        // check if task exists
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const owner = req.user._id;

    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((item) => {
        return allowedUpdates.includes(item);
    });

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        // find task
        const task = await Task.findOne({ _id, owner });

        // check if task exists
        if (!task) {
            return res.status(404).send();
        }

        // update task
        updates.forEach((update) => {
            task[update] = req.body[update];
        });

        // save update
        await task.save();

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Task
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const owner = req.user._id;

    try {
        const task = await Task.findOneAndDelete({ _id, owner });
        if (!task) {
            res.status(404).send('Task not found!');
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

// Export user routes
module.exports = router;
