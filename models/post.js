const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    imageLocation: {
        type: String,
        required: true
    },
    caption: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post