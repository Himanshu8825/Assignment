const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        url: String,
        filename: String
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;