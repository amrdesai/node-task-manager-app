// Import library
const express = require('express');
const multer = require('multer');
const router = new express.Router();

// Import modules
const User = require('../models/user');
const auth = require('../middleware/auth');

// Create user - Signup
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
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
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
});

// User Logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        // Remove current token from the list of tokens
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// User Logout All Sessions
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        // Remove all token from the list of tokens
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// Get all users
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// Update user
router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((item) =>
        allowedUpdates.includes(item)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        // update user
        updates.forEach((update) => (req.user[update] = req.body[update]));
        // save user
        await req.user.save();
        // send response
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete User
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

// Avatar directory
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1048576,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/gm)) {
            return cb(new Error('File must be JPG, JPEG or PNG format'));
        }

        cb(undefined, true);
    },
});
// Uplaod user's avatar endpoint
router.post(
    '/users/me/avatar',
    upload.single('avatar'),
    (req, res) => {
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({
            error: error.message,
        });
    }
);

// Export user routes
module.exports = router;
