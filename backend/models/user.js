const mongoose = require('mongoose');

//creat a user model

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    urls: [{
        originalURL: {
            type: String,
            required: true
        },
        shortURL: {
            type: String,
            required: true
        },
        qrCode:{
            type: Buffer
            
        }
    }]
});

module.exports = mongoose.model('User', userSchema);