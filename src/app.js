// Import packages
const express = require('express');
require('./db/mongoose');

// Import modules
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Task Manager App');
});

module.exports = app;
