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

const nonExistingPostId = async () => {
    const post = new Post({
        caption: 'willbedeleted',
        imageLocation: 'willbedeleted'
    })
    await post.save()
    await post.remove()

    return post._id.toString()
}

const nonExistingUsername = async () => {
    const user = new User({
        name: 'willbedeleted',
        password: 'willbedeleted'
    })
    await user.save()
    await user.remove()

    return user.username
}

const newValidPost = {
    caption: "test post five",
    imageLocation: "https://images.unsplash.com/photo-1518349619113-03114f06ac3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
}
const newInvalidPostMissingCaption = {
    caption: "",
    imageLocation: "https://images.unsplash.com/photo-1518349619113-03114f06ac3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
}
const newInvalidPostMissingImage = {
    caption: "test post five",
    imageLocation: ""
}


const postsInDb = async () => {
    const posts = await Post.find({})
    return posts.map(post => post.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialPosts,
    newValidPost,
    newInvalidPostMissingCaption,
    newInvalidPostMissingImage,
    nonExistingPostId,
    nonExistingUsername,
    postsInDb,
    usersInDb
}