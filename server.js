// Importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';

// App config
const app = express();
const port = process.env.PORT || 4200

// Middleware
app.use(express.json())

// DB config
const connection_uri = `mongodb+srv://admin:b7WJkmEQMZDv5TcO@cluster0.qlvoh.mongodb.net/whatsupDb?retryWrites=true&w=majority`

mongoose.connect(connection_uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// API routes
app.get('/', (req, res) => {
    res.status(200).send('hello programmer')
})

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err) res.status(500).send(err)
        else res.status(200).send(data)
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if(err) res.status(500).send(err)
        else res.status(201).send(`New message created: \n ${data}`)
    })
})


// Listener
app.listen(port, () => console.log(`Listening to the local host : ${port}`))
