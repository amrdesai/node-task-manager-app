const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
});

userSchema.pre('save', async function (next) {
    const user = this;

    // Update password from TEXT to HASH
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Creating new user
const User = mongoose.model('User', userSchema);

module.exports = User;
