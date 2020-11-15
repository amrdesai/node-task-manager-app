// Import packages
const express = require('express');
require('./db/mongoose');

// Import modules
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Task Manager App');
});

// App started
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
