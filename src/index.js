// Import packages
const express = require('express');
require('./db/mongoose');

// Import modules
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.port;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// App started
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
