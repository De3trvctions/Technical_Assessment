import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import router from './routes.js'
import { initializeDatabase } from './config/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 50000

app.use(bodyParser.json({ limit: '10mb' }))
app.use(router)

const startServer = async () => {
	try {
		// Initialize the database and tables
		await initializeDatabase()
		// Once database is initialized, start the server
		app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}`)
		})
	} catch (error) {
		console.error('Failed to initialize the database:', error)
		// Throw the error to stop the application if initialization fails
		process.exit(1) // Exit the process with a failure code
	}
}

startServer()
