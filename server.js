// Importing
import express from 'express';

// App config
const app = express();
const port = process.env.PORT || 4200

// Middleware

// DB config

// API routes
app.get('/', (req, res) => {
    res.status(200).send('hello programmer')
})

// Listener
app.listen(port, () => console.log(`Listening to the local host : ${port}`))
