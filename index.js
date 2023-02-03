const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let posts = [
    {
        "id": 1,
        "caption": "HTML is easy",
        "imageLocation": "https:/url.com/1"
    },
    {
        "id": 2,
        "caption": "Browser can execute only JavaScript",
        "imageLocation": "https:/url.com/2"
    },
    {
        "id": 3,
        "caption": "GET and POST are the most important methods of HTTP protocol",
        "imageLocation": "https:/url.com/3"
    },
    {
        "caption": "Get up and sing",
        "id": 4
    },
    {
        "caption": "get up and sing",
        "id": 5
    },
    {
        "caption": "get down get dwn",
        "id": 6
    },
    {
        "caption": "still working",
        "id": 7
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/posts', (request, response) => {
    response.json(posts)
})

app.get('/api/posts/:id', (request, response) => {
    const id = Number(request.params.id)
    const post = posts.find(post => post.id === id)

    if (post) {
        response.json(post)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/posts/:id', (request, response) => {
    const id = Number(request.params.id)
    posts = posts.filter(post => post.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = posts.length > 0
        ? Math.max(...posts.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/posts', (request, response) => {
    const body = request.body

    if (!body.caption) {
        return response.status(400).json({
            error: 'caption missing'
        })
    }

    const post = {
        caption: body.caption,
        date: new Date(),
        id: generateId(),
    }

    posts = posts.concat(post)

    response.json(post)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})