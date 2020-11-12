const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Please provide a valid age');
                }
            },
        },
        email: {
            type: String,
            unique: true,
            requiredL: true,
            trim: true,
            lowecase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email address!');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 7,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error(
                        "Your password can't contain the word 'password'"
                    );
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        avatar: {
            type: Buffer,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual property - Tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
});

// Public profile function
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

// Auth Token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisthesecretcode');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// Checking credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Incorrect credentials, Unable to login!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect credentials, Unable to login!');
    }

    return user;
};

// Hash the plain text password before saving (middleware)
userSchema.pre('save', async function (next) {
    const user = this;

    // Update password from TEXT to HASH
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Delete user tasks when user is removed (middleware)
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

// Creating new user
const User = mongoose.model('User', userSchema);

module.exports = User;
