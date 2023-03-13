const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('posts')
    response.json(users)
})

usersRouter.get('/:username', async (request, response, next) => {

    // const user = await User.find(request.params.username).populate('posts')
    // response.json(user)

    try {
        const user = await User.find({ username: request.params.username }).populate('posts')
        if (user.length) {
            response.json(user);
        } else {
            response.status(404).end();
        }
    } catch (error) {
        next(error);
    }
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    try {
        const user = new User({
            username,
            name,
            passwordHash,
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (error) {
        response.status(400).json({
            error: 'username not unique'
        })
    }
})

module.exports = usersRouter
