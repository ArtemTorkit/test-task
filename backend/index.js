//index.js

const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
	console.log('Received a request at /')
	res.send('Hello from our server!')
})

app.listen(1111, () => {
	console.log('server listening on port 1111')
})
