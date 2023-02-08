const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Post = require('../models/post')

//wrapped in superagent object
const api = supertest(app)

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

beforeEach(async () => {
    await Post.deleteMany({})
    let postObject = new Post(initialPosts[0])
    await postObject.save()
    postObject = new Post(initialPosts[1])
    await postObject.save()
})

test('posts are returned as json', async () => {
    await api
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two posts', async () => {
    const response = await api.get('/api/posts')

    expect(response.body).toHaveLength(initialPosts.length)
})

test('the first posts has caption one', async () => {
    const response = await api.get('/api/posts')

    const captions = response.body.map(r => r.caption)
    expect(captions).toContain(
        'test post one'
    )
})

test('a valid post can be added', async () => {
    const newPost = {
        caption: 'test post new',
        imageLocation: "https://unsplash.com/photos/WC6MJ0kRzGw"
    }

    await api
        .post('/api/posts')
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/posts')

    const captions = response.body.map(r => r.caption)
    expect(response.body).toHaveLength(initialPosts.length + 1)
    expect(captions).toContain(
        'test post new'
    )

})

afterAll(async () => {
    await mongoose.connection.close()
})