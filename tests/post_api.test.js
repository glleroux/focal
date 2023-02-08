const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Post = require('../models/post')

//wrapped in superagent object
const api = supertest(app)

beforeEach(async () => {
    await Post.deleteMany({})
    for (let post of helper.initialPosts) {
        postObject = new Post(post)
        await postObject.save()
    }
})

describe('when there are initally some posts saved', () => {
    test('posts are returned as json', async () => {
        await api
            .get('/api/posts')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two posts', async () => {
        const response = await api.get('/api/posts')

        expect(response.body).toHaveLength(helper.initialPosts.length)
    })

    test('the first posts has caption one', async () => {
        const response = await api.get('/api/posts')

        const captions = response.body.map(r => r.caption)
        expect(captions).toContain(
            'test post one'
        )
    })
})

describe('adding a post', () => {
    test('succeeds with valid data', async () => {
        const newPost = {
            caption: 'test post new',
            imageLocation: "https://unsplash.com/photos/WC6MJ0kRzGw"
        }

        await api
            .post('/api/posts')
            .send(newPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const postsAtEnd = await helper.postsInDb()
        expect(postsAtEnd).toHaveLength(helper.initialPosts.length + 1)

        const captions = postsAtEnd.map(n => n.caption)
        expect(captions).toContain(
            'test post new'
        )

    })

    test('fails with 400 if invalid data', async () => {
        const invalidPost = {
            imageLocation: "https://unsplash.com/photos/WC6MJ0kRzGw"
        }

        await api
            .post('/api/posts')
            .send(invalidPost)
            .expect(400)

        const postsAtEnd = await helper.postsInDb()
        expect(postsAtEnd).toHaveLength(helper.initialPosts.length)
    })
})

describe('viewing a post', () => {
    test('succeeds with valid id', async () => {
        const postsAtStart = await helper.postsInDb()
        const postToView = postsAtStart[0]

        const resultPost = await api
            .get(`/api/posts/${postToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultPost.body.id).toEqual(postToView.id)
    })

    test('fails with 404 if not does not exist', async () => {

        const idToView = await helper.nonExistingId()
        await api
            .get(`/api/posts/${idToView}`)
            .expect(404)
    })

    test('fails with 400 if id is invalid', async () => {
        const idToView = 'aninvalidid'
        await api
            .get(`/api/posts/${idToView}`)
            .expect(400)
    })
})

describe('deleting a post', () => {
    test('succeeds with 204 if valid id', async () => {
        const postsAtStart = await helper.postsInDb()
        const postToDelete = postsAtStart[0]

        await api
            .delete(`/api/posts/${postToDelete.id}`)
            .expect(204)

        const postsAtEnd = await helper.postsInDb()
        expect(postsAtEnd).toHaveLength(helper.initialPosts.length - 1)

        const captions = postsAtEnd.map(p => p.caption)
        expect(captions).not.toContain(postToDelete.caption)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})