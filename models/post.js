const postSchema = new Schema({
    image: String,
    caption: String,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Post', postSchema);
