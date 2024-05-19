const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

async function connectDB() {
    await mongoose.connect('mongodb://localhost:27017/instaClone');
    console.log('Connected to MongoDB');
}

connectDB();

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    profilePic: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    bio:{
        type: String,
        default: ''
    }
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);