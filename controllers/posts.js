const postsRouter = require('express').Router()
const Post = require('../models/post')

postsRouter.get('/', (request, response) => {
    Post.find({}).then(posts => {
        response.json(posts)
    })
})

postsRouter.get('/:id', (request, response, next) => {
    Post.findById(request.params.id)
        .then(post => {
            if (post) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

postsRouter.delete('/:id', (request, response) => {
    Post.findByIdAndRemove(request.params.id)
        .then(post => {
            response.status(204).end()
        }).catch(error => next(error))
})

postsRouter.post('/', (request, response, next) => {
    const body = request.body

    if (!body.caption) { //in the end should not accept no image, no caption is fine
        return response.status(400).json({
            error: 'caption missing'
        })
    }

    const post = new Post({
        caption: body.caption,
        imageLocation: body.imageLocation,
    })

    post.save().then(savedPost => {
        response.json(savedPost)
    }).catch(error => next(error))
})

postsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const post = {
        caption: body.caption
    }

    Post.findByIdAndUpdate(
        request.params.id,
        post, { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPost => {
            response.json(updatedPost)
        })
        .catch(error => next(error))
})

module.exports = postsRouter