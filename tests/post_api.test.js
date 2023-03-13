const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Post = require('../models/post')

//wrapped in superagent object
const api = supertest(app)

let authToken = {}

beforeEach(async () => {
    await Post.deleteMany({}) //delete all posts
    for (let post of helper.initialPosts) { //create two new posts
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

    describe('when user is not authenticated', () => {
        test('fails with no token', async () => {
            const postToCreate = {
                caption: 'test post three',
                imageLocation: "https://unsplash.com/photos/WC6MJ0kRzGw"
            }

            await api
                .post('/api/posts')
                .send(postToCreate)
                .expect(401)
        })

        test('fails with an invalid token', async () => {
            const postToCreate = {
                caption: 'test post four',
                imageLocation: "https://unsplash.com/photos/WC6MJ0kRzGw"
            }

            await api
                .post('/api/posts')
                .set('Authorization', 'Bearer ' + "aninvalidtoken")
                .send(postToCreate)
                .expect(401)
        })
    })

    describe('when user is authenticated', () => {

        beforeAll(async () => {
            await loginUser()
        })

        afterAll(async () => {
            authToken = {}
        })

        test('succeds with valid data', async () => {
            await api
                .post('/api/posts')
                .set('Authorization', 'Bearer ' + authToken)
                .send(helper.newValidPost)
                .expect(201)
        })

        test('fails with missing image', async () => {
            await api
                .post('/api/posts')
                .set('Authorization', 'Bearer ' + authToken)
                .send(helper.newInvalidPostMissingImage)
                .expect(400)
        })

        test('fails with missing caption', async () => {
            await api
                .post('/api/posts')
                .set('Authorization', 'Bearer ' + authToken)
                .send(helper.newInvalidPostMissingCaption)
                .expect(400)
        })

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

    test('fails with 404 if does not exist', async () => {

        const idToView = await helper.nonExistingPostId()
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

describe('updating a post', () => {
    test('succeds with 200 if valid id', async () => {
        const postsAtStart = await helper.postsInDb()
        const postToUpdate = postsAtStart[0]

        const newPostObject = {
            caption: "an updated caption"
        }

        await api
            .put(`/api/posts/${postToUpdate.id}`)
            .send(newPostObject)
            .expect(200)

        const postsAtEnd = await helper.postsInDb()
        const captions = postsAtEnd.map(p => p.caption)
        expect(captions).toContain(newPostObject.caption)

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

    test('fails with 404 if does not exist', async () => {
        const idToDelete = await helper.nonExistingPostId()
        await api
            .delete(`/api/posts/${idToDelete}`)
            .expect(404)

        const postsAtEnd = await helper.postsInDb()
        expect(postsAtEnd).toHaveLength(helper.initialPosts.length)
    })

    test('fails with 400 if invalid id', async () => {
        const idToDelete = 'aninvalidid'
        await api
            .delete(`/api/posts/${idToDelete}`)
            .expect(400)

        const postsAtEnd = await helper.postsInDb()
        expect(postsAtEnd).toHaveLength(helper.initialPosts.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

const loginUser = async () => {
    const userToLogin = {
        username: 'existingtestuser',
        password: 'easypassword'
    }
    const res = await api
        .post('/api/login')
        .send(userToLogin)
        .expect(200)

    authToken = res.body.token;
}

