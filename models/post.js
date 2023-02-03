require('dotenv').config()
const mongoose = require('mongoose')

const url =
    `mongodb+srv://rbuckle:${process.env.MONGODB_PASSWORD}@cluster0.oe3kby1.mongodb.net/focal?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const postSchema = new mongoose.Schema({
    caption: String,
    imageLocation: String,
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