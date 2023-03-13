const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

//wrapped in superagent object
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('easypassword', 10)
        const user = new User({ username: 'existingtestuser', passwordHash })

        await user.save()
    })

    test('creation succeeds with a unique username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'uniqueusername',
            name: 'Test User',
            password: 'simplepassword',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with an existing username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'existingtestuser',
            name: 'Test User',
            password: 'simplepassword',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(result.body.error).toContain('username not unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    describe('viewing a user', () => {

        test('succeeds with a valid username', async () => {
            const usersAtStart = await helper.usersInDb()
            const usernameToView = usersAtStart[0].username

            await api
                .get(`/api/users/${usernameToView}`)
                .expect(200)
        })

        test('fails with 404 if username does not exist', async () => {
            const usernameToView = 'thisusernamedoesntexist'

            await api
                .get(`/api/users/${usernameToView}`)
                .expect(404)
        })
    })


})

afterAll(async () => {
    await mongoose.connection.close()
})