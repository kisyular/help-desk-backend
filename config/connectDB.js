const mongoose = require('mongoose')
require('colors')

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URI)
	} catch (err) {
		console.log(`Error: ${err.message}`.red)
	}
}

module.exports = connectDB
