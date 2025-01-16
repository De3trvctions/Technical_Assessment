import { db } from '../config/db.js'

class DataServices {
	async addData(data) {
		const query = 'INSERT INTO datalist (postId, id, name, email, body) VALUES ?'
		const values = data.map((item) => [item.postId, item.id, item.name, item.email, item.body])

		await db.query(query, [values])
	}

	// Method to list data with pagination and search filters
	async listData(offset, limit, name, email, body) {
		let query = `SELECT * FROM datalist `

		const conditions = []
		const params = []

		// Add search filters if provided
		if (name) {
			conditions.push('name LIKE ?')
			params.push(`%${name}%`)
		}
		if (email) {
			conditions.push('email LIKE ?')
			params.push(`%${email}%`)
		}
		if (body) {
			conditions.push('body LIKE ?')
			params.push(`%${body}%`)
		}

		if (conditions.length > 0) {
			query += ' WHERE ' + conditions.join(' AND ')
		}

		// Add pagination parameters
		query += ' LIMIT ? OFFSET ?'
		params.push(limit, offset)

		const [rows] = await db.query(query, params)
		return rows
	}

	// Method to count total number of records in the table with search filters
	async countData(name, email, body) {
		let query = 'SELECT COUNT(*) AS total FROM datalist'
		const conditions = []
		const params = []

		// Add search filters if provided
		if (name) {
			conditions.push('name LIKE ?')
			params.push(`%${name}%`)
		}
		if (email) {
			conditions.push('email LIKE ?')
			params.push(`%${email}%`)
		}
		if (body) {
			conditions.push('body LIKE ?')
			params.push(`%${body}%`)
		}

		if (conditions.length > 0) {
			query += ' WHERE ' + conditions.join(' AND ')
		}

		const [rows] = await db.query(query, params)
		return rows[0].total
	}
}

export default new DataServices()
