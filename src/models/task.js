const mongoose = require('mongoose');

// Tasks scheema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

// Creating new tasks
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
