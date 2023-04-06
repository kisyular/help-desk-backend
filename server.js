const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('colors')

const { logEvents } = require('./middleware/logger')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')

// Port
const PORT = process.env.PORT || 3500

// Connect to MongoDB
require('./config/connectDB')()

// Middleware for logging requests
app.use(logger)

// Middleware for parsing cookies
app.use(cookieParser())

// Middleware for parsing JSON
app.use(express.json())

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }))

// Middleware for CORS
app.use(cors(corsOptions))

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
	res.status(404)
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'))
	} else if (req.accepts('json')) {
		res.json({ message: '404 Not Found' })
	} else {
		res.type('txt').send('404 Not Found')
	}
})

// Middleware for error handling
app.use(errorHandler)

mongoose.connection.once('open', () => {
	console.log(`Connected to MongoDB`.bgCyan)
	app.listen(PORT, () =>
		console.log(`Server running on port ${PORT}`.bgGreen)
	)
})

mongoose.connection.on('error', (err) => {
	console.log(err)
	logEvents(
		`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
		'mongoErrLog.log'
	)
})
