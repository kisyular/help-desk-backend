const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const PORT = process.env.PORT || 3500
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
