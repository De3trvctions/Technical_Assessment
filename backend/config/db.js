import mysql from 'mysql2/promise'

// MySQL database connection pool
export const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
})

// Ensure the database and table exist
export const initializeDatabase = async () => {
	const connection = await db.getConnection()
	try {
		// Create the datalist table if it doesn't exist
		await connection.query(`
      CREATE TABLE IF NOT EXISTS datalist (
        postId INT,
        id INT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        body TEXT
      )
    `)

		await connection.query(`
		CREATE TABLE IF NOT EXISTS datalisttest (
		  postId INT,
		  id INT PRIMARY KEY,
		  name VARCHAR(255),
		  email VARCHAR(255),
		  body TEXT
		)
	  `)

		console.log('Database and datalist table are initialized.')
	} catch (error) {
		console.error('Error initializing database:', error)
		throw error
	} finally {
		connection.release()
	}
}
