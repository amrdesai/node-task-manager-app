const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

// Create task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(err);
    }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (error) {
        res.status(500).send();
    }
});

// Get single task
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);
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
router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
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
        const task = await Task.findById(_id);

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
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findByIdAndDelete(_id);
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
