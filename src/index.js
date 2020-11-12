// Import packages
const express = require('express');
require('./db/mongoose');

// Import modules
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// App started
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});

// TEST
const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
    // const task = await Task.findById('5facd5d7cd76e6408cc3f715');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    const user = await User.findById('5fabd00bedbe8f3024f6072c');
    await user.populate('tasks').execPopulate();
    console.log(user.tasks);
};
// main();
