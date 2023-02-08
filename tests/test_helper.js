const Post = require('../models/post')
const User = require('../models/user')

const initialPosts = [
    {
        caption: "test post one",
        imageLocation: "https://unsplash.com/photos/aNEaWqVoT0g"
    },
    {
        caption: "test post two",
        imageLocation: "https://unsplash.com/photos/aNEaWqVoT0g"
    }
]

const nonExistingId = async () => {
    const post = new Post({
        caption: 'willbedeleted',
        imageLocation: 'willbedeleted'
    })
    await post.save()
    await post.remove()

    return post._id.toString()
}

const postsInDb = async () => {
    const posts = await Post.find({})
    return posts.map(post => post.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { initialPosts, nonExistingId, postsInDb, usersInDb }