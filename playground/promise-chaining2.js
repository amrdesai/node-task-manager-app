require('../src/db/mongoose');
const Task = require('../src/models/task');

const deleteTask = async (id) => {
    const deleteTask = await Task.findByIdAndRemove(id);
    const count = Task.countDocuments({ completed: false });
    return count;
};

deleteTask('5fa8ebb853a4af2118fc5898')
    .then((count) => {
        console.log(count);
    })
    .catch((error) => {
        console.log(error);
    });
