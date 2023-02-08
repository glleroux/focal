const config = require('../utils/config')
const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

postsRouter.get('/', async (request, response) => {
    const posts = await Post.find({}).populate('author', { username: 1, name: 1 })
    response.json(posts)
})

postsRouter.get('/:id', async (request, response, next) => {
    try {
        const post = await Post.findById(request.params.id)
        if (post) {
            response.json(post)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

postsRouter.delete('/:id', async (request, response) => {
    try {
        const post = await Post.findByIdAndRemove(request.params.id)
        if (post) {
            response.status(204).end()
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

postsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, config.JWT_SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!body.caption) { //in the end should not accept no image, no caption is fine
        return response.status(400).json({
            error: 'caption missing'
        })
    }

    const post = new Post({
        caption: body.caption,
        imageLocation: body.imageLocation,
        author: user._id
    })

    try {
        const savedPost = await post.save()
        user.posts = user.posts.concat(savedPost._id)
        await user.save()
        response.status(201).json(savedPost)
    } catch (error) {
        next(error)
    }
})

postsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const post = {
        caption: body.caption
    }

    try {
        const updatedPost = Post.findByIdAndUpdate(
            request.params.id,
            post,
            { new: true, runValidators: true, context: 'query' }
        )
        response.json(updatedPost)
    } catch (error) {
        next(error)
    }
})

module.exports = postsRouter