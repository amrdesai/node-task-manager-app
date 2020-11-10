const express = require('express');
const router = new express.Router();
const User = require('../models/user');

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send();
    }
});

// Create user - Signup
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// User Login
router.post('/users/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findByCredentials(email, password);
        res.send(user);
    } catch (error) {
        res.status(400).send();
    }
});

// Get single user
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        // check if return has some data
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

// Update user
router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id;

    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((item) =>
        allowedUpdates.includes(item)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        // Find user
        const user = await User.findById(_id);

        // If no user send 404
        if (!user) {
            return res.status(404).send();
        }

        // update user
        updates.forEach((update) => (user[update] = req.body[update]));

        // save user
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete User
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            res.status(404).send('User not found!');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

// Export user routes
module.exports = router;
